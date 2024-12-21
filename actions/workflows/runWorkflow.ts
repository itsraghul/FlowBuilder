"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus } from "@/types/workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";


export const RunWorkFlow = async (form: {
    workflowId: string;
    flowDefinition?: string;
}) => {
    const userId = await checkIsUserAuthenticated();

    const { workflowId, flowDefinition } = form;

    if (!workflowId) {
        throw new Error("WorkflowID is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId
        }
    });

    if (!workflow) {
        throw new Error("Workflow not found");

    }

    let executionPlan: WorkflowExecutionPlan;
    if (!flowDefinition) {
        throw new Error("FlowDefinition is not defined.");
    }

    const flow = JSON.parse(flowDefinition);

    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
        throw new Error("Flow definition not valid");
    }

    if (!result.executionPlan) {
        throw new Error("Execution plan not generated");
    }

    executionPlan = result.executionPlan;
    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: "MANUAL",
            phases: {
                create: executionPlan.flatMap(phase => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label
                        }
                    })
                })
            }
        },
        select: {
            id: true,
            phases: true
        }
    });

    if (!execution) {
        throw new Error("Execution plan not created");
    }

}