import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ivyavenue.fluxstudio.cloud'

    // Static Pages
    const staticRoutes = [
        '',
        '/about',
        '/shop',
        '/journal',
        '/contact',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic Products
    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true },
    })

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Dynamic Categories
    const categories = await prisma.category.findMany({
        select: { slug: true },
    })

    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/shop?category=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
