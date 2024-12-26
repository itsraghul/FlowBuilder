"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { revalidatePath } from "next/cache";


export const RemoveWorkflowScheduler = async (id: string) => {
    const userId = await checkIsUserAuthenticated();

    await prisma.workflow.update({
        where: { id, userId },
        data: {
            cron: null,
            nextRunAt: null
        }
    });

    revalidatePath("/workflows")
}