"use client";

import {
  X,
  Bell,
  Trash2,
  CheckCircle2,
  Clock,
  Info,
  AlertTriangle,
  XCircle,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSidebar({
  isOpen,
  onClose,
}: NotificationSidebarProps) {
  const {
    notifications,
    isLoading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "ERROR":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "ORDER":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(n => n.status === "UNREAD" && markAsRead(n.id));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] md:w-[420px] bg-background border border-border z-[70] shadow-2xl rounded-[24px] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-[110%]",
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          <div>
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some(n => n.status === "UNREAD") && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={markAllAsRead}
                      className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    >
                      <CheckCheck className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tout marquer comme lu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {isLoading && notifications.length === 0 ? (
            <div
              key="loading"
              className="h-full flex items-center justify-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div
              key="empty"
              className="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-2">
                <Bell className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground font-medium text-sm">
                Aucune notification pour le moment.
              </p>
            </div>
          ) : (
            <div key="list" className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={`${notification.id}-${index}`}
                  className={cn(
                    "group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer",
                    notification.status === "UNREAD"
                      ? "bg-primary/5 border-primary/20 shadow-sm"
                      : "bg-background border-border hover:bg-muted/50",
                  )}
                  onClick={() =>
                    notification.status === "UNREAD" &&
                    markAsRead(notification.id)
                  }
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          className={cn(
                            "font-bold text-foreground leading-tight text-sm",
                            notification.status === "UNREAD" && "text-primary",
                          )}
                        >
                          {notification.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap pt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: fr,
                            },
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                            onClick={e => {
                              e.stopPropagation();
                              onClose();
                            }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Voir plus
                          </Link>
                        )}

                        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={e => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {notification.status === "UNREAD" && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
