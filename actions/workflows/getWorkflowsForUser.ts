"use server";

import { checkIsUserAuthenticated } from "@/actions/checkUserAuthenticated";
import prisma from "@/lib/prisma";


export const GetWorkflowsForUser = async () => {
    const userId = await checkIsUserAuthenticated();

    return prisma.workflow.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })
}