"use client";

import { useActionState } from "react"; // Next.js 15/16 uses react's useActionState (or formerly useFormState)
import { createCategory, updateCategory } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Ensure this component exists or use <textarea>
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Category
        </Button>
    );
}

// Define the state type
type CategoryState = {
    error?: string;
} | null;

export default function CategoryForm({ category, isNew }: { category?: any, isNew: boolean }) {
    // Correct usage of updateCategory with binding
    const updateAction = updateCategory.bind(null, category?.id);
    const action = isNew ? createCategory : updateAction;

    const [state, formAction] = useActionState<CategoryState, FormData>(action, null);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-serif">{isNew ? "New Category" : "Edit Category"}</h1>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-8">
                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input name="name" defaultValue={category?.name} required placeholder="e.g. Faux Hydrangeas" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <div className="flex items-center">
                            <span className="bg-gray-50 border border-r-0 border-gray-300 p-2 text-gray-500 text-sm">/shop?category=</span>
                            <Input name="slug" defaultValue={category?.slug} required placeholder="hydrangeas" className="rounded-l-none" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Unique identifier for the URL.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            defaultValue={category?.description || ""}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-sm"
                            placeholder="Optional description..."
                        />
                    </div>

                    <SubmitButton />

                    {state?.error && (
                        <p className="text-red-500 text-sm text-center mt-4 bg-red-50 p-2 border border-red-100">
                            {state.error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
