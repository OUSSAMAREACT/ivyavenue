import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateOrderStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    const orderId = formData.get("orderId") as string;

    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    if (!order) notFound();

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-serif">Order #{order.id.slice(-8)}</h1>
                    <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items */}
                    <div className="bg-white border border-gray-100 shadow-sm p-6">
                        <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
                            <Package size={18} /> Items
                        </h2>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 relative overflow-hidden">
                                            {/* Image placeholders would go here, fetching associated product images might be better */}
                                            {/* For now, just a grey box */}
                                        </div>
                                        <div>
                                            <div className="font-medium">{item.product.name}</div>
                                            <div className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(Number(item.price))}</div>
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        {formatCurrency(Number(item.price) * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center font-medium text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(Number(order.total))}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-white border border-gray-100 shadow-sm p-6">
                        <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
                            <Clock size={18} /> Status
                        </h2>
                        <form action={updateOrderStatus}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <div className="space-y-4">
                                <select
                                    name="status"
                                    defaultValue={order.status}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                                <button type="submit" className="w-full bg-black text-white py-2 font-medium hover:bg-gray-800 transition-colors">
                                    Update Status
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-6">
                        <div>
                            <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
                                <User size={18} /> Customer
                            </h2>
                            <p className="font-medium">{order.name}</p>
                            <p className="text-gray-500 text-sm">{order.email}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-6">
                            <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
                                <MapPin size={18} /> Shipping
                            </h2>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{order.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
