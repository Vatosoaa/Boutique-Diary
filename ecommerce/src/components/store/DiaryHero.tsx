"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { Playfair_Display, Outfit } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Banner } from "@/types/banner";
import {
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Sparkles,
  Target,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

/** Ultra Premium Luxury Animations */
const CSS_ANIMATIONS = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes spin-slow-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes shimmer {
    0% { transform: translateX(-150%) skewX(-15deg); }
    100% { transform: translateX(250%) skewX(-15deg); }
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
    70% { box-shadow: 0 0 0 20px rgba(255,255,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
  }
  @keyframes ambient-drift {
    0% { transform: translate(0, 0) scale(1); opacity: 0.05; }
    33% { transform: translate(30px, -50px) scale(1.1); opacity: 0.1; }
    66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.08; }
    100% { transform: translate(0, 0) scale(1); opacity: 0.05; }
  }
`;

const outfit = Outfit({ subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

interface DiaryHeroProps {
  customerCount?: number;
  recentCustomers?: Array<{
    id: string | number;
    username: string;
    photo?: string | null;
  }>;
  previewMode?: boolean;
}

const SparkleEffect = ({
  delay,
  top,
  left,
  size,
}: {
  delay: number;
  top: string;
  left: string;
  size: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0], rotate: [0, 90, 180] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    className="absolute pointer-events-none z-10 hidden md:block"
    style={{ top, left }}
  >
    <Sparkles className="text-white/60" size={size} strokeWidth={1} />
  </motion.div>
);

export default function DiaryHero({
  customerCount = 150,
  recentCustomers = [],
  previewMode = false,
}: DiaryHeroProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const total = banners.length || 1;

  const goToNext = useCallback(() => {
    setCurrentIndex(p => (p + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(p => (p - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        setBanners(data.filter((b: Banner) => b.isActive));
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (total <= 1 || previewMode) return;
    const id = setInterval(goToNext, 7000);
    return () => clearInterval(id);
  }, [total, goToNext, previewMode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } =
      sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const banner =
    banners.length > 0
      ? banners[currentIndex]
      : {
          title: "Collection 2026",
          subtitle: "Nouvelle Saison",
          description: "Élégance Absolue",
          buttonText: "Découvrir",
          buttonLink: "/shop",
          imageUrl: "/hero-model.png",
        };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full min-h-[700px] md:min-h-0 md:h-[580px] overflow-hidden ${outfit.className} pb-16 md:pb-0`}
      style={{ backgroundColor: "var(--store-primary)" }}
    >
      <style>{CSS_ANIMATIONS}</style>

      {/* ─── LUXURY BACKGROUND & FRAMES ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-primary" />

        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

        {/* Dynamic Glow */}
        <motion.div
          animate={{ x: mousePosition.x * 60, y: mousePosition.y * 60 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white opacity-[0.06] blur-[100px] rounded-full hidden md:block"
        />

        {/* Elegant Inner Frame */}
        <div className="absolute inset-3 md:inset-4 border border-white/10 rounded-2xl md:rounded-[2rem] pointer-events-none" />
        <div className="absolute inset-[1rem] md:inset-[1.25rem] border border-white/5 rounded-xl pointer-events-none hidden md:block" />

        {/* Dynamic Rings behind the product */}
        <div className="absolute overflow-hidden inset-0">
          <div
            className="absolute top-[70%] md:top-1/2 right-1/2 md:right-[20%] translate-x-1/2 md:translate-x-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10"
            style={{ animation: "ambient-drift 15s infinite" }}
          />
          <div
            className="absolute top-[70%] md:top-1/2 right-1/2 md:right-[20%] translate-x-1/2 md:translate-x-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10 border-dashed"
            style={{ animation: "spin-slow 40s linear infinite" }}
          />
        </div>

        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.05] blur-[120px] rounded-full" />
      </div>

      {/* Decorative Floating Sparkles */}
      <SparkleEffect delay={0.5} top="15%" left="15%" size={20} />
      <SparkleEffect delay={1.5} top="65%" left="30%" size={14} />
      <SparkleEffect delay={2} top="10%" left="85%" size={24} />
      <SparkleEffect delay={3} top="85%" left="70%" size={18} />

      <div className="relative mx-auto max-w-[1240px] px-6 sm:px-14 h-full z-10 flex flex-col md:flex-row items-center pt-8 md:pt-0 pb-16 md:pb-0">
        {/* ─── LEFT PANEL: TEXT CONTENT ─── */}
        <div className="w-full md:w-[50%] h-auto md:h-full flex flex-col justify-center text-white relative z-20 mt-4 md:mt-0 order-1 md:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(5px)", x: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 md:gap-5"
            >
              {/* Chic Badge */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-1 py-1 group"
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/90">
                    {banner.subtitle || "Tendance"}
                  </span>
                </motion.div>
              </div>

              {/* Exact Sizes: 45px Title / 30px Subtitle with Reveal Animation */}
              <div className="relative flex flex-col gap-2 pl-5 md:pl-6">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="absolute left-0 top-1 w-[2px] md:w-[3px] bg-gradient-to-b from-white via-white/50 to-transparent rounded-full"
                />

                <div className="overflow-hidden py-1">
                  <motion.h1
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`${playfair.className} text-[38px] md:text-[45px] leading-[1.1] text-white font-semibold tracking-wide drop-shadow-lg`}
                  >
                    {banner.title || "Collection 2026"}
                  </motion.h1>
                </div>

                <div className="overflow-hidden pb-1">
                  <motion.span
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`${playfair.className} text-[26px] md:text-[30px] italic text-white/90 leading-[1.2] drop-shadow-md block`}
                  >
                    {banner.description || "Élégance Absolue"}
                  </motion.span>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="overflow-hidden pt-2 md:pt-4">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={banner.buttonLink || "/shop"}
                    className="group relative inline-flex items-center gap-6 bg-white border border-transparent text-primary px-8 py-3 md:py-3.5 rounded-full font-bold text-[10px] uppercase tracking-[0.25em] transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] hover:bg-white/90 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 translate-x-[-150%] group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10">
                      {banner.buttonText || "Acheter"}
                    </span>
                    <div className="relative z-10 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* Socials & Meta */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 md:pt-6 pb-2 md:pb-0"
              >
                <div className="flex gap-4 md:gap-5 opacity-70">
                  <Instagram className="w-4 h-4 hover:opacity-100 transition-all hover:scale-110 cursor-pointer text-white" />
                  <Facebook className="w-4 h-4 hover:opacity-100 transition-all hover:scale-110 cursor-pointer text-white" />
                  <Twitter className="w-4 h-4 hover:opacity-100 transition-all hover:scale-110 cursor-pointer text-white" />
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40 hidden sm:block" />
                <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] opacity-60">
                  Diary Boutique Officiel
                </span>
              </motion.div>

              {/* ─── MINI TRUST STATS WIDGET ─── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-3 md:mt-5 bg-[#f5fbfa] shadow-xl rounded-xl py-2 px-4 md:py-2.5 md:px-5 flex items-center justify-between w-full max-w-[260px] md:max-w-[280px]"
              >
                <div className="flex flex-col items-center justify-center text-center gap-0.5 md:gap-1">
                  <Target
                    className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500"
                    style={{ color: "var(--store-primary)" }}
                    strokeWidth={2.5}
                  />
                  <span
                    className={`${outfit.className} text-sm md:text-base font-black text-[#1A1A24] leading-none tracking-tight`}
                  >
                    4.9
                  </span>
                  <span className="text-[5px] md:text-[6px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
                    Excellence
                  </span>
                </div>

                <div className="w-px h-5 md:h-6 bg-slate-200/80" />

                <div className="flex flex-col items-center justify-center text-center gap-0.5 md:gap-1">
                  <TrendingUp
                    className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500"
                    style={{ color: "var(--store-primary)" }}
                    strokeWidth={2.5}
                  />
                  <span
                    className={`${outfit.className} text-sm md:text-base font-black text-[#1A1A24] leading-none tracking-tight`}
                  >
                    +38%
                  </span>
                  <span className="text-[5px] md:text-[6px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
                    Tendance
                  </span>
                </div>

                <div className="w-px h-5 md:h-6 bg-slate-200/80" />

                <div className="flex flex-col items-center justify-center text-center gap-0.5 md:gap-1">
                  <ShieldCheck
                    className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500"
                    style={{ color: "var(--store-primary)" }}
                    strokeWidth={2.5}
                  />
                  <span
                    className={`${outfit.className} text-sm md:text-base font-black text-[#1A1A24] leading-none tracking-tight`}
                  >
                    30j
                  </span>
                  <span className="text-[5px] md:text-[6px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
                    Garantie
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── RIGHT PANEL: VISUAL ─── */}
        <div className="w-full md:w-[50%] h-auto md:h-full relative flex items-center justify-center flex-1 order-2 md:order-2 mt-8 md:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ x: mousePosition.x * 15, y: mousePosition.y * 15 }}
              className="relative w-full h-full flex items-center justify-center pointer-events-none md:pointer-events-auto"
            >
              {/* Main Product Image with Smooth Float Animation */}
              <motion.div className="relative w-[280px] sm:w-[320px] md:w-[500px] h-[300px] sm:h-[350px] md:h-[480px] z-10">
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    filter: [
                      "drop-shadow(0 20px 30px rgba(0,0,0,0.4))",
                      "drop-shadow(0 35px 40px rgba(0,0,0,0.25))",
                      "drop-shadow(0 20px 30px rgba(0,0,0,0.4))",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full relative"
                >
                  {!isLoading && (
                    <Image
                      src={banner.imageUrl || "/hero-model.png"}
                      alt="Banner Product"
                      fill
                      className="object-contain"
                      priority
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Glassmorphism Client Pill with Shimmer and Continuous Float */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute top-0 right-0 md:top-6 md:-right-4 z-20 scale-[0.85] md:scale-100 origin-top-right group"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="relative overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/30 pl-3 md:pl-3 pr-5 md:pr-6 py-2 md:py-2.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.25)] flex items-center gap-3 md:gap-4 hover:bg-white/20 transition-all pointer-events-auto cursor-default"
                >
                  <div
                    className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    style={{ animation: "shimmer 3s infinite" }}
                  />
                  <div className="relative z-10 flex -space-x-2">
                    {(recentCustomers?.length > 0 ? recentCustomers : [1, 2, 3])
                      .slice(0, 3)
                      .map((c: any, i) => (
                        <div
                          key={typeof c === "object" ? c.id : i}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/50 overflow-hidden relative shadow-lg bg-zinc-200"
                        >
                          <Image
                            src={
                              typeof c === "object" && c.photo
                                ? c.photo
                                : `https://i.pravatar.cc/100?u=${i + currentIndex + 10}`
                            }
                            alt="client"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                  <div className="relative z-10 flex flex-col">
                    <span className="text-sm md:text-md font-black text-white leading-none">
                      {customerCount}+
                    </span>
                    <span className="text-[6px] md:text-[7px] font-bold uppercase text-white/90 tracking-[0.1em] mt-1 leading-[1.2]">
                      Clients
                      <br />
                      Satisfaits
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Luxury Promo Tag */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                className="absolute bottom-4 left-0 md:bottom-12 md:left-2 z-20 scale-[0.85] md:scale-100 origin-bottom-left"
              >
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [12, 8, 12] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <div
                    className="w-[85px] h-[85px] md:w-[100px] md:h-[100px] bg-white text-primary flex flex-col items-center justify-center rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[3px] md:border-[4px] border-white/90 pointer-events-none"
                    style={{ animation: "pulse-ring 3s infinite" }}
                  >
                    <span
                      className={`${playfair.className} text-2xl md:text-3xl font-black italic tracking-tighter leading-none`}
                    >
                      -50%
                    </span>
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] opacity-80 mt-1">
                      Offre
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Elegant Navigation Controls */}
          <div className="absolute -bottom-10 right-1/2 translate-x-1/2 md:translate-x-0 md:bottom-6 md:right-0 flex gap-4 md:-right-6 z-30 pointer-events-auto">
            <button
              onClick={goToPrev}
              type="button"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 bg-transparent flex items-center justify-center hover:bg-white hover:text-primary transition-all text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 group-hover:-translate-x-1 transition-transform relative z-10" />
            </button>
            <button
              onClick={goToNext}
              type="button"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-primary transition-all text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
