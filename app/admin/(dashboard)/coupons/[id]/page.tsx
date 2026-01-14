import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createCoupon, updateCoupon } from "@/actions/coupons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function CouponEditor({ params }: { params: { id: string } }) {
    const { id } = await params;
    const isNew = id === 'new';

    let coupon = null;
    if (!isNew) {
        coupon = await prisma.coupon.findUnique({ where: { id } });
    }

    const action = isNew ? createCoupon : updateCoupon.bind(null, id);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/coupons">
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
                </Link>
                <h1 className="text-3xl font-serif">{isNew ? "New Coupon" : "Edit Coupon"}</h1>
            </div>

            <form action={action} className="space-y-6 bg-white p-8 border border-gray-100 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <Label>Code</Label>
                        <Input name="code" defaultValue={coupon?.code} placeholder="SUMMER2026" required className="uppercase" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Discount Type</Label>
                            <Select name="discountType" defaultValue={coupon?.discountType || "PERCENTAGE"}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                    <SelectItem value="FIXED">Fixed Amount (£)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Value</Label>
                            <Input name="discountValue" type="number" step="0.01" defaultValue={Number(coupon?.discountValue)} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Min Order Value (£)</Label>
                            <Input name="minOrderValue" type="number" step="0.01" defaultValue={Number(coupon?.minOrderValue) || 0} />
                        </div>
                        <div>
                            <Label>Max Uses</Label>
                            <Input name="maxUses" type="number" defaultValue={coupon?.maxUses || ""} placeholder="Unlimited" />
                        </div>
                    </div>

                    <div>
                        <Label>Expires At</Label>
                        <Input
                            name="expiresAt"
                            type="date"
                            defaultValue={coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : ""}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full bg-black text-white py-6">
                    <Save className="w-4 h-4 mr-2" /> Save Coupon
                </Button>
            </form>
        </div>
    );
}
