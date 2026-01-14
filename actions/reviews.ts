"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteReview(id: string) {
    await prisma.review.delete({
        where: { id },
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/shop/[slug]");
}

// Ensure products get reviews dynamically
export async function getProductReviews(productId: string) {
    return await prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
    });
}

// Submit a review
export async function submitReview(productId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;

    if (!name || !rating) {
        throw new Error("Missing fields");
    }

    await prisma.review.create({
        data: {
            name,
            rating,
            comment,
            productId,
        },
    });

    revalidatePath(`/shop`); // Ideally revalidate specific product page but path is dynamic
}
