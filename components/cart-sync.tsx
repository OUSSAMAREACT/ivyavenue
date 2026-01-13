"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store/cart";
import { getCart, syncCart } from "@/actions/cart";

export function CartSync() {
    const { items, setItems } = useCartStore();
    const isFirstMount = useRef(true);

    // 1. On Mount: Fetch Cart from Server and Merge/Set
    useEffect(() => {
        async function initCart() {
            try {
                const serverItems = await getCart();
                if (serverItems) {
                    // Logic: If (serverItems exist)
                    // If local items are empty, just use server items.
                    // If local items exist, technically we should ask user or merge.
                    // For now: taking server items as truth if they exist, 
                    // BUT if we just added items as guest and logged in, we want those guest items to populate server.

                    // Complex Scenario. 
                    // Happy path: User logs in. Server has items. Client has 0. -> Load Server.
                    // Happy path 2: User adds items as guest. Logs in. Server has 0. -> Push Client (handled by step 2).

                    if (items.length === 0 && serverItems.length > 0) {
                        setItems(serverItems);
                    }
                }
            } catch (err) {
                console.error("Failed to sync cart", err);
            }
        }

        initCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. On Change: Push to Server
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        // Debounce?
        const timeoutId = setTimeout(() => {
            syncCart(items);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [items]);

    return null;
}
