import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
    // Fetch categories for the select dropdown
    const categories = await prisma.category.findMany({
        select: { id: true, name: true }
    });

    return (
        <div>
            <h1 className="text-3xl font-serif mb-8">Add New Product</h1>
            <ProductForm categories={categories} />
        </div>
    );
}
