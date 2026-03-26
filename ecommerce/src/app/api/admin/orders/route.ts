import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      if (status === "completed") {
        where.status = { in: ["COMPLETED", "DELIVERED"] };
      } else if (status === "pending") {
        where.status = { in: ["PENDING", "PROCESSING"] };
      } else if (status === "cancelled") {
        where.status = "CANCELLED";
      }
    }

    if (search) {
      where.OR = [
        { reference: { contains: search, mode: "insensitive" } },
        { customer: { username: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              username: true,
              email: true,
              photo: true,
            },
          },
          transactions: {
            take: 1,
            select: {
              metadata: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: {
                    take: 1,
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalCount,
      completedCount,
      pendingCount,
      cancelledCount,
      todayCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: { in: ["COMPLETED", "DELIVERED"] } },
      }),
      prisma.order.count({
        where: { status: { in: ["PENDING", "PROCESSING"] } },
      }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
    ]);

    const formattedOrders = orders.map(order => {
      let customerName = "Invité";
      let customerEmail = "";
      let customerAvatar = "";

      if (order.customer) {
        customerName = order.customer.username;
        customerEmail = order.customer.email;
        customerAvatar = order.customer.photo || "";
      } else if (order.transactions && order.transactions.length > 0) {
        const metadata = order.transactions[0].metadata as Record<
          string,
          string
        >;
        if (metadata) {
          // Try to get name from mvolaName or fallback to phone
          customerName =
            metadata.mvolaName || metadata.phone || metadata.email || "Invité";
          customerEmail = metadata.email || "";
        }
      }

      return {
        id: order.id,
        reference: order.reference,
        customer: {
          name: customerName,
          email: customerEmail,
          avatar: customerAvatar,
        },
        status: order.status,
        total: order.total,
        itemCount: order.items.length,
        createdAt: order.createdAt.toISOString(),
      };
    });

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfLastMonth },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    const allThisMonthCount = recentOrders.filter(
      o => o.createdAt >= startOfThisMonth,
    ).length;

    const calculateMetrics = (statusMatcher: (status: string) => boolean) => {
      const thisMonth = recentOrders.filter(
        o => o.createdAt >= startOfThisMonth && statusMatcher(o.status),
      );

      const thisMonthCount = thisMonth.length;

      let trend =
        allThisMonthCount > 0
          ? Math.round((thisMonthCount / allThisMonthCount) * 100)
          : 0;

      if (trend > 100) trend = 100;
      if (trend < 0) trend = 0;

      const days = 14;
      const sparkline = Array(days).fill(0);
      const startOfSparkline = new Date(now);
      startOfSparkline.setDate(startOfSparkline.getDate() - days + 1);
      startOfSparkline.setHours(0, 0, 0, 0);

      const recentDaysOrders = recentOrders.filter(
        o => o.createdAt >= startOfSparkline && statusMatcher(o.status),
      );
      recentDaysOrders.forEach(o => {
        const diffTime = o.createdAt.getTime() - startOfSparkline.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < days) {
          sparkline[diffDays]++;
        }
      });

      return {
        value: thisMonthCount,
        trend,
        sparkline,
      };
    };

    const metrics = {
      total: calculateMetrics(() => true),
      completed: calculateMetrics(s => s === "COMPLETED" || s === "DELIVERED"),
      pending: calculateMetrics(s => s === "PENDING" || s === "PROCESSING"),
      cancelled: calculateMetrics(s => s === "CANCELLED"),
    };

    return NextResponse.json({
      orders: formattedOrders,
      counts: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
        cancelled: cancelledCount,
        today: todayCount,
      },
      metrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
