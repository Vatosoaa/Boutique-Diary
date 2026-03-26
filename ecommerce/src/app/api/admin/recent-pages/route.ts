import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [products, blogPosts, categories, banners] = await Promise.all([
      prisma.product.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, updatedAt: true, status: true },
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, updatedAt: true, isPublished: true },
      }),
      prisma.category.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, updatedAt: true },
      }),
      prisma.banner.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, updatedAt: true, isActive: true },
      }),
    ]);

    const allPages = [
      ...products.map(p => ({
        id: `product-${p.id}`,
        title: p.name,
        updatedAt: p.updatedAt,
        url: `/admin/products/${p.id}`,
        status: p.status === "PUBLISHED" ? "Published" : "Draft",
        type: "Produit",
      })),
      ...blogPosts.map(b => ({
        id: `blog-${b.id}`,
        title: b.title,
        updatedAt: b.updatedAt,
        url: `/admin/blog/${b.id}`,
        status: b.isPublished ? "Published" : "Draft",
        type: "Article",
      })),
      ...categories.map(c => ({
        id: `cat-${c.id}`,
        title: c.name,
        updatedAt: c.updatedAt,
        url: `/admin/products?category=${c.id}`,
        status: "Published",
        type: "Catégorie",
      })),
      ...banners.map(bn => ({
        id: `banner-${bn.id}`,
        title: bn.title,
        updatedAt: bn.updatedAt,
        url: `/admin/appearance/banner`,
        status: bn.isActive ? "Published" : "Draft",
        type: "Bannière",
      })),
    ];

    // Sort by updatedAt desc and take 5
    const recentPages = allPages
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);

    return NextResponse.json(recentPages);
  } catch (error) {
    console.error("Error fetching recent pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent pages" },
      { status: 500 },
    );
  }
}
