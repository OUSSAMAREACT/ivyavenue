import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deletePage } from "@/actions/pages";
import { Suspense } from "react";

function PagesTableFallback() {
    return (
        <div className="bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-400 animate-pulse">
            Loading pages...
        </div>
    );
}

async function PagesTable() {
    const pages = await prisma.page.findMany({
        orderBy: { updatedAt: "desc" }
    });

    return (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4">Last Updated</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {pages.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-500">No pages found. Create one to get started.</td></tr>
                    ) : (
                        pages.map((page: any) => (
                            <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-lg">{page.title}</td>
                                <td className="p-4 font-mono text-gray-500">/{page.slug}</td>
                                <td className="p-4 text-gray-500">
                                    {new Date(page.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-4">
                                    <Link href={`/admin/pages/${page.id}`} className="text-gray-600 hover:text-black">
                                        <Edit size={18} />
                                    </Link>
                                    <form action={async () => {
                                        "use server";
                                        await deletePage(page.id);
                                    }}>
                                        <button type="submit" className="text-red-400 hover:text-red-600">
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

export default function AdminPagesList() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif">Pages</h1>
                <Link href="/admin/pages/new">
                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition-colors">
                        <Plus size={18} /> New Page
                    </button>
                </Link>
            </div>

            <Suspense fallback={<PagesTableFallback />}>
                <PagesTable />
            </Suspense>
        </div>
    );
}
