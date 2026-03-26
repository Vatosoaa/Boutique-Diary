import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { replenishOrderStock } from "@/lib/stock-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!["PENDING", "PROCESSING"].includes(order.status)) {
      return NextResponse.json(
        { error: "Cette commande ne peut pas être annulée" },
        { status: 400 },
      );
    }

    const updatedOrder = await prisma.$transaction(async tx => {
      const order = await tx.order.update({
        where: { id },
        data: {
          status: "CANCELLED",
        },
      });

      await replenishOrderStock(id, tx);

      // Update associated transaction
      await tx.paymentTransaction.updateMany({
        where: { orderId: id },
        data: { status: "CANCELLED" },
      });

      // Notify admins via SSE
      const { notificationManager } = await import("@/lib/notification-manager");
      notificationManager.notifyAdmins({ type: "TRANSACTION_UPDATE" });
      notificationManager.notifyAdmins({ type: "ORDER_UPDATE" });

      // Send a notification to admins
      await notificationManager.notifyAllAdmins({
        title: "Commande Annulée",
        message: `La commande #${order.reference} a été annulée.`,
        type: "WARNING",
        link: `/admin/orders`,
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 },
    );
  }
}
