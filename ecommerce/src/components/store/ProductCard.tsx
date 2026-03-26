"use client";

import Image from "next/image";
import { Eye, Heart, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  oldPrice?: number | null;
  image?: string;
  category?: string;
  isNew?: boolean;
  isPromotion?: boolean;
  isBestSeller?: boolean;
  rating?: number | null;
  reviewCount?: number;
  imageColor?: string;
  initialIsWishlisted?: boolean;
  promotionRule?: {
    isActive: boolean;
    actions: Record<string, unknown>;
  } | null;
}

export default function ProductCard({
  id,
  title,
  price,
  oldPrice,
  image,
  category,
  isNew,
  isPromotion,
  isBestSeller,
  rating,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reviewCount,
  imageColor,
  initialIsWishlisted = false,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlistLoading(true);
    try {
      const res = await fetch("/api/customer/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.added);
        toast.success(
          data.added ? "Ajouté aux favoris" : "Retiré des favoris",
          {
            icon: data.added ? "❤️" : "💔",
          },
        );
      } else if (res.status === 401) {
        toast.error("Veuillez vous connecter pour ajouter des favoris", {
          action: {
            label: "Se connecter",
            onClick: () => (window.location.href = "/login"),
          },
        });
      } else {
        toast.error("Une erreur est survenue");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const discountPercentage = useMemo(() => {
    // 1. Try to get from promotionRule actions
    if (
      promotionRule?.isActive &&
      promotionRule.actions &&
      typeof promotionRule.actions === "object"
    ) {
      const actions = promotionRule.actions as Record<string, unknown>;
      if (actions.discountPercentage) {
        return Math.round(Number(actions.discountPercentage));
      }
      if (actions.discountType === "PERCENTAGE" && actions.discountValue) {
        return Math.round(Number(actions.discountValue));
      }
    }

    // 2. Fallback to calculating from oldPrice ONLY if isPromotion is true but no promotionRule
    // This handles manual oldPrice entries if needed, but the primary logic should be the rule
    if (isPromotion && oldPrice && oldPrice > price) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }

    return null;
  }, [isPromotion, promotionRule, oldPrice, price]);

  const showPromotionBadge =
    (promotionRule?.isActive || (isPromotion && !promotionRule)) &&
    discountPercentage !== null &&
    discountPercentage > 0;

  return (
    <div className="group relative flex flex-col h-full product-card-reveal">
      {/* Image Container */}
      <div
        className={cn(
          "relative aspect-6/7 overflow-hidden rounded-[24px] mb-4 transition-all duration-500",
          imageColor || "bg-muted/30",
        )}
      >
        <Link href={`/store/product/${id}`} className="block w-full h-full">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
              className="object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
              Image
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isNew && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full shadow-sm">
              Nouveau
            </span>
          )}
          {isPromotion && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white rounded-full shadow-sm">
              {discountPercentage !== null && discountPercentage > 0
                ? `-${discountPercentage}%`
                : "PROMO"}
            </span>
          )}
          {isBestSeller && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black rounded-full shadow-sm">
              Top Vente
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={toggleWishlist}
            disabled={isWishlistLoading}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-sm transition-all shadow-lg border active:scale-90 disabled:opacity-50",
              isWishlisted
                ? "bg-rose-500 text-white border-rose-500 scale-110"
                : "bg-background/95 text-foreground hover:text-rose-500 border-border/10",
            )}
            aria-label={
              isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"
            }
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
        </div>

        {/* Quick Action */}
        <Link
          href={`/store/product/${id}`}
          className="absolute bottom-4 inset-x-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl overflow-hidden active:scale-95 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span>Voir en détail</span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-2 pb-2 mt-3">
        <div className="flex items-center justify-center gap-2 mb-2 w-full">
          {category && (
            <span className="text-[9px] uppercase font-extrabold text-muted-foreground/80 tracking-widest bg-muted/50 px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          )}
          {rating && rating > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {rating}
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/store/product/${id}`}
          className="text-[15px] md:text-base font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2 tracking-tight text-center"
        >
          {title}
        </Link>

        <div className="mt-auto flex items-baseline justify-center gap-1.5 w-full">
          <span className="text-lg md:text-xl font-black text-foreground drop-shadow-sm">
            {formatPrice(price)}
          </span>
          {isPromotion && oldPrice && (
            <span className="text-xs font-semibold text-muted-foreground/60 line-through decoration-rose-400/50 decoration-2">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
