"use server";

import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function createPaymentIntent(items: { id: string; quantity: number }[], shippingDetails: any) {
    try {
        // 1. Fetch Settings to get Stripe Secret Key
        const settings = await prisma.storeSettings.findUnique({
            where: { id: "default" },
        });

        const apiKey = settings?.stripeSecretKey;
        if (!apiKey) {
            throw new Error("Stripe is not configured.");
        }

        const stripe = new Stripe(apiKey, {
            apiVersion: "2025-12-15.clover",
            typescript: true,
        });

        // 2. Validate Items & Calculate Total from DB (Security)
        let total = 0;
        const validItems = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.id },
            });

            if (!product) {
                throw new Error(`Product with ID ${item.id} not found.`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
            }

            total += Number(product.price) * item.quantity;
            validItems.push({
                ...item,
                price: Number(product.price),
                name: product.name,
                productId: product.id,
            });
        }

        // 3. Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // cents
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: {
                shipping_detais: JSON.stringify(shippingDetails),
            },
        });

        // 4. Create Pending Order in DB
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                email: shippingDetails.email,
                name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.postalCode}, ${shippingDetails.country}`,
                items: {
                    create: validItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // Update PaymentIntent with Order ID for Webhook matching
        await stripe.paymentIntents.update(paymentIntent.id, {
            metadata: {
                orderId: order.id
            }
        });

        return { clientSecret: paymentIntent.client_secret, orderId: order.id };

    } catch (error: any) {
        console.error("Payment Intent Error:", error);
        return { error: error.message };
    }
}
