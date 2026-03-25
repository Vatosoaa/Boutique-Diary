"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    <section className="py-16 px-4 md:px-6 relative overflow-hidden bg-white dark:bg-zinc-950">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* High-Impact Header */}
        <div className="flex flex-col items-center text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-zinc-950 dark:text-white leading-[0.8] mb-4">
              Tendance
              <span className="block text-primary italic font-serif lowercase tracking-normal">
                Actuelle
              </span>
            </h2>
            <div className="absolute -right-4 -top-4 w-12 h-12 border-t-2 border-right-2 border-primary/30 rounded-tr-3xl" />
            <div className="absolute -left-4 -bottom-4 w-12 h-12 border-b-2 border-left-2 border-primary/30 rounded-bl-3xl" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mt-6"
          >
            L&apos;excellence à travers nos collections exclusives
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[550px] md:h-[500px] rounded-[48px] overflow-hidden bg-zinc-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-white/5">
          {/* Background Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03]">
            <span className="text-[25vw] font-black text-white italic whitespace-nowrap">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Content */}
            <div className="flex flex-col justify-center p-12 md:p-16 lg:pl-24 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="bg-primary/20 text-primary-foreground/90 w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                    Incontournable
                  </div>

                  <h3 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[0.95] tracking-tighter">
                    {product.name}
                  </h3>

                  <p className="text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-sm mb-10">
                    {productDescription}
                  </p>

                  <div className="flex items-center gap-8">
                    <Button
                      asChild
                      className="group bg-white hover:bg-zinc-100 text-zinc-950 h-14 px-10 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                    >
                      <Link
                        href={`/store/product/${product.id}`}
                        className="flex items-center gap-3"
                      >
                        Découvrir
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                      </Link>
                    </Button>

                    <div className="hidden sm:flex flex-col">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                        Plus de
                      </span>
                      <span className="text-xl font-black text-white">
                        1200+ Fans
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Image */}
            <div className="relative h-full flex items-center justify-center overflow-hidden lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.2, rotate: -10 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-[400px] aspect-square lg:aspect-[4/5] z-10 p-4"
                >
                  <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-zinc-800">
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                    {/* Glass Overlay on Bottom */}
                    <div className="absolute inset-x-4 bottom-4 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                          Prix Direct
                        </div>
                        <div className="text-xl md:text-2xl font-black text-white">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Minimal Controls */}
        <div className="flex justify-center gap-4 mt-8">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex
                  ? "w-12 bg-primary"
                  : "w-3 bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
