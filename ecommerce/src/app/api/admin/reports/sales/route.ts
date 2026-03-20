import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkApiPermission } from "@/lib/backend-permissions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const permissionError = await checkApiPermission("reports.view");
  if (permissionError) {
    return permissionError;
  }

  try {
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(new Date(endDate).setDate(endDate.getDate() - 30));

    const paidOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["DELIVERED", "COMPLETED"],
        },
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + order.total,
      0,
    );
    const totalOrders = paidOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const allOrdersInRange = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    const statusBreakdown: Record<string, number> = {};
    allOrdersInRange.forEach((order) => {
      statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;
    });

    const allOrdersCount = allOrdersInRange.length;

    const salesByDate: Record<
      string,
      { revenue: number; paidOrders: number; totalOrders: number }
    > = {};

    // Initialiser les dates
    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    for (let i = 0; i <= diffDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      salesByDate[key] = { revenue: 0, paidOrders: 0, totalOrders: 0 };
    }

    allOrdersInRange.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;

      if (salesByDate[key]) {
        salesByDate[key].totalOrders += 1;
        if (["DELIVERED", "COMPLETED"].includes(order.status)) {
          // On retrouve l'objet dans paidOrders pour avoir le montant correct (déjà filtré par statut)
          const paidOrder = paidOrders.find(
            (po) => po.createdAt.getTime() === order.createdAt.getTime(),
          );
          if (paidOrder) {
            salesByDate[key].revenue += paidOrder.total;
          }
          salesByDate[key].paidOrders += 1;
        }
      }
    });

    const chartData = Object.entries(salesByDate)
      .map(([date, data]) => ({
        date,
        amount: data.revenue,
        orders: data.paidOrders,
        aov: data.paidOrders > 0 ? data.revenue / data.paidOrders : 0,
        conversionRate:
          data.totalOrders > 0
            ? Math.round((data.paidOrders / data.totalOrders) * 100)
            : 0,
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number);
        const [dayB, monthB] = b.date.split("/").map(Number);
        const year = new Date().getFullYear();
        return (
          new Date(year, monthA - 1, dayA).getTime() -
          new Date(year, monthB - 1, dayB).getTime()
        );
      });

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        conversionRate:
          allOrdersCount > 0
            ? Math.round((totalOrders / allOrdersCount) * 100)
            : 0,
        statusBreakdown,
      },
      chartData,
    });
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des rapports" },
      { status: 500 },
    );
  }
}
