"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    if (!name || !slug) {
        return { error: "Name and Slug are required." };
    }

    try {
        await prisma.category.create({
            data: {
                name,
                slug,
                description,
            },
        });

        revalidatePath("/admin/categories");
        redirect("/admin/categories");
    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") throw error;
        console.error("Create Category Error:", error);
        return { error: "Failed to create category. Slug might be duplicate." };
    }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    if (!name || !slug) {
        return { error: "Name and Slug are required." };
    }

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
            },
        });

        revalidatePath("/admin/categories");
        redirect("/admin/categories");
    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") throw error;
        console.error("Update Category Error:", error);
        return { error: "Failed to update category." };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error) {
        console.error("Delete Category Error:", error);
        return { error: "Failed to delete category." };
    }
}
