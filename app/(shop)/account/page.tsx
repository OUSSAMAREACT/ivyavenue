import { getSession, logout } from "@/actions/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            orders: {
                orderBy: { createdAt: "desc" },
                include: { items: { include: { product: true } } }
            }
        }
    });

    if (!user) {
        // Should force logout if user not found in DB
        return <div>Session invalid.</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="font-serif text-3xl mb-2">My Account</h1>
                        <p className="text-gray-500">Welcome back, {user.name}</p>
                    </div>
                    <form action={logout}>
                        <Button variant="outline" className="rounded-none border-gray-200">Log Out</Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar / Profile Info */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 border border-gray-100">
                            <h2 className="font-medium mb-4">Personal Details</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>{user.email}</p>
                                <p>{user.phone || "-"}</p>
                                <p className="text-xs text-gray-400 mt-4">Password change not implemented yet.</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="lg:col-span-3">
                        <h2 className="font-serif text-xl mb-6">Order History</h2>
                        {user.orders.length === 0 ? (
                            <div className="bg-gray-50 p-12 text-center text-gray-500">
                                You haven't placed any orders yet.
                                <br />
                                <Link href="/shop" className="text-black underline mt-2 block">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {user.orders.map((order: any) => (
                                    <div key={order.id} className="border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                                        <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-gray-100">
                                            <div className="space-y-1">
                                                <p className="font-medium">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(Number(order.total))}</p>
                                                <span className={`inline-block px-2 py-1 text-xs mt-1 rounded-full ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                {/* Tracking Info */}
                                                {order.trackingNumber && (
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        <p className="font-medium text-black">Tracking:</p>
                                                        <p>{order.carrier}</p>
                                                        <p className="font-mono">{order.trackingNumber}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                                    <span>{item.product.name} x {item.quantity}</span>
                                                    <span>{formatCurrency(Number(item.price))}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
