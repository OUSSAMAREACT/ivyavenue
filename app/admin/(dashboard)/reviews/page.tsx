import prisma from "@/lib/prisma";
import { Trash2, Star } from "lucide-react";
import { deleteReview } from "@/actions/reviews";
import { Button } from "@/components/ui/button";

export default async function AdminReviewsList() {
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: { product: true }
    });

    return (
        <div>
            <h1 className="text-3xl font-serif mb-8">Reviews</h1>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Comment</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reviews.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No reviews found.</td></tr>
                        ) : (
                            reviews.map((review: any) => (
                                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">{review.product.name}</td>
                                    <td className="p-4 text-gray-600">{review.name}</td>
                                    <td className="p-4">
                                        <div className="flex text-yellow-500">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="currentColor" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 max-w-xs truncate" title={review.comment}>{review.comment}</td>
                                    <td className="p-4 text-right">
                                        <form action={async () => {
                                            "use server";
                                            await deleteReview(review.id);
                                        }}>
                                            <Button variant="ghost" size="sm" type="submit" className="text-red-500 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
