"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "lib/prisma";
import { redirect } from "next/navigation";
import { UpdateUserCurrencySchema } from "schema/userSettings";

export async function UpdateUserCurrency(currency: string){
    const parsedBody = UpdateUserCurrencySchema.safeParse({
        currency,
    });
    
    if(!parsedBody.success){
        throw parsedBody.error;
    }

    const user = await currentUser();
    if(!user){
        redirect("sign-in");
    }

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id,
        },
        data: {
            currency,
        },
    });
    return userSettings;
}