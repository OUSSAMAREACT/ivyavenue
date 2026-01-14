import { z } from "zod";

export const checkoutSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    address: z.string().min(5, "Address is too short"),
    city: z.string().min(2, "City is too short"),
    postalCode: z.string().min(3, "Postal code is too short"),
    country: z.string().min(2, "Country is invalid"),
    items: z.array(z.object({
        id: z.string(),
        quantity: z.number().min(1)
    })).min(1, "Cart is empty"),
    couponCode: z.string().optional()
});

export const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase and hyphenated"),
    description: z.string().min(10, "Description is too short"),
    price: z.number().min(0, "Price cannot be negative"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string().url()).optional()
});
