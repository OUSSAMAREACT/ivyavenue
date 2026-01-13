"use client";

import { useCartStore } from "@/lib/store/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartIndicator() {
    const items = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
            </Link>
        );
    }

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            {itemCount > 0 && (
                <span className="absolute top-1 right-0.5 w-2 h-2 bg-black rounded-full" />
            )}
        </Link>
    );
}
