"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Tags,
  CreditCard,
  Truck,
  BarChart,
  Palette,
  ChevronDown,
  User,
  Package,
  Layers,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  subItems?: SubMenuItem[];
  permission?: string;
}

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  permission?: string;
}

interface NavSection {
  title?: string;
  items: MenuItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      {
        id: "dashboard",
        label: "Vue d'ensemble",
        icon: LayoutDashboard,
        href: "/admin",
        permission: "dashboard.view",
      },
    ],
  },
  {
    title: "Catalogue",
    items: [
      {
        id: "products",
        label: "Produits",
        icon: ShoppingBag,
        href: "/admin/products",
        permission: "products.view",
      },
      {
        id: "categories",
        label: "Catégories",
        icon: Layers,
        href: "/admin/categories",
        permission: "categories.manage",
      },
      {
        id: "stock",
        label: "Gestion des Stocks",
        icon: Package,
        href: "/admin/products/stock",
        permission: "products.edit",
      },
    ],
  },
  {
    title: "Ventes",
    items: [
      {
        id: "orders",
        label: "Commandes",
        icon: ShoppingCart,
        href: "/admin/orders",
        permission: "orders.view",
      },
      {
        id: "customers",
        label: "Clients",
        icon: Users,
        href: "/admin/customers",
        permission: "customers.view",
      },
    ],
  },
  {
    title: "Gestion",
    items: [
      {
        id: "messages",
        label: "Messages",
        icon: MessageSquare,
        href: "/admin/messages",
        permission: "dashboard.view",
      },
      {
        id: "employees",
        label: "Employés",
        icon: User,
        href: "/admin/employees",
        permission: "employees.view",
      },
      {
        id: "blog",
        label: "Blog",
        icon: FileText,
        href: "/admin/blog",
        permission: "products.view",
      },
      {
        id: "marketing",
        label: "Marketing",
        icon: Tags,
        permission: "marketing.manage",
        subItems: [
          {
            id: "promo-codes",
            label: "Codes promo",
            href: "/admin/marketing/codes-promo",
            permission: "marketing.manage",
          },
          {
            id: "promotions",
            label: "Règles",
            href: "/admin/marketing/promotions",
            permission: "marketing.manage",
          },
        ],
      },
      {
        id: "reports",
        label: "Rapports",
        icon: BarChart,
        permission: "reports.view",
        subItems: [
          {
            id: "sales-reports",
            label: "Ventes",
            href: "/admin/reports/sales",
            permission: "reports.view",
          },
          {
            id: "product-reports",
            label: "Produits",
            href: "/admin/reports/products",
            permission: "reports.view",
          },
          {
            id: "customer-reports",
            label: "Clients",
            href: "/admin/reports/customers",
            permission: "reports.view",
          },
        ],
      },
    ],
  },
  {
    title: "Paramètres",
    items: [
      {
        id: "payment",
        label: "Paiement",
        icon: CreditCard,
        permission: "payment.manage",
        subItems: [
          {
            id: "payment-methods",
            label: "Méthodes de paiement",
            href: "/admin/payment/methods",
            permission: "payment.manage",
          },
          {
            id: "transactions",
            label: "Transactions",
            href: "/admin/payment/transactions",
            permission: "payment.manage",
          },
        ],
      },
      /*
      {
        id: "shipping",
        label: "Livraison",
        icon: Truck,
        permission: "shipping.manage",
        subItems: [
          {
            id: "shipping-methods",
            label: "Méthodes de livraison",
            href: "/admin/shipping/methods",
            permission: "shipping.manage",
          },
          {
            id: "shipping-zones",
            label: "Zones de livraison",
            href: "/admin/shipping/zones",
            permission: "shipping.manage",
          },
        ],
      },
      */
      {
        id: "appearance",
        label: "Apparence",
        icon: Palette,
        permission: "appearance.edit",
        subItems: [
          {
            id: "logo",
            label: "Logo",
            href: "/admin/appearance/logo",
            permission: "appearance.edit",
          },
          {
            id: "theme",
            label: "Thèmes",
            href: "/admin/appearance/theme",
            permission: "appearance.edit",
          },
          {
            id: "banner",
            label: "Bannière",
            href: "/admin/appearance/banner",
            permission: "appearance.edit",
          },
          {
            id: "layout",
            label: "Disposition",
            href: "/admin/appearance/layout",
            permission: "appearance.edit",
          },
        ],
      },
    ],
  },
];

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { hasPermission, loading, user } = usePermissions();

  const filterMenuItem = React.useCallback(
    (item: MenuItem): boolean => {
      return !item.permission || hasPermission(item.permission);
    },
    [hasPermission],
  );

  const filteredSections = React.useMemo((): NavSection[] => {
    return navSections
      .map(section => ({
        ...section,
        items: section.items
          .filter(filterMenuItem)
          .map(item => ({
            ...item,
            subItems: item.subItems?.filter(
              sub => !sub.permission || hasPermission(sub.permission),
            ),
          }))
          .filter(item => !item.subItems || item.subItems.length > 0),
      }))
      .filter(section => section.items.length > 0);
  }, [filterMenuItem, hasPermission]);

  const isItemActive = React.useCallback(
    (item: MenuItem) => {
      if (item.href === pathname) return true;
      if (item.subItems) {
        return item.subItems.some(sub => pathname.startsWith(sub.href));
      }
      return false;
    },
    [pathname],
  );

  React.useEffect(() => {
    filteredSections.forEach(section => {
      section.items.forEach(item => {
        if (
          item.subItems &&
          isItemActive(item) &&
          !expandedSections.includes(item.id)
        ) {
          setExpandedSections(prev => [...prev, item.id]);
        }
      });
    });
  }, [pathname, filteredSections, isItemActive, expandedSections]);

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      window.location.href = "/admin-login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-6 transition-all duration-300 sticky top-0 h-screen ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        title="Confirmer la déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Déconnexion
          </button>
        </div>
      </Modal>

      <div
        className={`bg-white dark:bg-gray-900/40 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex flex-col py-6 transition-all duration-300 sticky top-0 h-screen overflow-hidden ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {}
        <div
          className={`flex items-center mb-8 px-4 ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-black dark:bg-gray-100 rounded-lg flex items-center justify-center text-white dark:text-black font-bold">
              B
            </div>
            {isExpanded && (
              <h2 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Boutique Diary
              </h2>
            )}
          </div>
        </div>

        {}
        <nav className="flex-1 space-y-6 px-3 overflow-y-auto no-scrollbar">
          {filteredSections.map((section, index) => (
            <div key={index} className="space-y-1">
              {isExpanded && section.title && (
                <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              {}
              {!isExpanded && section.title && index > 0 && (
                <div className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-2" />
              )}

              {section.items.map(item => {
                const isActive = isItemActive(item);
                const isOpen = expandedSections.includes(item.id);

                if (!item.subItems) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href || "#"}
                      className={`w-full flex items-center rounded-lg transition-all group ${
                        isExpanded ? "px-3 py-2" : "p-2 justify-center"
                      } ${
                        isActive
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <item.icon
                          className={`w-5 h-5 shrink-0 ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}
                        />
                      </div>
                      {isExpanded && (
                        <span className="ml-3 font-medium whitespace-nowrap text-sm">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                }

                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          toggleSection(item.id);
                        } else {
                          setIsExpanded(true);
                          setExpandedSections([item.id]);
                        }
                      }}
                      className={`w-full flex items-center justify-between rounded-lg transition-all group ${
                        isExpanded ? "px-3 py-2" : "p-2 justify-center"
                      } ${
                        isActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`w-5 h-5 shrink-0 ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}
                        />
                        {isExpanded && (
                          <span className="ml-3 font-medium whitespace-nowrap text-sm">
                            {item.label}
                          </span>
                        )}
                      </div>
                      {isExpanded && (
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    {isExpanded && isOpen && (
                      <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1 py-1">
                        {item.subItems.map(subItem => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.id}
                              href={subItem.href}
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                isSubActive
                                  ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {}
        <div className="mt-auto border-t border-gray-200 dark:border-white/10">
          {/* User Menu (Dropup) */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded && isUserMenuOpen
                ? "max-h-32 opacity-100 border-b border-gray-200 dark:border-white/5"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-2 space-y-1">
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                <User className="w-4 h-4 mr-3 text-gray-500" />
                Mon Profil
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-3"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>

          {/* User Profile Button */}
          <div className="p-3">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center w-full rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/5 ${
                isExpanded ? "p-2" : "p-2 justify-center"
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-inner border border-white/10 uppercase">
                  {user?.username?.substring(0, 2) || "AD"}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>

              {isExpanded && (
                <>
                  <div className="ml-3 text-left flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {user?.username || "Chargement..."}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || "..."}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
