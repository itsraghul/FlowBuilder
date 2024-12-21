"use server";

import { auth } from "@clerk/nextjs/server";



export const checkIsUserAuthenticated = async () => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated user!");
    }

    return userId;
}