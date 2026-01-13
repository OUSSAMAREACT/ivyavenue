"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(prevState: any, formData: FormData) {
    const status = formData.get("status") as string;
    const orderId = formData.get("orderId") as string;

    if (!orderId || !status) return { error: "Missing fields" };

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { error: "Failed to update status" };
    }
}

export async function updateOrderTracking(prevState: any, formData: FormData) {
    const trackingNumber = formData.get("trackingNumber") as string;
    const carrier = formData.get("carrier") as string;
    const orderId = formData.get("orderId") as string;

    if (!orderId) return { error: "Missing Order ID" };

    try {
        // 1. Update Order
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                trackingNumber,
                carrier,
                status: "SHIPPED" // Auto-update status to SHIPPED if adding tracking
            }
        });

        // 2. Send Email (Fire and Forget)
        if (order.email) {
            // Dynamic import to avoid build-time static generation issues if any
            const { sendShippingConfirmationEmail } = await import("@/lib/email");
            await sendShippingConfirmationEmail(
                order.email,
                order.id,
                order.name,
                carrier,
                trackingNumber
            );
        }

        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("Update Tracking Error:", error);
        return { error: "Failed to update tracking" };
    }
}
