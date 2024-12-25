"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { WorkflowStatus } from "@/types/workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { revalidatePath } from "next/cache";


export const PublishWorkflow = async ({ id, flowDefinition }: { id: string, flowDefinition: string }) => {
    const userId = await checkIsUserAuthenticated();

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    });


    if (!workflow) throw new Error("Workflow not found");

    if (workflow.status !== WorkflowStatus.DRAFT) throw new Error("Workflow is not a draft workflow");

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) throw new Error("Flow Definition is not valid");

    if (!result.executionPlan) throw new Error("No execution plan generated");

    const creditsCost = CalculateWorkflowCost(flow.nodes);

    await prisma.workflow.update({
        where: {
            id, userId
        },
        data: {
            definition: flowDefinition,
            executionPlan: JSON.stringify(result.executionPlan),
            creditsCost: creditsCost,
            status: WorkflowStatus.PUBLISHED_LOCAL
        }
    });


    revalidatePath(`/workflow/editor/${id}`)

}