"use server";

import prisma from "@/lib/prisma";

export async function getRelatedProducts(productId: string) {
    // 1. Fetch the reference product to get its category
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { categoryId: true },
    });

    if (!product || !product.categoryId) {
        return [];
    }

    // 2. Fetch other products in the same category
    const related = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            NOT: {
                id: productId, // Exclude self
            },
        },
        take: 4, // Limit to 4 suggestions
        include: {
            images: true,
        },
    });

    return related;
}
