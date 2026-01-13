import { createCoupon } from "@/actions/coupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function NewCouponPage() {
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/coupons" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">
                    &larr; Back to Coupons
                </Link>
                <h1 className="text-3xl font-serif">Create Coupon</h1>
            </div>

            <form action={createCoupon} className="space-y-6 bg-white p-8 border border-gray-100 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <Input name="code" required placeholder="e.g. SUMMER2026" className="uppercase font-mono tracking-wide" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                        <select name="discountType" className="w-full h-10 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black">
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED">Fixed Amount ($)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <Input name="discountValue" type="number" step="0.01" required placeholder="e.g. 20" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order Value ($)</label>
                        <Input name="minOrderValue" type="number" step="0.01" placeholder="Optional" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                        <Input name="maxUses" type="number" placeholder="Optional" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <Input name="expiresAt" type="date" />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800 rounded-none px-8">
                        Create Coupon
                    </Button>
                </div>
            </form>
        </div>
    );
}
