"use client";

import { upsertProduct } from "@/actions/admin-product";
import { uploadImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface ProductFormProps {
    initialData?: any;
    categories: { id: string; name: string }[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
    const [state, formAction] = useActionState(upsertProduct, null);
    const [images, setImages] = useState<string[]>(initialData?.images?.map((i: any) => i.url) || []);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        const result = await uploadImage(formData);
        if ('url' in result) {
            setImages([...images, result.url]);
        } else {
            alert("Upload failed");
        }
        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <form action={formAction} className="space-y-8 max-w-4xl">
            {state?.message && <div className="p-4 bg-red-50 text-red-600">{state.message}</div>}

            <input type="hidden" name="id" value={initialData?.id || "new"} />
            <input type="hidden" name="images" value={JSON.stringify(images)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="block text-sm font-medium">Product Name</label>
                    <input name="name" defaultValue={initialData?.name} className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black" required />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">Slug (URL)</label>
                    <input name="slug" defaultValue={initialData?.slug} className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black" required />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">Price ($)</label>
                    <input name="price" type="number" step="0.01" defaultValue={Number(initialData?.price)} className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black" required />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">Stock Quantity</label>
                    <input name="stock" type="number" defaultValue={initialData?.stock ?? 0} className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black" required />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">Category</label>
                    <select name="categoryId" defaultValue={initialData?.categoryId} className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black bg-white" required>
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" rows={5} defaultValue={initialData?.description} className="w-full p-2 border border-gray-200 focus:outline-none focus:border-black" required />
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium">Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-100 group">
                            <Image src={url} alt="Product" fill className="object-cover" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <label className="border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 cursor-pointer hover:border-black transition-colors aspect-square">
                        <Upload className="w-6 h-6 mb-2 text-gray-400" />
                        <span className="text-xs text-gray-500">{uploading ? "Uploading..." : "Add Image"}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <Button type="submit" className="bg-black text-white px-8 py-3 rounded-none hover:bg-gray-800">
                    Save Product
                </Button>
            </div>
        </form>
    );
}
