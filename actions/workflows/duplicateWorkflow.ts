"use server";

import { duplicateWorkFlowSchema, duplicateWorkflowSchemaType } from "@/schema/workflows";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";



export const DuplicateWorkflow = async (form: duplicateWorkflowSchemaType) => {
    const { success, data } = duplicateWorkFlowSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid form data");
    }

    const userId = await checkIsUserAuthenticated();

    const sourceWorkflow = await prisma.workflow.findUnique({
        where: {
            id: data.workflowId, userId: userId
        }
    });

    if (!sourceWorkflow) {
        throw new Error("Workflow not found");
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            name: data.name,
            description: data.description,
            type: data.type,
            status: WorkflowStatus.DRAFT,
            definition: sourceWorkflow.definition
        }
    });


    if (!result) {
        throw new Error("Failed to duplicate workflow");
    }

    revalidatePath("/workflows");
}