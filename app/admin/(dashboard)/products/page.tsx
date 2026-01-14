import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

/**
 * AdminProductTable Component
 * Fetches and displays the inventory table.
 */
async function AdminProductTable() {
    await connection(); // Use dynamic data sources
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });

    return (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                <thead className="bg-gray-50 text-gray-900 font-medium">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">SKU/Slug</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-right">Stock</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No products found.</td></tr>
                    ) : (
                        products.map((product: any) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 font-mono text-xs">{product.slug}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {product.category?.name || "Uncategorized"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">{formatCurrency(Number(product.price))}</td>
                                <td className="px-6 py-4 text-right">{product.stock}</td>
                                <td className="px-6 py-4 text-center">
                                    <Link href={`/admin/products/${product.id}`}>
                                        <Button variant="outline" size="sm" className="h-8 border-gray-200">
                                            Edit
                                        </Button>
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

export default function AdminProductsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif">Products</h1>
                <Link href="/admin/products/new">
                    <Button className="bg-black text-white rounded-none flex items-center gap-2 hover:bg-gray-800 transition-colors">
                        <Plus className="w-4 h-4" /> Add Product
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading inventory...</div>}>
                <AdminProductTable />
            </Suspense>
        </div>
    );
}
