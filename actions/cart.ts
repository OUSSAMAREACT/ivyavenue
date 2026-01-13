"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./auth";
import { CartItem } from "@/lib/store/cart";

// We use the same interface but we might need to cast or transform if DB model differs slightly
// DB CartItem: id, cartId, productId, quantity
// Store CartItem: id, name, price, quantity, image, slug

export async function getCart() {
    const session = await getSession();
    if (!session) return null;

    const cart = await prisma.cart.findUnique({
        where: { userId: session.userId },
        include: {
            items: {
                include: {
                    product: {
                        include: { images: true }
                    }
                }
            }
        }
    });

    if (!cart) return null;

    // Transform to Store format
    const items: CartItem[] = cart.items.map((item: any) => ({
        id: item.productId, // We use productId as the ID in the store usually, or distinct ID? 
        // In store/cart.ts: id: string. usually product ID.
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
        image: item.product.images[0]?.url || "",
        slug: item.product.slug
    }));

    return items;
}

export async function syncCart(items: CartItem[]) {
    const session = await getSession();
    if (!session) return;

    // Verify user exists to avoid FK error
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true }
    });

    if (!user) return; // User might have been deleted, abort sync

    // Transactional update
    await prisma.$transaction(async (tx: any) => {
        // 1. Get or Create Cart
        let cart = await tx.cart.findUnique({
            where: { userId: session.userId }
        });

        if (!cart) {
            cart = await tx.cart.create({
                data: { userId: session.userId }
            });
        }

        // 2. Clear existing items (Simple "Client Logic Wins" strategy)
        // Alternatively we could merge, but that's complex logic. 
        // We'll replace server cart with client cart to ensure consistency with what user sees.
        await tx.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        // 3. Create new items
        if (items.length > 0) {
            await tx.cartItem.createMany({
                data: items.map(item => ({
                    cartId: cart.id,
                    productId: item.id, // Assuming item.id IS the productId from store
                    quantity: item.quantity
                }))
            });
        }

        // Update timestamp
        await tx.cart.update({
            where: { id: cart.id },
            data: { updatedAt: new Date() }
        });
    });
}
