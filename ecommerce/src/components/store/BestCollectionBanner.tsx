"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface BannerProduct {
  id: number | string;
  name: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  isPromotion?: boolean;
  images: { url: string }[];
}

interface BestCollectionBannerProps {
  products: BannerProduct[];
}

export default function BestCollectionBanner({
  products,
}: BestCollectionBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!products || products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000); // 5 seconds for a more relaxed feel

    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) return null;

  const product = products[currentIndex];
  const productImage = product.images?.[0]?.url || "/placeholder.jpg";
  const productDescription =
    product.description ||
    "Découvrez notre collection exclusive pour un style unique et élégant.";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
      {/* Background abstract decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent -z-10 blur-3xl opacity-30" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full -z-10 blur-3xl opacity-20" />

      <div className="max-w-[1400px] mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-[48px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative">
          {/* Subtle background text */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none">
            <span className="text-[20vw] font-black whitespace-nowrap uppercase tracking-tighter">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[500px] md:min-h-[600px]">
            {/* Content Side */}
            <div className="p-8 md:p-16 lg:p-24 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Tendance Actuelle
                  </motion.div>

                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-[1.05] tracking-tight max-w-lg">
                    <span
                      className="block mb-2 font-serif"
                      style={{ fontVariant: "small-caps" }}
                    >
                      {product.name.split(" ")[0]}
                    </span>
                    <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#248197] to-[#3aabc6] leading-tight">
                      Collection Exclusive
                    </span>
                    <span className="block font-serif italic font-light opacity-90">
                      Pour Vous
                    </span>
                  </h2>

                  <p className="text-muted-foreground mb-10 max-w-sm text-lg md:text-xl leading-relaxed opacity-80">
                    {productDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    <Button
                      asChild
                      size="xl"
                      className="rounded-full px-12 h-16 text-lg font-black bg-[#248197] hover:bg-[#2d9db8] text-white shadow-[0_20px_40px_-12px_rgba(36,129,151,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(36,129,151,0.5)] transition-all hover:-translate-y-1 duration-300"
                    >
                      <Link href={`/store/product/${product.id}`}>
                        Acheter Maintenant
                      </Link>
                    </Button>

                    <div className="flex -space-x-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden"
                        >
                          <Image
                            src={`https://i.pravatar.cc/100?u=${String(product.id) + i}`}
                            alt="User"
                            width={40}
                            height={40}
                          />
                        </div>
                      ))}
                      <div className="text-xs font-bold text-muted-foreground flex items-center ml-2 pl-4">
                        +1.2k avis clients
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image Side */}
            <div className="relative h-full min-h-[400px] flex items-center justify-center p-8 lg:p-16">
              {/* Complex background aura */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-[80%] h-[80%] bg-linear-to-tr from-[#248197]/40 to-transparent rounded-full blur-[100px] animate-pulse" />
                <div className="absolute w-[60%] h-[60%] bg-blue-100/30 rounded-full blur-[80px] animate-pulse delay-700" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 5, y: -30 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group w-full max-w-[450px]"
                >
                  {/* Floating animation for the image container */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 1, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10"
                  >
                    {/* Polaroid Styled Frame */}
                    <div className="relative aspect-3/4 w-full bg-white dark:bg-gray-800 p-4 md:p-6 rounded-[32px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.15)] rotate-[-4deg] border border-gray-100 dark:border-gray-800">
                      <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          unoptimized
                          priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* Secondary decorative frame */}
                    <div className="absolute inset-0 bg-primary/5 rounded-[32px] rotate-3 -z-10 blur-sm scale-105" />
                  </motion.div>

                  {/* Premium Price Tag */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute bottom-4 -right-2 md:-right-6 lg:-right-10 z-20"
                  >
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-8 py-5 rounded-3xl shadow-[0_20px_40px_-8px_rgba(0,0,0,0.1)] border border-white/20 dark:border-gray-800/50 transform -rotate-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                          Prix Exclusif
                        </div>
                        {product.isPromotion &&
                          product.oldPrice &&
                          product.oldPrice > product.price && (
                            <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                              -
                              {Math.round(
                                ((product.oldPrice - product.price) /
                                  product.oldPrice) *
                                  100,
                              )}
                              %
                            </span>
                          )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-black text-[#248197] tracking-tight">
                          {formatPrice(product.price)}
                        </span>
                        {product.isPromotion && product.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through decoration-rose-400/30">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating interaction hints */}
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#248197]/10 rounded-full blur-2xl mix-blend-multiply animate-bounce duration-3000" />
                  <div className="absolute top-1/2 -right-12 w-16 h-16 bg-amber-100/30 rounded-full blur-[30px] animate-pulse" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-3 mt-10">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                idx === currentIndex
                  ? "w-10 bg-[#248197] shadow-lg shadow-[#248197]/20"
                  : "w-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
