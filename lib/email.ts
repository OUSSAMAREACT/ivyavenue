import { Resend } from "resend";
import OrderConfirmationEmail from "@/components/emails/order-confirmation";
import prisma from "@/lib/prisma";

export async function sendOrderConfirmationEmail(
    toEmail: string,
    orderId: string,
    customerName: string,
    amountTotalCents: number
) {
    try {
        const settings = await prisma.storeSettings.findUnique({
            where: { id: "default" },
        });

        const apiKey = settings?.resendApiKey;

        if (!apiKey) {
            console.error("❌ Resend API Key missing. Email not sent.");
            return;
        }

        const resend = new Resend(apiKey);

        // Use the verified domain from settings if available, or fallback to a safe default
        // In production, users should configure their domain in Resend and store settings
        const fromEmail = "Ivy Avenue <orders@ivyavenue.fluxstudio.cloud>";

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            subject: `Order Confirmation #${orderId.slice(-8).toUpperCase()}`,
            react: OrderConfirmationEmail({
                orderId,
                customerName,
                total: amountTotalCents
            }),
        });

        if (error) {
            console.error("❌ Resend Error:", error);
            return;
        }

        console.log(`✅ Email sent to ${toEmail}`);
        return data;

    } catch (err) {
        console.error("❌ Unexpected Email Error:", err);
    }
}

export async function sendShippingConfirmationEmail(
    toEmail: string,
    orderId: string,
    customerName: string,
    carrier: string,
    trackingNumber: string
) {
    try {
        const settings = await prisma.storeSettings.findUnique({
            where: { id: "default" },
        });

        const apiKey = settings?.resendApiKey;

        if (!apiKey) {
            console.error("❌ Resend API Key missing. Email not sent.");
            return;
        }

        const resend = new Resend(apiKey);
        const fromEmail = "Ivy Avenue <orders@ivyavenue.fluxstudio.cloud>";

        // Import dynamically to avoid circular dependencies if any, 
        // though strictly not needed if structure is clean. 
        // Using direct import since we are in same file/module context usually.
        const { ShippingConfirmationEmail } = await import("@/components/emails/shipping-confirmation");

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            subject: `Your order #${orderId.slice(-8).toUpperCase()} has shipped!`,
            react: ShippingConfirmationEmail({
                orderId,
                customerName,
                carrier,
                trackingNumber
            }),
        });

        if (error) {
            console.error("❌ Resend Error:", error);
            return;
        }

        console.log(`✅ Shipping Email sent to ${toEmail}`);
        return data;

    } catch (err) {
        console.error("❌ Unexpected Email Error:", err);
    }
}

export async function sendPasswordResetEmail(email: string, token: string, userName: string) {
    // Determine base URL (safely for prod/dev) usually from env
    // For now hardcoding or using absolute if set, assuming Flux/Vercel URL structure or localhost
    // Best practice: process.env.NEXT_PUBLIC_APP_URL
    const domain = "https://ivyavenue.fluxstudio.cloud";
    const resetLink = `${domain}/new-password?token=${token}`;

    try {
        const settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
        const apiKey = settings?.resendApiKey;
        if (!apiKey) return;

        const resend = new Resend(apiKey);
        const fromEmail = "Ivy Avenue <orders@ivyavenue.fluxstudio.cloud>";

        // Dynamic import to avoid circular dependencies
        const { ResetPasswordEmail } = await import("@/components/emails/reset-password");

        await resend.emails.send({
            from: fromEmail,
            to: [email],
            subject: "Reset your Ivy Avenue password",
            react: ResetPasswordEmail({ resetLink, userName }),
        });

        console.log(`✅ Reset Email sent to ${email}`);

    } catch (err) {
        console.error("❌ Reset Email Error:", err);
    }
}
