"use client";

import { toggleWishlist } from "@/actions/wishlist";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    productId: string;
    initialIsInWishlist: boolean;
    className?: string;
}

export function WishlistButton({ productId, initialIsInWishlist, className }: WishlistButtonProps) {
    const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a Link
        e.stopPropagation();

        // Optimistic update
        const newState = !isInWishlist;
        setIsInWishlist(newState);

        startTransition(async () => {
            try {
                await toggleWishlist(productId);
            } catch (error) {
                // Revert on error
                setIsInWishlist(!newState);
                // Maybe toast here?
                // If unauthorized, could redirect to login?
                // But actions usually throw errors. 
                // Ideally we check session client side or handle error.
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn("p-2 rounded-full hover:bg-gray-100 transition-colors", className)}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={cn("w-5 h-5 transition-all",
                    isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
            />
        </button>
    );
}
