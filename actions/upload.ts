"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { error: "No file provided" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure imports directory exists (public/uploads)
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const uniqueName = `${uuidv4()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = join(uploadDir, uniqueName);

        // Write file
        await writeFile(filePath, buffer);

        // Return public URL
        return { url: `/uploads/${uniqueName}` };
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: "Upload failed" };
    }
}
