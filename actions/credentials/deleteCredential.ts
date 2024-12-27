"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { revalidatePath } from "next/cache";


export const DeleteCredential = async (name: string) => {

    const userId = await checkIsUserAuthenticated();

    await prisma.credential.delete({
        where: {
            userId_name: {
                userId, name
            }
        }
    });


    revalidatePath("/credentials")
}