"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";

const GetWorkflowPhaseDetails = async (phaseId: string) => {
    const userId = await checkIsUserAuthenticated();

    return prisma.executionPhase.findUnique({
        where: {
            id: phaseId,
            execution: {
                userId
            }
        },
        include: {
            logs: {
                orderBy: {
                    timeStamp: "asc"
                }
            }
        }
    })
}

export default GetWorkflowPhaseDetails