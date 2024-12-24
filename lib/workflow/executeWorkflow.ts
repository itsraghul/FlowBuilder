import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/Nodes/appNodes";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/Tasks/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";


export const ExecuteWorkflow = async (executionId: string) => {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId
        },
        include: {
            workflow: true,
            phases: true
        }
    });

    if (!execution) throw new Error("Execution not found");

    const edges = JSON.parse(execution.definition).edges as Edge[];

    // Setup Execution Environment
    const environment: Environment = { phases: {} };

    //Initialze workflow execution
    await initializeWorkflowExecution(executionId, execution.workflowId);

    //Initialize phases
    await initializePhaseStatuses(execution);


    let creditsConsumed = 0;
    let executionFailed = false;

    for (const phase of execution.phases) {
        //consumed credits
        const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);
        creditsConsumed += phaseExecution.creditsConsumed;
        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }

    }

    //finalize execution
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);
    // clean up environment
    await cleanUpEnvironment(environment);
    revalidatePath("/workflow/runs")
}


const initializeWorkflowExecution = async (executionId: string, workflowId: string) => {
    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    });

    await prisma.workflow.update({
        where: { id: workflowId },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId
        },
    })
}


const initializePhaseStatuses = async (execution: any) => {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING
        }
    })
};

const finalizeWorkflowExecution = async (executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) => {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: {
            id: executionId
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed: creditsConsumed
        }
    });


    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId
        },
        data: {
            lastRunStatus: finalStatus
        }
    }).catch(err => {
        //ignore
        //We must have triggered other runs for this worflow and failed due to race conditions
    });

}


const executeWorkflowPhase = async (phase: ExecutionPhase, environment: Environment, edges: Edge[], userId: string) => {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;
    const logCollector = createLogCollector()
    setupEnvironmentForPhase(node, environment, edges);

    //Update Phase status
    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs)
        }
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;

    logCollector.info(`Executing Phase : ${phase.name} with ${creditsRequired} credits required`);

    //decrement user balance with the credits required
    let success = await decrementCredits(userId, creditsRequired, logCollector);
    const creditsConsumed = success ? creditsRequired : 0;
    // Execute phase simulation
    if (success) {
        //Cannot execute if credits sufficient
        success = await executePhase(phase, node, environment, logCollector);
    }


    const outputs = environment.phases[node.id].outputs;
    await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);

    return { success, creditsConsumed };

}

const finalizePhase = async (phaseId: string, success: boolean, outputs: any, logCollector: LogCollector, creditsConsumed: number) => {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            outputs: JSON.stringify(outputs),
            creditsCost: creditsConsumed,
            logs: {
                createMany: {
                    data: logCollector.getAll().map(log => ({
                        message: log.message,
                        timeStamp: log.timeStamp,
                        logLevel: log.level
                    }))
                }
            }
        }
    })
}


const executePhase = async (phase: ExecutionPhase, node: AppNode, environment: Environment, logCollector: LogCollector): Promise<boolean> => {
    const runFn = ExecutorRegistry[node.data.type];

    if (!runFn) {
        return false;
    }

    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);

    return await runFn(executionEnvironment);
}

const setupEnvironmentForPhase = (node: AppNode, environment: Environment, edges: Edge[]) => {
    environment.phases[node.id] = { inputs: {}, outputs: {} };

    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        //connected to output
        const connectedEdge = edges.find(edge => (edge.target === node.id) && (edge.targetHandle === input.name));
        if (!connectedEdge) {
            console.error("Missing Edge for input ", input.name, node.id);
            continue;
        }

        const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];

        environment.phases[node.id].inputs[input.name] = outputValue;
    }
}

const createExecutionEnvironment = (node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<any> => {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],
        setOutput: (name: string, value: string) => (environment.phases[node.id].outputs[name] = value),
        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => (environment.browser = browser),
        getPage: () => environment.page,
        setPage: (page: Page) => (environment.page = page),
        log: logCollector
    }
}


const cleanUpEnvironment = async (environment: Environment) => {
    if (environment.browser) {
        await environment.browser.close().catch(err => console.error("Cannot close browser", err));
    }
}


const decrementCredits = async (userId: string, amount: number, logCollector: LogCollector) => {
    try {
        await prisma.userBalance.update({
            where: {
                userId: userId,
                credits: { gte: amount }
            },
            data: { credits: { decrement: amount } }
        });
        return true;
    } catch (error) {
        console.error(error);
        logCollector.error("Insufficient  balance.")
        return false;
    }
}