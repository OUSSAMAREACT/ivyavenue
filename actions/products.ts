"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        });

        revalidatePath("/admin/products");
        revalidatePath("/shop");
    } catch (error) {
        throw new Error("Failed to delete product");
    }
}
