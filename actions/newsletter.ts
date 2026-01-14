"use server";

import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { success: false, message: "Email is required." };
    }

    try {
        // 1. Fetch settings from DB
        const settings = await prisma.storeSettings.findUnique({
            where: { id: "default" },
        });

        if (!settings?.mailchimpApiKey || !settings?.mailchimpAudienceId || !settings?.mailchimpServerPrefix) {
            return { success: false, message: "Newsletter configuration is missing. Please contact admin." };
        }

        const { mailchimpApiKey, mailchimpAudienceId, mailchimpServerPrefix } = settings;

        // Mock Mode for Testing/Verification
        if (mailchimpApiKey?.startsWith("key-") || process.env.NODE_ENV !== "production") {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate "Member Exists" if email contains "exist"
            if (email.includes("exist")) {
                return { success: true, message: "You are already on the list!" };
            }

            // Simulate Error if email contains "error"
            if (email.includes("error")) {
                return { success: false, message: "Failed to subscribe via mock." };
            }

            console.log("Mock Subscription Successful:", email);
            return { success: true, message: "Thank you for subscribing! (Mock)" };
        }

        // 2. Call Mailchimp API
        const url = `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members`;

        const data = {
            email_address: email,
            status: "subscribed",
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `apikey ${mailchimpApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // 3. Handle Response
        if (response.status >= 400) {
            const errorData = await response.json();

            // Check for "Member Exists" error
            if (errorData.title === "Member Exists") {
                return { success: true, message: "You are already on the list!" };
            }

            console.error("Mailchimp Error:", errorData);
            return { success: false, message: "Failed to subscribe. Please try again later." };
        }

        return { success: true, message: "Thank you for subscribing!" };

    } catch (error) {
        console.error("Newsletter Subscription Error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}
