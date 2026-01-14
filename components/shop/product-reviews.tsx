"use client";

import { Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/actions/reviews";

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
    productId: string;
}

export function ProductReviews({ reviews, productName, productId }: ProductReviewsProps) {
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        formData.append("rating", rating.toString());
        await submitReview(productId, formData);
        setIsSubmitting(false);
        // Reset form handling here if needed via key or separate state
    };

    return (
        <div className="space-y-12">

            {/* Review Form */}
            <div className="bg-gray-50/50 p-8 border border-gray-100 max-w-2xl mx-auto">
                <h3 className="font-serif text-xl mb-4 text-center">Write a Review</h3>
                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <div className="flex gap-1 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-6 h-6",
                                        star <= rating ? "fill-black text-black" : "text-gray-300"
                                    )}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input name="name" required className="w-full p-2 border border-blue-100/50 focus:border-black outline-none" placeholder="Your Name" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Comment</label>
                        <textarea name="comment" rows={3} className="w-full p-2 border border-blue-100/50 focus:border-black outline-none" placeholder="Share your thoughts..." ></textarea>
                    </div>

                    <Button className="w-full bg-black text-white hover:bg-gray-800" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center text-gray-500 italic py-12">
                    <p>No reviews yet for {productName}.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 border border-gray-100 shadow-sm space-y-3">
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
            )}
        </div>
    );
}
