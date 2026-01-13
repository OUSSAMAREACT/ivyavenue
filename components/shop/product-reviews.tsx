"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
}

interface ProductReviewsProps {
    reviews: Review[];
    productName: string;
}

export function ProductReviews({ reviews, productName }: ProductReviewsProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center text-gray-500 italic py-12 bg-gray-50 rounded-lg">
                <p>No reviews yet for {productName}.</p>
                <p className="text-sm mt-2">Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-6 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-serif font-medium">{review.name}</span>
                            <div className="flex items-center space-x-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-4 h-4",
                                            i < review.rating ? "fill-black text-black" : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                        {review.comment && (
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        )}
                        <span className="text-xs text-gray-400 block pt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
