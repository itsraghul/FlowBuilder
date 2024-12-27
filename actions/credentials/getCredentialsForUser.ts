"use server"

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated"

export const GetCredentialsForUser = async () => {

    const userId = await checkIsUserAuthenticated();

    return prisma.credential.findMany({
        where: { userId },
        orderBy: {
            name: "asc"
        }
    })
}