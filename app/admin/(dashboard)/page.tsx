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

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-serif mb-8">Overview</h1>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading stats...</div>}>
                <DashboardStats />
            </Suspense>

            <div className="bg-white p-8 border border-gray-100 shadow-sm text-center py-12">
                <h3 className="text-xl font-medium mb-2">Welcome to Ivy Admin</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Select an option from the sidebar to manage your store.
                </p>
            </div>
        </div>
    );
}
