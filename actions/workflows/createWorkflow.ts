"use server";

import { checkIsUserAuthenticated } from "@/actions/checkUserAuthenticated";
import prisma from "@/lib/prisma";
import { createWorkFlowSchema, createWorkflowSchemaType } from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { redirect } from "next/navigation";


export const CreateWorkFlow = async (
    form: createWorkflowSchemaType
) => {
    const { success, data } = createWorkFlowSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid form data");
    }
    const userId = await checkIsUserAuthenticated();

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: "TODO",
            ...data,

        }
    })

    if (!result) {
        throw new Error("Failed to create workflow");
    }

    redirect(`/workflow/editor/${result.id}`)
} 