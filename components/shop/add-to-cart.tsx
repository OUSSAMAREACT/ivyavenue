"use client";

import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddToCartProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        slug: string;
    };
    variant?: "default" | "quick" | "icon";
    className?: string;
}

export function AddToCart({ product, variant = "default", className }: AddToCartProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault(); // Stop link propagation
        e.stopPropagation();

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            slug: product.slug,
            quantity: 1,
        });

        // Simple feedback
        // In a real app, use a Toast component
        alert("Added to cart!");
    };

    if (variant === "quick") {
        return (
            <Button
                onClick={handleAdd}
                className={cn("w-full bg-white text-black hover:bg-black hover:text-white shadow-lg border border-transparent hover:border-black font-medium tracking-wide", className)}
            >
                Quick Add
            </Button>
        );
    }

    if (variant === "icon") {
        return (
            <button onClick={handleAdd} className={cn("p-2 hover:bg-gray-100 rounded-full", className)}>
                <ShoppingBag className="w-5 h-5" />
            </button>
        );
    }

    // Default (Product Detail Page usually)
    return (
        <Button
            onClick={handleAdd}
            size="lg"
            className={cn("w-full bg-black text-white hover:bg-gray-800 h-14 text-base tracking-widest uppercase rounded-none", className)}
        >
            Add to Cart
        </Button>
    );
}
