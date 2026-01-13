"use server";

import prisma from "@/lib/prisma";

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { category: { name: { contains: query, mode: "insensitive" } } }
            ],
        },
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
                take: 1,
                select: { url: true, alt: true }
            }
        },
        take: 5,
    });

    return products;
}
