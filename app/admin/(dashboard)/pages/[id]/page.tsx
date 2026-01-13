import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createPage, updatePage } from "@/actions/pages";

export default async function AdminPageEditor({ params }: { params: { id: string } }) {
    const { id } = await params;
    const isNew = id === 'new';

    let page = null;
    if (!isNew) {
        page = await prisma.page.findUnique({
            where: { id },
        });
    }

    const action = isNew
        ? createPage
        : updatePage.bind(null, id);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-serif">{isNew ? "New Page" : "Edit Page"}</h1>
                </div>
            </div>

            <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                name="title"
                                defaultValue={page?.title}
                                required
                                className="w-full p-3 border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black"
                                placeholder="Page Title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML allowed)</label>
                            <textarea
                                name="content"
                                defaultValue={page?.content}
                                rows={15}
                                className="w-full p-3 border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black font-mono text-sm"
                                placeholder="<h1>My Page</h1><p>Content...</p>"
                            />
                            <p className="text-xs text-gray-400 mt-1">Basic HTML tags are supported for formatting.</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Settings */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-4">
                        <h2 className="font-medium text-lg border-b border-gray-100 pb-2">Settings</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <div className="flex items-center">
                                <span className="bg-gray-50 border border-r-0 border-gray-300 p-3 text-gray-500 text-sm">/</span>
                                <input
                                    name="slug"
                                    defaultValue={page?.slug}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-l-none focus:ring-1 focus:ring-black focus:border-black"
                                    placeholder="about"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="font-medium text-sm text-gray-900 mb-3">SEO</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title</label>
                                    <input
                                        name="seoTitle"
                                        defaultValue={page?.seoTitle || ""}
                                        className="w-full p-2 border border-gray-300 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description</label>
                                    <textarea
                                        name="seoDescription"
                                        defaultValue={page?.seoDescription || ""}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                <Save size={18} /> Save Page
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
