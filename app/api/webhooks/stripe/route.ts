import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

// No top-level Stripe initialization to avoid build crashes or missing env vars.
// We initialize it dynamically inside the handler.

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    // 1. Fetch Settings from DB
    const settings = await prisma.storeSettings.findUnique({
        where: { id: "default" },
    });

    const apiKey = settings?.stripeSecretKey;
    const webhookSecret = settings?.stripeWebhookSecret;

    if (!apiKey || !webhookSecret) {
        console.error("❌ Stripe Keys are missing in Store Settings.");
        return new NextResponse("Stripe keys missing in settings", { status: 500 });
    }

    // 2. Initialize Stripe Dynamically
    const stripe = new Stripe(apiKey, {
        apiVersion: "2025-12-15.clover",
        typescript: true,
    });

    let event: Stripe.Event;

    try {
        if (!signature) {
            return new NextResponse("Missing Stripe signature", { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const orderId = paymentIntent.metadata?.orderId;

                if (orderId) {
                    console.log(`✅ Payment successful for Order ${orderId}`);

                    // Use a transaction to ensure order status and stock updates are atomic
                    await prisma.$transaction(async (tx: any) => {
                        // 1. Update Order Status
                        const order = await tx.order.update({
                            where: { id: orderId },
                            data: { status: "PAID" },
                            include: { items: true },
                        });

                        // 2. Decrement Stock for each item
                        for (const item of order.items) {
                            await tx.product.update({
                                where: { id: item.productId },
                                data: {
                                    stock: { decrement: item.quantity },
                                },
                            });
                        }
                    });

                    // Send Order Confirmation Email
                    try {
                        const { sendOrderConfirmationEmail } = await import("@/lib/email");
                        // For PaymentIntent, email is in receipt_email or metadata
                        const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.email;
                        // Use metadata for name as it's not always in PI
                        const customerName = paymentIntent.metadata?.name || "Customer";
                        const amountTotal = paymentIntent.amount;

                        if (customerEmail) {
                            await sendOrderConfirmationEmail(customerEmail, orderId, customerName, amountTotal);
                        }
                    } catch (emailError) {
                        console.error("Failed to send confirmation email:", emailError);
                    }
                }
                break;

            case "checkout.session.completed":
                // Legacy or if we use Hosted Checkout later
                const session = event.data.object as Stripe.Checkout.Session;
                const sessionOrderId = session.metadata?.orderId;

                if (sessionOrderId) {
                    console.log(`✅ Payment successful for Order ${sessionOrderId}`);

                    // Use a transaction to ensure order status and stock updates are atomic
                    await prisma.$transaction(async (tx: any) => {
                        // 1. Update Order Status
                        const order = await tx.order.update({
                            where: { id: sessionOrderId },
                            data: { status: "PAID" },
                            include: { items: true },
                        });

                        // 2. Decrement Stock for each item
                        for (const item of order.items) {
                            await tx.product.update({
                                where: { id: item.productId },
                                data: {
                                    stock: { decrement: item.quantity },
                                },
                            });
                        }
                    });

                    // Send Order Confirmation Email
                    // Dynamic import to avoid circular dep issues if any, handling env logic inside lib
                    const { sendOrderConfirmationEmail } = await import("@/lib/email");
                    const customerEmail = session.customer_details?.email;
                    const customerName = session.customer_details?.name || "Customer";
                    const amountTotal = session.amount_total || 0;

                    if (customerEmail) {
                        await sendOrderConfirmationEmail(customerEmail, sessionOrderId, customerName, amountTotal);
                    }
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        console.error(`Error processing webhook: ${error.message}`);
        return new NextResponse("Error processing event", { status: 500 });
    }

    return new NextResponse("Received", { status: 200 });
}
