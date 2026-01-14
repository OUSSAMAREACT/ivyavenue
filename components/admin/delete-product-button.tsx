"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(id);
            toast.success("Product deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
