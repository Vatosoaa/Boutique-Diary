import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const admin = await verifyAdminToken();
    const user = await verifyToken();

    const url = new URL(request.url);
    const role = url.searchParams.get("role");

    let adminId: number | null = null;
    let userId: number | null = null;

    if (role === "admin") {
      if (admin) adminId = admin.adminId;
    } else if (role === "user") {
      if (user) userId = user.userId;
    } else {
      if (admin) adminId = admin.adminId;
      if (user && !adminId) userId = user.userId;
    }

    if (!adminId && !userId) {
      return NextResponse.json({ notifications: [] });
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          OR: [
            adminId ? { adminId: adminId } : null,
            userId ? { userId: userId } : null,
          ].filter(Boolean) as Array<Record<string, unknown>>,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.notification.count({
        where: {
          OR: [
            adminId ? { adminId: adminId } : null,
            userId ? { userId: userId } : null,
          ].filter(Boolean) as Array<Record<string, unknown>>,
          status: "UNREAD",
        },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    const notification = await prisma.notification.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ notification });
  } catch (error) {
    console.error("Failed to update notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
