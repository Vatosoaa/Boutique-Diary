import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty IDs" },
        { status: 400 },
      );
    }

    const VALID_STATUSES = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "COMPLETED",
    ];
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await prisma.order.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status: status as any,
      },
    });

    // Update associated transactions
    let transactionStatus: string | null = null;
    if (status === "DELIVERED" || status === "COMPLETED") {
      transactionStatus = "SUCCESS";
    } else if (status === "CANCELLED") {
      transactionStatus = "CANCELLED";
    }

    if (transactionStatus) {
      await prisma.paymentTransaction.updateMany({
        where: { orderId: { in: ids } },
        data: { status: transactionStatus },
      });

      // Notify admins via SSE
      const { notificationManager } = await import("@/lib/notification-manager");
      notificationManager.notifyAdmins({
        type: "TRANSACTION_BULK_UPDATE",
      });

      // Send a single notification for the bulk update
      await notificationManager.notifyAllAdmins({
        title: "Mise à jour groupée",
        message: `${ids.length} commandes ont été mises à jour avec le statut ${status}.`,
        type: "INFO",
        link: "/admin/orders",
      });
      }

    return NextResponse.json({
      success: true,
      count: ids.length,
    });
  } catch (error) {
    console.error("Bulk order error:", error);
    return NextResponse.json(
      { error: "Failed to update orders" },
      { status: 500 },
    );
  }
}
