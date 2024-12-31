"use server";

import { Period } from "@/types/analytics";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { PeriodToDateRange } from "@/lib/helper/date";
import prisma from "@/lib/prisma";
import { eachDayOfInterval, format } from "date-fns";
import { ExecutionPhaseStatus } from "@/types/workflow";

type Stats = Record<string, {
    success: number,
    failed: number
}>

const { COMPLETED, FAILED } = ExecutionPhaseStatus;


export const GetCreditsUsageInPeriod = async (period: Period) => {
    const userId = await checkIsUserAuthenticated();

    const dateRange = PeriodToDateRange(period);

    const executionPhases = await prisma.executionPhase.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate
            },
            status: {
                in: [COMPLETED, FAILED]
            }
        }
    });

    const dateFormat = "yyyy-MM-dd";

    const stats: Stats = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate
    }).map((date) => format(date, dateFormat))
        .reduce((acc, date) => {
            acc[date] = {
                success: 0,
                failed: 0
            }
            return acc;
        }, {} as any);

    executionPhases.forEach((phase) => {
        const date = format(phase.startedAt!, dateFormat);
        if (phase.status === COMPLETED) {
            stats[date].success += phase.creditsCost || 0;
        }
        if (phase.status === FAILED) {
            stats[date].failed += phase.creditsCost || 0;
        }
    });

    const result = Object.entries(stats).map(([date, infos]) => ({
        date, ...infos
    }));
    return result;
}