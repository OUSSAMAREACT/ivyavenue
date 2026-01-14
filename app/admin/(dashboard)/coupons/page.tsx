import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { deleteCoupon } from "@/actions/coupons";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default async function AdminCouponsList() {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif">Coupons</h1>
                <Link href="/admin/coupons/new">
                    <Button className="bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition-colors gap-2">
                        <Plus size={18} /> New Coupon
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Discount</th>
                            <th className="p-4">Usage</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No coupons found.</td></tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        {coupon.code}
                                    </td>
                                    <td className="p-4">
                                        {coupon.discountType === "PERCENTAGE"
                                            ? `${coupon.discountValue}%`
                                            : formatCurrency(Number(coupon.discountValue))}
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {coupon.usedCount} / {coupon.maxUses || "∞"}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <Link href={`/admin/coupons/${coupon.id}`}>
                                            <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server";
                                            await deleteCoupon(coupon.id);
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
