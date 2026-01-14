"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "./button";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    rating?: number;
    reviewCount?: number;
}

export function ProductCard({ id, name, slug, price, image, rating = 0, reviewCount = 0 }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addItem);

    const handleQuickAdd = (e: React.MouseEvent) => {
        // e.preventDefault() is no longer needed if button is outside Link
        // but keeping stopPropagation is good practice if any parent is clickable
        e.stopPropagation();

        addToCart({
            id,
            name,
            price,
            image,
            quantity: 1,
            slug,
            maxStock: 99
        });

        toast.success("Added to cart");
    };

    return (
        <div className="group relative">
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                <Link href={`/shop/${slug}`} className="block h-full w-full">
                    <Image
                        src={image}
                        alt={name}
                        width={600}
                        height={800}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                </Link>

                {/* Quick Add Button - Now Sibling to Link */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
                    <Button
                        onClick={handleQuickAdd}
                        className="w-full bg-white text-black hover:bg-black hover:text-white shadow-lg border border-transparent hover:border-black font-medium tracking-wide"
                    >
                        Quick Add
                    </Button>
                </div>
            </div>

            <div className="mt-4 text-center space-y-2">
                <Link href={`/shop/${slug}`} className="block">
                    <h3 className="font-serif text-lg md:text-xl group-hover:text-gray-600 transition-colors">{name}</h3>
                </Link>
                <p className="text-gray-500 font-light">${price.toFixed(2)}</p>

                {/* Dynamic Star Rating */}
                {reviewCount > 0 && (
                    <div className="flex justify-center items-center gap-0.5 pt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={cn(
                                    "w-3 h-3 transition-colors",
                                    s <= Math.round(rating)
                                        ? "text-black fill-black"
                                        : "text-gray-300 fill-gray-100" // Empty star style
                                )}
                            />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">({reviewCount})</span>
                    </div>
                )}
            </div>
        </div>
    );
}
