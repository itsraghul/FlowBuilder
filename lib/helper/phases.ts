import { ExecutionPhase } from "@prisma/client"


type Phase = Pick<ExecutionPhase, "creditsCost">

export const GetPhasesTotalCost = (phases: Phase[]) => {
    return phases.reduce((totalCost, phase) => totalCost + (phase.creditsCost || 0), 0);
}