"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useCallback } from "react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  isPromotion?: boolean;
  images: { url: string }[];
  rating?: number | null;
}

interface CollectionScrollProps {
  products?: Product[];
}

export default function CollectionScroll({
  products = [],
}: CollectionScrollProps) {
  const displayProducts = products.length > 0 ? products : [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const bgColors = [
    "bg-[#e5fcf4]",
    "bg-[#6ec1e4]",
    "bg-[#b8d2e8]",
    "bg-[#336699]",
  ];

  // Scroll by one card width
  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild
      ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 24
      : 320;
    scrollRef.current.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <div className="inline-block bg-gray-100 rounded-full px-4 py-1 text-xs font-medium mb-4">
              Découvrir nos produits
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Collection des produits <br />
              les plus vendus de l&apos;année
            </h2>
          </div>

          <div className="mt-6 md:mt-0 text-right">
            <p className="text-xs text-gray-500 max-w-xs ml-auto mb-4">
              Nous distribuons nos collections dans des magasins incroyables.
              Découvrez-en plus sur nous et nos boutiques préférées.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Link
                href="/top-vente"
                className="border border-gray-300 rounded-full px-6 py-2 text-xs font-bold hover:bg-black hover:text-white transition-colors inline-block"
              >
                Voir plus
              </Link>
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  aria-label="Défiler à gauche"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  aria-label="Défiler à droite"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable product row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {displayProducts.map((item, index) => (
            <Link
              href={`/store/product/${item.id}`}
              key={item.id}
              className="flex-shrink-0 flex flex-col gap-3 snap-start"
              style={{ width: "clamp(280px, 25vw, 340px)" }}
            >
              <div
                className={`relative rounded-[32px] overflow-hidden ${bgColors[index % bgColors.length]} ${index === 1 ? "h-[380px]" : "h-[280px]"} w-full group`}
              >
                {item.images[0] ? (
                  <Image
                    src={item.images[0].url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 80vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-black/20 font-bold text-xl">
                    Pas d&apos;image
                  </div>
                )}

                {index === 3 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <ArrowUpRight className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center px-1">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <span>★</span>{" "}
                    <span className="text-gray-400">
                      ({item.rating || 4.5})
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-sm">
                    {formatPrice(item.price)}
                  </span>
                  {item.isPromotion && item.oldPrice && item.oldPrice > item.price && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground line-through opacity-50">
                        {formatPrice(item.oldPrice)}
                      </span>
                      <span className="text-[10px] font-black text-rose-500">
                        -{Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
