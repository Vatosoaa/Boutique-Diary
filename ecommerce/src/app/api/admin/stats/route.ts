import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET() {
  try {
    const user = await verifyAdminToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalProducts,
      stockValueStats,
      lowStockCount,
      totalOrders,
      categoryStats,
      totalReviews,
      orders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.aggregate({
        _sum: {
          price: true,
          stock: true,
        },
      }),
      prisma.product.count({
        where: {
          stock: {
            lt: 5,
          },
        },
      }),
      prisma.order.count(),
      prisma.product.groupBy({
        by: ["categoryId"],
        _count: {
          id: true,
        },
      }),
      prisma.review.count(),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
        select: {
          createdAt: true,
          total: true,
        },
      }),
    ]);

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryStats
            .map(s => s.categoryId)
            .filter((id): id is number => id !== null),
        },
      },
    });

    const categoryStock = await prisma.product.groupBy({
      by: ["categoryId"],
      _sum: {
        stock: true,
      },
    });

    const categoryDistribution = categoryStats.map(stat => {
      const cat = categories.find(c => c.id === stat.categoryId);
      const stockStat = categoryStock.find(
        s => s.categoryId === stat.categoryId,
      );
      return {
        name: cat ? cat.name : "Sans catégorie",
        value: stat._count.id,
        stock: stockStat?._sum.stock || 0,
      };
    });

    const allProducts = await prisma.product.findMany({
      select: { price: true, stock: true },
    });

    const totalStockValue = allProducts.reduce((acc, p) => {
      return acc + (p.price || 0) * (p.stock || 0);
    }, 0);

    const outOfStockCount = allProducts.filter(
      p => !p.stock || p.stock === 0,
    ).length;

    // Process orders for sales performance
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const salesPerformance = monthNames.map((name, index) => {
      const monthOrders = orders.filter(
        o => new Date(o.createdAt).getMonth() === index,
      );
      const value = monthOrders.reduce((sum, o) => sum + o.total, 0);
      return { name, value };
    });

    return NextResponse.json(
      {
        totalProducts,
        totalStockValue,
        lowStockCount,
        outOfStockCount,
        totalOrders,
        categoryDistribution,
        totalReviews,
        salesPerformance,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
