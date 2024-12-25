"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";


export const GetWorkflowExecutions = async (workflowId: string) => {
    const userId = await checkIsUserAuthenticated();

    return prisma.workflowExecution.findMany({
        where: {
            workflowId, userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}