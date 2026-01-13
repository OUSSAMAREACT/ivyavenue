"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPage(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;

    await prisma.page.create({
        data: {
            title,
            slug,
            content,
            isPublished: true,
            seoTitle,
            seoDescription,
        }
    });

    revalidatePath("/admin/pages");
    redirect("/admin/pages");
}

export async function updatePage(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;

    await prisma.page.update({
        where: { id },
        data: {
            title,
            slug,
            content,
            seoTitle,
            seoDescription,
        }
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${id}`);
    redirect("/admin/pages");
}

export async function deletePage(id: string) {
    await prisma.page.delete({ where: { id } });
    revalidatePath("/admin/pages");
}
