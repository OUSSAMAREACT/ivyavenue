"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().int().min(0, "Stock must be non-negative"),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
});

export async function upsertProduct(prevState: any, formData: FormData) {
    const rawData = {
        id: formData.get("id") as string,
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string),
        categoryId: formData.get("categoryId") as string,
        images: JSON.parse(formData.get("images") as string || "[]"),
    };

    const validated = productSchema.safeParse(rawData);

    if (!validated.success) {
        return { message: "Invalid data", errors: validated.error.flatten().fieldErrors };
    }

    const { id, images, ...data } = validated.data;

    try {
        if (id && id !== "new") {
            // Update
            await prisma.product.update({
                where: { id },
                data: {
                    ...data,
                    images: {
                        deleteMany: {}, // Clear existing images
                        create: images.map(url => ({ url })), // Re-add
                    }
                }
            });
        } else {
            // Create
            await prisma.product.create({
                data: {
                    ...data,
                    images: {
                        create: images.map(url => ({ url })),
                    }
                }
            });
        }
    } catch (e) {
        console.error(e);
        return { message: "Database error" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    redirect("/admin/products");
}
