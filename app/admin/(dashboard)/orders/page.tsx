import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

async function OrdersTable() {
    await connection();
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { items: true } } }
    });

    return (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Total</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td></tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-xs">{order.id.slice(-8)}</td>
                                <td className="p-4">
                                    <div className="font-medium">{order.name}</div>
                                    <div className="text-xs text-gray-500">{order.email}</div>
                                </td>
                                <td className="p-4 text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                        ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 font-medium">{formatCurrency(Number(order.total))}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black hover:underline">
                                        <Eye className="w-4 h-4" /> View
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function AdminOrdersPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif">Orders</h1>
            </div>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading orders...</div>}>
                <OrdersTable />
            </Suspense>
        </div>
    );
}
