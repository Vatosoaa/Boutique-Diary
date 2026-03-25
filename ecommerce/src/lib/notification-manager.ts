import { prisma } from "@/lib/prisma";

/** Subscriber callback type. */
type SubscriberCallback = (data: unknown) => void;

/** Shape expected when persisting a notification. */
interface NotificationPayload {
  title: string;
  message: string;
  type: string;
  link?: string;
  userId?: number;
  adminId?: number;
}

/**
 * Server-side notification manager.
 * Handles SSE subscriptions and Prisma persistence.
 */
class NotificationManager {
  /** userId → Set of callbacks. `null` key = admin subscribers. */
  private subscribers = new Map<string | null, Set<SubscriberCallback>>();

  /** Subscribe to real-time events. Returns an unsubscribe function. */
  subscribe(userId: string | null, callback: SubscriberCallback): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }
    this.subscribers.get(userId)!.add(callback);

    return () => {
      this.subscribers.get(userId)?.delete(callback);
      if (this.subscribers.get(userId)?.size === 0) {
        this.subscribers.delete(userId);
      }
    };
  }

  /** Broadcast data to all subscribers of a given userId (or null for admins). */
  private broadcast(userId: string | null, data: unknown): void {
    this.subscribers.get(userId)?.forEach(cb => cb(data));
  }

  /** Notify all admin SSE subscribers (lightweight, no DB write). */
  notifyAdmins(data: unknown): void {
    this.broadcast(null, data);
  }

  /** Notify a specific user's SSE subscribers (lightweight, no DB write). */
  notifyUser(userId: string, data: unknown): void {
    this.broadcast(userId, data);
  }

  /** Notify ALL subscribers – admins + every connected user. */
  notifyAll(data: unknown): void {
    this.subscribers.forEach(callbacks => {
      callbacks.forEach(cb => cb(data));
    });
  }

  /**
   * Persist a notification in DB **and** push it to all admin SSE streams.
   */
  async notifyAllAdmins(payload: NotificationPayload): Promise<void> {
    try {
      const admins = await prisma.admin.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      const notifications = await Promise.all(
        admins.map(admin =>
          prisma.notification.create({
            data: {
              title: payload.title,
              message: payload.message,
              type: payload.type,
              link: payload.link,
              adminId: admin.id,
            },
          }),
        ),
      );

      // Push each created notification to admin SSE subscribers
      notifications.forEach(n => this.broadcast(null, n));
    } catch (error) {
      console.error("NotificationManager.notifyAllAdmins failed:", error);
    }
  }
}

/** Singleton instance (survives HMR in development). */
const globalForNotifications = globalThis as unknown as {
  notificationManager: NotificationManager | undefined;
};

export const notificationManager =
  globalForNotifications.notificationManager ?? new NotificationManager();

if (process.env.NODE_ENV !== "production") {
  globalForNotifications.notificationManager = notificationManager;
}
