"use server"

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated"
import { Period } from "@/types/analytics";


export const GetPeriods = async () => {
    const userId = await checkIsUserAuthenticated();
    const currentYear = new Date().getFullYear();

    const years = await prisma.workflowExecution.aggregate({
        where: { userId },
        _min: { startedAt: true }
    });

    const minYear = years._min.startedAt ? years._min.startedAt.getFullYear() : currentYear;

    const periods: Period[] = [];
    for (let year = minYear; year <= currentYear; year++) {
        for (let month = 0; month <= 11; month++) {
            periods.push({ year, month })
        }
    }

    return periods;
}