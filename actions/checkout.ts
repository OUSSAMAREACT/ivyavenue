"use server";

import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function createPaymentIntent(items: { id: string; quantity: number }[], shippingDetails: any, couponCode?: string) {
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

        // --- Coupon Logic ---
        let discount = 0;
        let couponId: string | null = null;

        if (couponCode) {
            // Import dynamically or use helper if cyclic dep issues, but here it should be fine
            // We need to re-validate because client state is not trusted for final calculation
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });

            // Simple validation re-run (or refactor validateCoupon to be shared utility, but avoiding large refactor)
            if (coupon && coupon.isActive) {
                // Check expiry, usage etc.
                const now = new Date();
                if ((!coupon.expiresAt || now <= coupon.expiresAt) &&
                    (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
                    (!coupon.minOrderValue || total >= Number(coupon.minOrderValue))) {

                    if (coupon.discountType === "PERCENTAGE") {
                        discount = (total * Number(coupon.discountValue)) / 100;
                    } else {
                        discount = Number(coupon.discountValue);
                    }
                    if (discount > total) discount = total;

                    couponId = coupon.id;
                }
            }
        }

        const finalAmount = Math.round((total - discount) * 100);

        // 3. Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: finalAmount > 50 ? finalAmount : 50, // Minimum charge requirements
            currency: "gbp",
            automatic_payment_methods: { enabled: true },
            metadata: {
                shipping_details: JSON.stringify(shippingDetails),
                couponCode: couponCode || "",
            },
        });

        // 4. Create Pending Order in DB
        const order = await prisma.order.create({
            data: {
                total: total - discount,
                status: "PENDING",
                email: shippingDetails.email,
                name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.postalCode}, ${shippingDetails.country}`,
                couponId: couponId,
                discount: discount,
                items: {
                    create: validItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // Increment usage count for coupon if applied
        if (couponId) {
            await prisma.coupon.update({
                where: { id: couponId },
                data: { usedCount: { increment: 1 } }
            });
        }

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
