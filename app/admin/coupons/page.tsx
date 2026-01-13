import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { deleteCoupon, toggleCoupon } from "@/actions/coupons";

export default async function AdminCouponsPage() {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif">Coupons</h1>
                <Link href="/admin/coupons/new">
                    <Button className="bg-black text-white hover:bg-gray-800 rounded-none flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Coupon
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Code</th>
                            <th className="p-4 font-medium text-gray-500">Discount</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Usage</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50/50">
                                <td className="p-4 font-medium font-mono tracking-wide">{coupon.code}</td>
                                <td className="p-4">
                                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${Number(coupon.discountValue).toFixed(2)}`}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {coupon.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">
                                    {coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : "uses"}
                                </td>
                                <td className="p-4 text-right">
                                    <form className="inline-block mr-2">
                                        {/* Ideally a client component for toggling, but form action works fine */}
                                    </form>
                                    <form action={deleteCoupon.bind(null, coupon.id)} className="inline-block">
                                        <button className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No coupons created yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
