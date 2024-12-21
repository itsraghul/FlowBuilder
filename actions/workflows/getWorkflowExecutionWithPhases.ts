"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";


export const GetWorkflowExecutionWithPhases = async (executionId: string) => {
    const userId = await checkIsUserAuthenticated();

    return prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
            userId: userId
        },
        include: {
            phases: {
                orderBy: {
                    number: "asc"
                }
            }
        }
    })

}   