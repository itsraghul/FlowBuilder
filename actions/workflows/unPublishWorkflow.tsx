"use server"

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated"
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";



export const UnPublishWorkflow = async (id: string) => {
    const userId = await checkIsUserAuthenticated();

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId, id
        }
    });


    if (!workflow) throw new Error("Workflow not found");

    if (workflow.status !== WorkflowStatus.PUBLISHED_LOCAL) throw new Error("Workflow is not published");


    await prisma.workflow.update({
        where: {
            id,
            userId
        },
        data: {
            status: WorkflowStatus.DRAFT,
            executionPlan: null,
            creditsCost: 0
        }
    });

    revalidatePath(`/workflow/editor/${id}`);
}