"use client";

import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  link?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  setOpen: (open: boolean) => void;
  getUnreadCount: () => number;
  setupRealtime: () => () => void;
  role: "admin" | "user";
  setRole: (role: "admin" | "user") => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  isLoading: false,
  role: "user",

  setRole: role => set({ role }),

  setupRealtime: () => {
    const role = get().role;
    const eventSource = new EventSource(
      `/api/notifications/stream?role=${role}`,
    );

    eventSource.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data === "object") {
          // If it's a new notification, add it
          set(state => {
            // Check if notification already exists to avoid duplicate keys
            if (
              state.notifications.some(
                n => n.id === (data as Record<string, unknown>).id,
              )
            ) {
              return state;
            }

            const isUnread =
              (data as Record<string, unknown>).status === "UNREAD";
            return {
              notifications: [
                data as Notification,
                ...state.notifications,
              ].slice(0, 50),
              unreadCount: isUnread ? state.unreadCount + 1 : state.unreadCount,
            };
          });
        }
      } catch (e) {
        console.error("Failed to parse realtime notification", e);
      }
    };

    eventSource.onerror = e => {
      console.error("EventSource error", e);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  },

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const role = get().role;
      const response = await fetch(`/api/notifications?role=${role}`);
      if (response.ok) {
        const data = await response.json();
        set({
          notifications: data.notifications,
          unreadCount: data.unreadCount || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async id => {
    const notification = get().notifications.find(n => n.id === id);
    const wasUnread = notification?.status === "UNREAD";

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "READ" }),
      });

      if (response.ok) {
        set({
          notifications: get().notifications.map(n =>
            n.id === id ? { ...n, status: "READ" } : n,
          ),
          unreadCount: wasUnread
            ? Math.max(0, get().unreadCount - 1)
            : get().unreadCount,
        });
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  deleteNotification: async id => {
    const notification = get().notifications.find(n => n.id === id);
    const wasUnread = notification?.status === "UNREAD";

    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        set({
          notifications: get().notifications.filter(n => n.id !== id),
          unreadCount: wasUnread
            ? Math.max(0, get().unreadCount - 1)
            : get().unreadCount,
        });
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },

  setOpen: open => {
    set({ isOpen: open });
  },

  getUnreadCount: () => {
    return get().unreadCount;
  },
}));
