"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const userId = session.userId;

    const existing = await prisma.wishlist.findUnique({
        where: {
            userId_productId: {
                userId,
                productId
            }
        }
    });

    if (existing) {
        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
    } else {
        await prisma.wishlist.create({
            data: {
                userId,
                productId
            }
        });
    }

    revalidatePath("/shop");
    revalidatePath("/account/wishlist");
    revalidatePath(`/shop/${productId}`);
}

export async function getWishlist() {
    const session = await getSession();
    if (!session) return [];

    const wishlist = await prisma.wishlist.findMany({
        where: { userId: session.userId },
        include: { product: { include: { images: true } } }
    });

    return wishlist.map((item: any) => item.product);
}

export async function isInWishlist(productId: string) {
    const session = await getSession();
    if (!session) return false;

    const count = await prisma.wishlist.count({
        where: {
            userId: session.userId,
            productId
        }
    });

    return count > 0;
}
