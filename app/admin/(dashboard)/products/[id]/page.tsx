import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id },
            include: { images: true }
        }),
        prisma.category.findMany({
            select: { id: true, name: true }
        })
    ]);

    if (!product) {
        notFound();
    }

    // Transform Decimal to number for serialization
    const serializedProduct = {
        ...product,
        price: Number(product.price)
    };

    return (
        <div>
            <h1 className="text-3xl font-serif mb-8">Edit Product</h1>
            <ProductForm initialData={serializedProduct} categories={categories} />
        </div>
    );
}
