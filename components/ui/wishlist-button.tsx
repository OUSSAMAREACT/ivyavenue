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
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
            // Optimistic update
            const preOptimisticState = isInWishlist;
            setIsInWishlist(!preOptimisticState);

            try {
                const result = await toggleWishlist(productId);

                if (!result.success && result.message === "Unauthorized") {
                    // Revert on unauth
                    setIsInWishlist(preOptimisticState);

                    if (confirm("You must be logged in to save items to your wishlist. Proceed to login?")) {
                        router.push("/login?callbackUrl=" + window.location.pathname);
                    }
                } else if (!result.success) {
                    // Revert on other errors
                    setIsInWishlist(preOptimisticState);
                    console.error("Wishlist error:", result.message);
                }
            } catch (error) {
                // Revert on network/unexpected error
                setIsInWishlist(preOptimisticState);
                console.error("Wishlist unexpected error:", error);
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
