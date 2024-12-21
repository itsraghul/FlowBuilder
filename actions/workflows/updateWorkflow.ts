"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";



export const UpdateWorkFlow = async ({ id, definition }: { id: string, definition: string }) => {
    const userId = await checkIsUserAuthenticated();

    const workflow = await prisma.workflow.findUnique({
        where: { id, userId }
    });


    if (!workflow) {
        throw new Error("Workflow not found!");
    }

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Workflow is not draft!");
    }

    await prisma.workflow.update({
        data: {
            definition
        },
        where: { id, userId }
    });

    revalidatePath("/workflows")
}