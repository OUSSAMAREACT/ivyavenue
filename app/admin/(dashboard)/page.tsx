import prisma from "@/lib/prisma";
import { connection } from "next/server";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Package, ShoppingBag, Users } from "lucide-react";
import { Suspense } from "react";

async function DashboardStats() {
    await connection();
    const [orderCount, productCount, totalRevenue] = await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.order.aggregate({
            _sum: { total: true }
        })
    ]);

    const revenue = Number(totalRevenue._sum.total || 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Total Revenue" value={formatCurrency(revenue)} icon={<CreditCard size={20} />} />
            <StatCard label="Total Orders" value={orderCount.toString()} icon={<ShoppingBag size={20} />} />
            <StatCard label="Total Products" value={productCount.toString()} icon={<Package size={20} />} />
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-serif">{value}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-full text-gray-600">
                {icon}
            </div>
        </div>
    );
}

import { Overview } from "@/components/admin/overview";
import { OrdersChart } from "@/components/admin/orders-chart";

async function getGraphData() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo
            },
            status: {
                not: 'CANCELLED'
            }
        },
        select: {
            createdAt: true,
            total: true
        }
    });

    const groupedRevenue = new Map<string, number>();
    const groupedOrders = new Map<string, number>();

    // Fill map with dates in chronological order
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); // "14 Jan"
        groupedRevenue.set(key, 0);
        groupedOrders.set(key, 0);
    }

    orders.forEach(order => {
        const key = order.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        if (groupedRevenue.has(key)) {
            groupedRevenue.set(key, (groupedRevenue.get(key) || 0) + Number(order.total));
            groupedOrders.set(key, (groupedOrders.get(key) || 0) + 1);
        }
    });

    const graphData = Array.from(groupedRevenue.keys()).map((key) => ({
        name: key,
        total: groupedRevenue.get(key) || 0,
        orders: groupedOrders.get(key) || 0
    }));

    return graphData;
}

export default async function AdminDashboard() {
    const graphData = await getGraphData();

    return (
        <div>
            <h1 className="text-3xl font-serif mb-8">Overview</h1>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading stats...</div>}>
                <DashboardStats />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Revenue (Last 30 Days)</h3>
                    <Overview data={graphData} />
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Orders (Last 30 Days)</h3>
                    <OrdersChart data={graphData} />
                </div>
            </div>
        </div>
    );
}
