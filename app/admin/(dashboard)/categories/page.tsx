import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/categories";
import { Suspense } from "react";

function CategoriesTableFallback() {
    return (
        <div className="bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-400 animate-pulse">
            Loading categories...
        </div>
    );
}

async function CategoriesTable() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Products</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {categories.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No categories found.</td></tr>
                    ) : (
                        categories.map((cat: any) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-lg">{cat.name}</td>
                                <td className="p-4 font-mono text-gray-500">/{cat.slug}</td>
                                <td className="p-4 text-gray-600 max-w-xs truncate">{cat.description || "-"}</td>
                                <td className="p-4 text-gray-500">{cat._count.products}</td>
                                <td className="p-4 text-right flex justify-end gap-4">
                                    <Link href={`/admin/categories/${cat.id}`} className="text-gray-600 hover:text-black">
                                        <Edit size={18} />
                                    </Link>
                                    <form action={async () => {
                                        "use server";
                                        await deleteCategory(cat.id);
                                    }}>
                                        <button type="submit" className="text-red-400 hover:text-red-600 confirm-delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function AdminCategoriesList() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif">Categories</h1>
                <Link href="/admin/categories/new">
                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition-colors">
                        <Plus size={18} /> New Category
                    </button>
                </Link>
            </div>

            <Suspense fallback={<CategoriesTableFallback />}>
                <CategoriesTable />
            </Suspense>
        </div>
    );
}
