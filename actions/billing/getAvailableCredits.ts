"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";

export const GetAvailableCredits = async () => {
    const userId = await checkIsUserAuthenticated();


    const balance = await prisma.userBalance.findUnique({
        where: { userId: userId }
    });

    if (!balance) return -1;

    return balance.credits;
}