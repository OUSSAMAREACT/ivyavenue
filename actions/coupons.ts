"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Validation Logic ---

export type CouponValidationResult = {
    isValid: boolean;
    discountAmount: number;
    error?: string;
    coupon?: any;
};

export async function validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const coupon = await prisma.coupon.findUnique({
        where: { code }
    });

    if (!coupon) {
        return { isValid: false, discountAmount: 0, error: "Invalid coupon code." };
    }

    if (!coupon.isActive) {
        return { isValid: false, discountAmount: 0, error: "This coupon is inactive." };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return { isValid: false, discountAmount: 0, error: "This coupon has expired." };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return { isValid: false, discountAmount: 0, error: "This coupon has reached its usage limit." };
    }

    if (coupon.minOrderValue && cartTotal < Number(coupon.minOrderValue)) {
        return { isValid: false, discountAmount: 0, error: `Minimum order value of $${coupon.minOrderValue} required.` };
    }

    // Calculate Discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
        discount = (cartTotal * Number(coupon.discountValue)) / 100;
    } else {
        discount = Number(coupon.discountValue);
    }

    // Ensure discount doesn't exceed total
    if (discount > cartTotal) {
        discount = cartTotal;
    }

    return { isValid: true, discountAmount: discount, coupon };
}

// --- Admin Actions ---

export async function getCoupons() {
    return await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" }
    });
}

export async function createCoupon(formData: FormData) {
    const code = formData.get("code") as string;
    const discountType = formData.get("discountType") as string;
    const discountValue = formData.get("discountValue") as string;
    const minOrderValue = formData.get("minOrderValue") as string;
    const maxUses = formData.get("maxUses") as string;
    const expiresAt = formData.get("expiresAt") as string;

    try {
        await prisma.coupon.create({
            data: {
                code,
                discountType,
                discountValue: Number(discountValue),
                minOrderValue: minOrderValue ? Number(minOrderValue) : null,
                maxUses: maxUses ? Number(maxUses) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        });
    } catch (e) {
        console.error(e);
        throw new Error("Failed to create coupon. Code might be duplicate.");
    }

    revalidatePath("/admin/coupons");
    redirect("/admin/coupons");
}

export async function updateCoupon(id: string, formData: FormData) {
    const code = formData.get("code") as string;
    const discountType = formData.get("discountType") as string;
    const discountValue = formData.get("discountValue") as string;
    const minOrderValue = formData.get("minOrderValue") as string;
    const maxUses = formData.get("maxUses") as string;
    const expiresAt = formData.get("expiresAt") as string;

    await prisma.coupon.update({
        where: { id },
        data: {
            code,
            discountType,
            discountValue: Number(discountValue),
            minOrderValue: minOrderValue ? Number(minOrderValue) : null,
            maxUses: maxUses ? Number(maxUses) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        }
    });

    revalidatePath("/admin/coupons");
    redirect("/admin/coupons");
}

export async function deleteCoupon(id: string) {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
}

export async function toggleCoupon(id: string, currentState: boolean) {
    await prisma.coupon.update({
        where: { id },
        data: { isActive: !currentState }
    });
    revalidatePath("/admin/coupons");
}
