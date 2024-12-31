"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { redirect } from "next/navigation";



export const SetupUser = async () => {
    const userId = await checkIsUserAuthenticated();

    const balance = await prisma.userBalance.findUnique({ where: { userId } });

    if (!balance) {
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 999
            }
        });
    }


    redirect("/");
}