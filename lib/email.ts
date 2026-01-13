import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/components/emails/order-confirmation";
import prisma from "@/lib/prisma";

export async function sendOrderConfirmationEmail(
    toEmail: string,
    orderId: string,
    customerName: string,
    total: number
) {
    // 1. Fetch Settings from DB
    const settings = await prisma.storeSettings.findUnique({
        where: { id: "default" },
    });

    const apiKey = settings?.resendApiKey;

    if (!apiKey) {
        console.warn("⚠️ Resend API Key is missing in Store Settings. Email not sent.");
        return { success: false, error: "Settings missing" };
    }

    // 2. Initialize Resend dynamically
    const resend = new Resend(apiKey);

    try {
        const { data, error } = await resend.emails.send({
            from: "Ivy Avenue <orders@ivyavenue.com>", // Update with your verified domain in prod
            to: [toEmail],
            subject: `Order Confirmation #${orderId.slice(-8).toUpperCase()}`,
            react: OrderConfirmationEmail({ orderId, customerName, total }),
        });

        if (error) {
            console.error("❌ Resend Email Error:", error);
            return { success: false, error };
        }

        console.log(`📧 Email sent to ${toEmail}:`, data);
        return { success: true, data };
    } catch (err) {
        console.error("❌ Unexpected Email Error:", err);
        return { success: false, error: err };
    }
}
