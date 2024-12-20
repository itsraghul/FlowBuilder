"use server";

import { checkIsUserAuthenticated } from "@/actions/checkUserAuthenticated";
import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkFlowSchema, createWorkflowSchemaType } from "@/schema/workflows";
import { AppNode } from "@/types/Nodes/appNodes";
import { TaskType } from "@/types/Tasks/task";
import { WorkflowStatus } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";


export const CreateWorkFlow = async (
    form: createWorkflowSchemaType
) => {
    const { success, data } = createWorkFlowSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid form data");
    }
    const userId = await checkIsUserAuthenticated();

    const initialFlow: {
        nodes: AppNode[], edges: Edge[]
    } = {
        nodes: [],
        edges: [],
    };

    //Adding initial flow
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialFlow),
            ...data,

        }
    })

    if (!result) {
        throw new Error("Failed to create workflow");
    }

    redirect(`/workflow/editor/${result.id}`)
} 