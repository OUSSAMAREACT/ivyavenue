import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-12-15.clover", // Updated to match installed SDK version
    typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) {
            return new NextResponse("Missing signature or webhook secret", { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object as Stripe.Checkout.Session;

                // Ensure we have the order ID from metadata
                const orderId = session.metadata?.orderId;

                if (orderId) {
                    console.log(`✅ Payment successful for Order ${orderId}`);

                    await prisma.order.update({
                        where: { id: orderId },
                        data: {
                            status: "PAID",
                            // Optionally store stripe payment intent ID, customer ID etc.
                        },
                    });
                }
                break;

            // Handle other event types if needed (e.g., payment_intent.succeeded)
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        console.error(`Error processing webhook: ${error.message}`);
        return new NextResponse("Error processing event", { status: 500 });
    }

    return new NextResponse("Received", { status: 200 });
}
