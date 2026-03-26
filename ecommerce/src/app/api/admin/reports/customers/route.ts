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

    const totalCustomers = await prisma.user.count({
      where: {
        role: "CUSTOMER",
        createdAt: { lte: endDate },
      },
    });

    const newCustomers = await prisma.user.count({
      where: {
        role: "CUSTOMER",
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const activeCustomers = await prisma.user.count({
      where: {
        role: "CUSTOMER",
        isActive: true,
        createdAt: { lte: endDate },
      },
    });

    // Calcul du taux de réachat (Repeat Purchase Rate)
    // Clients ayant passé plus d'une commande / Total clients ayant passé au moins une commande
    const customerOrderCounts = await prisma.order.groupBy({
      by: ["customerId"],
      _count: {
        id: true,
      },
      where: {
        customerId: { not: null },
        status: { in: ["DELIVERED", "COMPLETED"] },
      },
    });

    const customersWithMultipleOrders = customerOrderCounts.filter(
      c => c._count.id > 1,
    ).length;
    const customersWithAtLeastOneOrder = customerOrderCounts.length;
    const repeatPurchaseRate =
      customersWithAtLeastOneOrder > 0
        ? Math.round(
            (customersWithMultipleOrders / customersWithAtLeastOneOrder) * 100,
          )
        : 0;

    const topSpenders = await prisma.order.groupBy({
      by: ["customerId"],
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: { in: ["DELIVERED", "COMPLETED"] },
        customerId: { not: null },
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: {
        _sum: {
          total: "desc",
        },
      },
      take: 5,
    });

    const topCustomers = await Promise.all(
      topSpenders.map(async item => {
        if (!item.customerId) return null;
        const customer = await prisma.user.findUnique({
          where: { id: item.customerId },
          select: { id: true, username: true, email: true },
        });

        return {
          id: item.customerId,
          name: customer?.username || "Inconnu",
          email: customer?.email || "-",
          totalOrders: item._count.id,
          totalSpent: item._sum.total || 0,
        };
      }),
    );

    const validTopCustomers = topCustomers.filter(
      (c): c is NonNullable<typeof c> => c !== null,
    );

    const recentUsers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { createdAt: true },
    });

    const signupsByDate: Record<string, number> = {};

    // Initialiser les dates
    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    for (let i = 0; i <= diffDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dayStr = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      signupsByDate[dayStr] = 0;
    }

    recentUsers.forEach(u => {
      const d = new Date(u.createdAt);
      const dayStr = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      if (signupsByDate[dayStr] !== undefined) {
        signupsByDate[dayStr]++;
      }
    });

    const recentSignups = Object.entries(signupsByDate)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => {
        const [dA, mA] = a.date.split("/").map(Number);
        const [dB, mB] = b.date.split("/").map(Number);
        const year = new Date().getFullYear();
        return (
          new Date(year, mA - 1, dA).getTime() -
          new Date(year, mB - 1, dB).getTime()
        );
      });

    return NextResponse.json({
      metrics: {
        totalCustomers,
        newCustomers,
        activeCustomers,
        repeatPurchaseRate,
      },
      topCustomers: validTopCustomers,
      recentSignups,
    });
  } catch (error) {
    console.error("Error fetching customer reports:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des rapports clients" },
      { status: 500 },
    );
  }
}
