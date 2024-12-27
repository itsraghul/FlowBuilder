"use server";

import { createCredentialSchema, createCredentialSchemaType } from "@/schema/credential";
import { checkIsUserAuthenticated } from "../checkUserAuthenticated";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { symmentricEncrypt } from "@/lib/encryption";


export const CreateCredential = async (form: createCredentialSchemaType) => {
    const { success, data } = createCredentialSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid form data");
    }

    const userId = await checkIsUserAuthenticated();

    //Encrypt the value
    const encryptedValue = symmentricEncrypt(data.value);

    const result = await prisma.credential.create({
        data: {
            userId,
            name: data.name,
            value: encryptedValue
        }
    });


    if (!result) {
        throw new Error("Failed to create credential");
    }

    revalidatePath("/credentials");
}