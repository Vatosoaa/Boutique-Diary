"use client";

import SearchCommand from "@/components/store/SearchCommand";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCartStore } from "@/lib/cart-store";
import { HeaderConfig } from "@/lib/theme/theme-config";
import { cn } from "@/lib/utils";
import anime from "animejs";
import {
  Menu,
  Package2,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  Trophy,
  User,
  X,
  LogOut,
  Settings as SettingsIcon,
  UserCircle,
  Heart,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import BrandLogo from "./BrandLogo";
import CartSidebar from "./CartSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  photo?: string;
  role: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface StoreNavbarProps {
  categories?: Category[];
  headerConfig?: HeaderConfig;
  previewMode?: boolean;
}

export default function StoreNavbar({
  categories = [],
  headerConfig,
  previewMode = false,
}: StoreNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (_error) {
      console.error("Auth check failed", _error);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      await fetchUser();
    };
    checkUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      useCartStore.getState().clearCart();
      window.location.href = "/api/auth/social/logout";
    } catch (_error) {
      toast.error("Erreur lors de la déconnexion");
      window.location.href = "/api/auth/social/logout";
    }
  };

  const isCartOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  const itemCount = useCartStore((state) => state.getItemCount());

  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    // Skip animations in preview mode
    if (previewMode) return;

    anime({
      targets: [".nav-logo", ".nav-menu", ".nav-actions"],
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: "easeOutQuad",
      duration: 800,
    });
  }, [previewMode]);

  const collections = [
    {
      title: "Nouveautés",
      href: "/nouveautes",
      icon: Sparkles,
      color: "text-blue-500",
    },
    {
      title: "Top Vente",
      href: "/top-vente",
      icon: Trophy,
      color: "text-amber-500",
    },
    {
      title: "Toute la Boutique",
      href: "/produits",
      icon: Package2,
      color: "text-gray-900",
    },
    {
      title: "Promotions",
      href: "/promotions",
      icon: Tag,
      color: "text-rose-500",
    },
  ];

  const categoriesList = [
    {
      name: "Femmes",
      href: "/shop?category=femmes",
      image: "/images/femme.jpg",
    },
    {
      name: "Hommes",
      href: "/shop?category=hommes",
      image: "/images/homme1.jpg",
    },
    {
      name: "Enfants",
      href: "/shop?category=enfants",
      image: "/images/enfant2.jpg",
    },
    {
      name: "Accessoires",
      href: "/shop?category=accessoires",
      image: "/images/accessoir.jpg",
    },
  ];

  const pillTriggerStyle = cn(
    "group inline-flex h-9 w-max items-center justify-center !rounded-full bg-transparent px-4 py-2 text-sm font-bold transition-all hover:bg-muted outline-none",
    "text-muted-foreground hover:text-foreground tracking-tight",
  );

  // Compute nav styles based on headerConfig
  const navBgColor = headerConfig?.bgColor || "rgba(255,255,255,0.2)";
  const isSticky = headerConfig?.sticky !== false;
  const isTransparent = headerConfig?.transparent === true;

  return (
    <>
      <nav
        className={cn(
          "z-50 transition-all duration-300 backdrop-blur-md border-b",
          isSticky ? "sticky top-0" : "relative",
          isTransparent
            ? "border-transparent bg-transparent"
            : "border-white/10",
          previewMode && "opacity-100", // Force visibility in preview
        )}
        style={{
          backgroundColor: isTransparent ? "transparent" : navBgColor,
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="nav-logo opacity-0 flex items-center justify-center transition-transform hover:scale-105"
          >
            <BrandLogo className="w-28 md:w-36" variant="light" />
          </Link>

          <div className="hidden md:block nav-menu opacity-0 absolute left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-gray-100/30 border border-white/20 p-1 flex items-center gap-1 shadow-sm">
              <NavigationMenu>
                <NavigationMenuList className="gap-0">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="rounded-full! transition-none"
                    >
                      <Link
                        href="/"
                        className={cn(
                          pillTriggerStyle,
                          isActive("/") &&
                            "bg-background text-foreground shadow-sm",
                        )}
                      >
                        Accueil
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        pillTriggerStyle,
                        pathname.startsWith("/shop") &&
                          "bg-background text-foreground shadow-sm",
                      )}
                    >
                      Boutique
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[100vw] max-w-[1000px] p-6 lg:p-8 rounded-[32px] bg-background border border-border shadow-2xl flex flex-col md:flex-row gap-6 lg:gap-8 overflow-hidden relative">
                        {/* Editor's pick banner */}
                        <div className="w-full md:w-[320px] shrink-0 rounded-[24px] overflow-hidden relative group hidden md:block aspect-[4/5] lg:aspect-auto">
                          <Image
                            src="/images/collection.jpg"
                            alt="Collection Printemps"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-widest rounded-full shadow-sm">
                              En Vedette
                            </span>
                          </div>
                          <div className="absolute bottom-8 left-8 right-8 z-10">
                            <h3 className="text-white text-3xl font-black leading-[1.1] tracking-tight mb-4 drop-shadow-lg">
                              Nouvelle
                              <br />
                              Collection
                            </h3>
                            <Link
                              href="/nouveautes"
                              className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-xl"
                            >
                              Explorer <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Categories List */}
                        <div className="flex-1 flex flex-col pt-2 pb-1 relative z-10">
                          <div className="flex items-center justify-between mb-6 px-1">
                            <h3 className="text-xl font-black tracking-tight text-foreground">
                              Catégories
                            </h3>
                            <Link
                              href="/produits"
                              className="text-sm font-bold text-primary flex items-center gap-1.5 hover:gap-2 transition-all p-2 -mr-2 rounded-lg hover:bg-muted"
                            >
                              Tout voir <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 relative min-h-[220px]">
                            {categoriesList.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="group relative rounded-2xl overflow-hidden bg-muted min-h-[140px] md:h-full w-full block shadow-sm border border-transparent hover:border-border transition-all hover:shadow-lg"
                              >
                                <Image
                                  src={cat.image}
                                  alt={cat.name}
                                  fill
                                  sizes="(max-width: 1024px) 25vw, 15vw"
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10">
                                  <h4 className="text-white text-lg font-black mb-0.5 drop-shadow-md">
                                    {cat.name}
                                  </h4>
                                  <span className="text-white/90 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                    Voir <ArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-auto">
                            <Link
                              href="/nouveautes"
                              className="group rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/10 p-4 transition-colors flex items-center gap-4"
                            >
                              <div className="bg-background shadow-sm text-primary p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-foreground leading-none mb-1.5 group-hover:text-primary transition-colors truncate">
                                  Nouveautés
                                </h4>
                                <p className="text-[11px] font-semibold text-muted-foreground truncate">
                                  Dernières pépites
                                </p>
                              </div>
                            </Link>

                            <Link
                              href="/promotions"
                              className="group rounded-2xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/20 p-4 transition-colors flex items-center gap-4"
                            >
                              <div className="bg-background shadow-sm text-rose-500 p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Tag className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-foreground leading-none mb-1.5 group-hover:text-rose-500 transition-colors truncate">
                                  Promotions
                                </h4>
                                <p className="text-[11px] font-semibold text-muted-foreground truncate">
                                  Jusqu&apos;à -50%
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="rounded-full! transition-none"
                    >
                      <Link
                        href="/promotions"
                        className={cn(
                          pillTriggerStyle,
                          isActive("/promotions") &&
                            "bg-background text-foreground shadow-sm",
                        )}
                      >
                        Promotions
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="rounded-full! transition-none"
                    >
                      <Link
                        href="/produits"
                        className={cn(
                          pillTriggerStyle,
                          isActive("/produits") &&
                            "bg-background text-foreground shadow-sm",
                        )}
                      >
                        Produits
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="rounded-full! transition-none"
                    >
                      <Link
                        href="/blog"
                        className={cn(
                          pillTriggerStyle,
                          pathname.startsWith("/blog") &&
                            "bg-background text-foreground shadow-sm",
                        )}
                      >
                        Blog
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 nav-actions opacity-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 hover:bg-muted rounded-full transition-colors group cursor-pointer"
              title="Rechercher"
            >
              <Search className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 hover:bg-muted rounded-full transition-all border border-transparent hover:border-border">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.photo} alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl p-2 mr-4 mt-2 shadow-2xl border-border animate-in fade-in zoom-in-95 duration-200">
                  <DropdownMenuLabel className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-black text-foreground leading-none">
                        {user.username}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border mx-2" />
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl px-4 py-2.5 focus:bg-muted cursor-pointer group"
                  >
                    <Link
                      href="/dashboard/customer"
                      className="flex items-center gap-3"
                    >
                      <UserCircle className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-sm font-bold text-foreground">
                        Mon Profil
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl px-4 py-2.5 focus:bg-muted cursor-pointer group"
                  >
                    <Link
                      href="/dashboard/customer/wishlist"
                      className="flex items-center gap-3"
                    >
                      <Heart className="w-4 h-4 text-muted-foreground group-hover:text-rose-500 transition-colors" />
                      <span className="text-sm font-bold text-foreground">
                        Mes Favoris
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl px-4 py-2.5 focus:bg-muted cursor-pointer group"
                  >
                    <Link
                      href="/dashboard/customer/addresses"
                      className="flex items-center gap-3"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-sm font-bold text-foreground">
                        Mes Adresses
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role !== "CUSTOMER" && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl px-4 py-2.5 focus:bg-muted cursor-pointer group"
                    >
                      <Link href="/admin" className="flex items-center gap-3">
                        <SettingsIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-bold text-foreground">
                          Tableau de bord
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border mx-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl px-4 py-2.5 focus:bg-rose-50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-bold text-rose-500">
                        Déconnexion
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="p-2.5 hover:bg-muted rounded-full transition-colors group"
                title="Connexion"
              >
                <User className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            )}

            <button
              onClick={() => setOpen(true)}
              className="relative p-2.5 text-primary-foreground rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center cursor-pointer group"
              style={{ backgroundColor: "var(--store-primary)" }}
            >
              <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              {user && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 text-[10px] font-bold text-white items-center justify-center border-2 border-white">
                    {itemCount}
                  </span>
                </span>
              )}
            </button>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-0 w-full bg-background border-b border-border p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-10 rounded-b-[40px] z-50">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-lg font-black tracking-tight text-foreground px-4 py-2 hover:bg-muted rounded-2xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/produits"
                className="text-lg font-black tracking-tight text-foreground px-4 py-2 hover:bg-muted rounded-2xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Boutique
              </Link>
              <div className="grid grid-cols-2 gap-2 pl-4">
                {collections.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground p-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={cn("w-4 h-4", item.color)} />
                    {item.title}
                  </Link>
                ))}
              </div>
              <Link
                href="/blog"
                className="text-lg font-black tracking-tight text-foreground px-4 py-2 hover:bg-muted rounded-2xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </div>

            <div className="h-px bg-border my-2"></div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex flex-col items-center justify-center gap-2 p-4 bg-muted rounded-3xl hover:bg-muted/80 transition-all"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Search className="w-5 h-5 text-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Rechercher
                </span>
              </button>

              <button
                className="flex flex-col items-center justify-center gap-2 p-4 bg-muted rounded-3xl hover:bg-muted/80 transition-all relative"
                onClick={() => {
                  setOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  {user && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Panier
                </span>
              </button>

              <Link
                href="/login"
                className="col-span-2 flex items-center justify-center gap-2 p-4 bg-primary text-primary-foreground rounded-3xl hover:opacity-90 transition-all shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-bold">Mon Compte</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setOpen(false)} />

      <SearchCommand open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
