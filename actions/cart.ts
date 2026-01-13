"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./auth";

export interface CartItemInput {
    slug: string;
    quantity: number;
}

export async function syncCart(items: CartItemInput[]) {
    const session = await getSession();
    if (!session) return;

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { cart: true }
    });

    // Logic: This is a simplified "overwrite" strategy.
    // 1. Clear existing DB cart items? Or Merge?
    // Use Case: User adds items on mobile (guest), then logs in. Mobile items should be pushed to DB.
    // Use Case: User has items in DB, logs in on Desktop. Desktop should display DB items.

    // Decision: Client is source of truth during "Active Session". 
    // But initially, DB is source of truth.

    // Handling "Sync" is complex. 
    // Simpler MVP: 
    // - If items provided: Update DB cart with these items (Overwrite).
    // - If no items provided (onLoad): Return DB cart.

    if (items.length > 0) {
        // Upsert/Create Logic
        // For simplicity in this non-relational cart structure (assuming JSON or relation?)
        // Wait, schema doesn't have a Cart model yet! We need to add it.

        // Let's add Cart model first.
    }
}
