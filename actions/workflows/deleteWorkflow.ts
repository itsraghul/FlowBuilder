"use server";

import prisma from "@/lib/prisma";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import { revalidatePath } from "next/cache";


export const DeleteWorkflow = async (id: string) => {

    const userId = await checkIsUserAuthenticated();

    await prisma.workflow.delete({
        where: { userId, id }
    });


    revalidatePath("/workflows")
}