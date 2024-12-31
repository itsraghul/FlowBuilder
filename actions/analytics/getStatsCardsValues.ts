"use server";

import { Period } from "@/types/analytics";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { PeriodToDateRange } from "@/lib/helper/date";
import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export const GetStatsCardsValues = async (period: Period) => {
    const userId = await checkIsUserAuthenticated();
    const dateRange = PeriodToDateRange(period);

    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate
            },
            status: {
                in: [COMPLETED, FAILED]
            }
        },
        select: {
            creditsConsumed: true,
            phases: {
                where: {
                    creditsCost: {
                        not: null
                    }
                },
                select: {
                    creditsCost: true
                }
            }
        }
    });

    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: 0,
        phaseExecutions: 0
    }

    stats.creditsConsumed = executions.reduce((acc, execution) => acc + execution.creditsConsumed, 0);
    stats.phaseExecutions = executions.reduce((acc, execution) => acc + execution.phases.length, 0);

    return stats;
}