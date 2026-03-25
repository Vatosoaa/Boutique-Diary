"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/theme-context";
import { UnifiedSupport } from "./client/UnifiedSupport";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { CartAutoCleaner } from "./CartAutoCleaner";
import { Category } from "@/types/category";

export default function MainLayout({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: Category[];
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <Auth0Provider>
      <CartAutoCleaner />
      <ThemeProvider>
        {!isAdminPage && !isAuthPage && <Navbar categories={categories} />}
        {children}
        {!isAdminPage && !isAuthPage && <UnifiedSupport />}
        <Toaster richColors />
      </ThemeProvider>
    </Auth0Provider>
  );
}
