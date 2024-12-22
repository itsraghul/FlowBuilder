import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/Nodes/appNodes";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment } from "@/types/executor";


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

    // Setup Execution Environment
    const environment: Environment = { phases: {} };

    //Initialze workflow execution
    await initializeWorkflowExecution(executionId, execution.workflowId);

    //Initialize phases
    await initializePhaseStatuses(execution);


    let creditsConsumed = 0;
    let executionFailed = false;

    for (const phase of execution.phases) {
        //execute phase
        const phaseExecution = await executeWorkflowPhase(phase, environment);
        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
        //Todo:consumed credits
    }

    //finalize execution
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);
    //Todo: clean up environment

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


const executeWorkflowPhase = async (phase: ExecutionPhase, environment: Environment) => {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;
    setupEnvironmentForPhase(node, environment);

    //Update Phase status
    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt
        }
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;

    console.log(`Executing Phase : ${phase.name} with ${creditsRequired} credits required`);

    //TODO : decrement user balance with the credits required

    // Execute phase simulation
    const success = await executePhase(phase, node, environment);


    await finalizePhase(phase.id, success);

    return { success };

}

const finalizePhase = async (phaseId: string, success: boolean) => {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completedAt: new Date()
        }
    })
}


const executePhase = async (phase: ExecutionPhase, node: AppNode, environment: Environment): Promise<boolean> => {
    const runFn = ExecutorRegistry[node.data.type];

    if (!runFn) {
        return false;
    }

    return await runFn(environment);
}

const setupEnvironmentForPhase = (node: AppNode, environment: Environment) => {
    environment.phases[node.id] = { inputs: {}, outputs: {} };

    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        //connected to output
    }
}