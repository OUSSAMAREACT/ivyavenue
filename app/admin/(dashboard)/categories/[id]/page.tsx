import prisma from "@/lib/prisma";
import CategoryForm from "@/components/admin/category-form";

export default async function AdminCategoryEditor({ params }: { params: { id: string } }) {
    const { id } = await params; // Await params in Next.js 15+
    const isNew = id === 'new';

    let category = null;
    if (!isNew) {
        category = await prisma.category.findUnique({
            where: { id },
        });
    }

    return <CategoryForm category={category} isNew={isNew} />;
}
