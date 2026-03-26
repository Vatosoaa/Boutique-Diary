import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { UserNav } from "./UserNav";
import { AdminPayload } from "@/lib/adminAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PanelLeft, Search, Bell, Sun, Moon, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeSettings } from "./ThemeSettings";
import { useTheme } from "@/contexts/theme-context";
import { CommandPalette } from "./CommandPalette";
import { isAdmin } from "@/lib/auth-constants";
import { useNotificationStore } from "@/lib/notification-store";
import NotificationSidebar from "@/components/NotificationSidebar";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const pathname = usePathname();
  const { colorMode, setColorMode } = useTheme();
  const router = useRouter();

  const {
    data: user,
    error,
    isLoading: loading,
  } = useSWR<AdminPayload>(
    pathname === "/admin/login" ? null : "/api/admin/auth/me",
    fetcher,
    {
      revalidateOnFocus: false, // User profile doesn't change often
    },
  );

  const {
    isOpen: isNotificationOpen,
    setOpen: setNotificationOpen,
    getUnreadCount,
    fetchNotifications,
    setupRealtime,
    setRole,
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  useEffect(() => {
    if (error?.status === 401) {
      router.push("/admin/login");
    }
  }, [error, router]);

  useEffect(() => {
    if (user) {
      setRole("admin");
      fetchNotifications();
      const unsubscribe = setupRealtime();
      return () => unsubscribe();
    }
  }, [user, fetchNotifications, setupRealtime, setRole]);

  useEffect(() => {
    if (user) {
      setRole("admin");
      fetchNotifications();
      const unsubscribe = setupRealtime();
      return () => unsubscribe();
    }
  }, [user, fetchNotifications, setupRealtime, setRole]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        if (user && isAdmin(user.role)) {
          e.preventDefault();
          setCommandPaletteOpen(open => !open);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [user, router]);

  if (pathname === "/admin/login") {
    return null;
  }

  const toggleColorMode = () => {
    setColorMode(colorMode === "dark" ? "light" : "dark");
  };

  return (
    <>
      <div className="border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-300">
        <div className="flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="w-px h-6 bg-white/10 mx-4" />
          {user && isAdmin(user.role) && (
            <Button
              variant="ghost"
              className="w-full max-w-md justify-start text-sm text-gray-400 hover:bg-white/5 border border-white/10 hover:border-white/20 hover:text-white"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              Rechercher...
              <kbd className="pointer-events-none ml-auto h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100 text-gray-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/5 relative"
              onClick={() => setNotificationOpen(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center bg-red-500 text-[10px] font-bold text-white rounded-full border-2 border-gray-900 animate-in zoom-in duration-300">
                  {unreadCount > 99 ? "+99" : unreadCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleColorMode}
              className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/5"
            >
              {colorMode === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <ThemeSettings />
              </PopoverContent>
            </Popover>
            {loading ? (
              <Skeleton className="h-8 w-8 rounded-full ml-2 bg-white/10" />
            ) : user ? (
              <div className="ml-2">
                <UserNav user={user} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <CommandPalette
        open={commandPaletteOpen}
        setOpen={setCommandPaletteOpen}
      />
      <NotificationSidebar
        isOpen={isNotificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
}
