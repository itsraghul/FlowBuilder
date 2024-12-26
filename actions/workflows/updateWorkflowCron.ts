"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";


export const UpdateWorkflowCron = async ({ id, cron }: { id: string, cron: string }) => {
    const userId = await checkIsUserAuthenticated();

    try {
        const interval = parser.parseExpression(cron, { utc: true });
        await prisma.workflow.update({
            where: { id, userId },
            data: {
                cron,
                nextRunAt: interval.next().toDate()
            }
        })

    } catch (error: any) {
        console.error("Invalid cron", error.message);
        throw new Error("Invalid Cron Expression");
    }


    revalidatePath("/workflows")
}