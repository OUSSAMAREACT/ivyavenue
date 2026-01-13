"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(prevState: any, formData: FormData) {
    const stripePublishableKey = formData.get("stripePublishableKey") as string;
    const stripeSecretKey = formData.get("stripeSecretKey") as string;
    const stripeWebhookSecret = formData.get("stripeWebhookSecret") as string;
    const resendApiKey = formData.get("resendApiKey") as string;
    const whatsappPhoneNumber = formData.get("whatsappPhoneNumber") as string;

    const mailchimpApiKey = formData.get("mailchimpApiKey") as string;
    const mailchimpAudienceId = formData.get("mailchimpAudienceId") as string;
    const mailchimpServerPrefix = formData.get("mailchimpServerPrefix") as string;

    try {
        await prisma.storeSettings.upsert({
            where: { id: "default" },
            update: {
                stripePublishableKey,
                stripeSecretKey,
                stripeWebhookSecret,
                resendApiKey,
                whatsappPhoneNumber,
                mailchimpApiKey,
                mailchimpAudienceId,
                mailchimpServerPrefix,
            },
            create: {
                id: "default",
                stripePublishableKey,
                stripeSecretKey,
                stripeWebhookSecret,
                resendApiKey,
                whatsappPhoneNumber,
                mailchimpApiKey,
                mailchimpAudienceId,
                mailchimpServerPrefix,
            },
        });

        revalidatePath("/admin/settings");
        return { success: true, message: "Settings saved successfully." };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Failed to save settings." };
    }
}
