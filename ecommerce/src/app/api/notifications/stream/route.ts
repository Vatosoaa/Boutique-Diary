import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { verifyAdminToken } from "@/lib/adminAuth";
import { notificationManager } from "@/lib/notification-manager";

export async function GET(request: NextRequest) {
  const admin = await verifyAdminToken();
  const user = await verifyToken();

  const url = new URL(request.url);
  const role = url.searchParams.get("role");

  let subscribeUserId: string | null = null;
  let isNotAuthorized = false;

  if (role === "admin") {
    if (admin) {
      subscribeUserId = null;
    } else {
      isNotAuthorized = true;
    }
  } else if (role === "user") {
    if (user) {
      subscribeUserId = String(user.userId);
    } else {
      isNotAuthorized = true;
    }
  } else {
    // Fallback
    if (admin) {
      subscribeUserId = null;
    } else if (user) {
      subscribeUserId = String(user.userId);
    } else {
      isNotAuthorized = true;
    }
  }

  if (isNotAuthorized) {
    return new Response("Unauthorized", { status: 401 });
  }

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendNotification = (data: unknown) => {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    writer.write(encoder.encode(message));
  };

  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    writer.write(encoder.encode(": heartbeat\n\n"));
  }, 30000);

  const unsubscribe = notificationManager.subscribe(
    subscribeUserId,
    sendNotification,
  );

  request.signal.onabort = () => {
    clearInterval(heartbeat);
    unsubscribe();
    writer.close();
  };

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
