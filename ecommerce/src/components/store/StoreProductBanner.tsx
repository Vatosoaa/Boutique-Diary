"use client";

import {
  Sparkles,
  ArrowUpRight,
  Target,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import StoreTypewriter from "./StoreTypewriter";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface StoreProductBannerProps {
  title: string;
  subtitle: string;
  badge: string;
  variant?: "indigo" | "rose" | "amber" | "cyan" | "emerald" | "theme";
  enableTypewriter?: boolean;
  image?: string;
}

const variantConfig = {
  indigo: {
    accent: "#4f46e5",
    bg: "#f8fafc",
    blob: "#e0e7ff",
    gradient: "from-indigo-100/50",
  },
  rose: {
    accent: "#e11d48",
    bg: "#fff1f2",
    blob: "#ffe4e6",
    gradient: "from-rose-100/50",
  },
  amber: {
    accent: "#d97706",
    bg: "#fffbeb",
    blob: "#fef3c7",
    gradient: "from-amber-100/50",
  },
  cyan: {
    accent: "#0891b2",
    bg: "#ecfeff",
    blob: "#cffafe",
    gradient: "from-cyan-100/50",
  },
  emerald: {
    accent: "#059669",
    bg: "#ecfdf5",
    blob: "#d1fae5",
    gradient: "from-emerald-100/50",
  },
  theme: {
    accent: "#6366f1",
    bg: "#f8fafc",
    blob: "#e0e7ff",
    gradient: "from-violet-100/50",
  },
};

export default function StoreProductBanner({
  title,
  subtitle,
  badge,
  variant = "indigo",
  enableTypewriter = false,
  image = "/images/banner.jpg",
}: StoreProductBannerProps) {
  const cfg = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-hidden border border-gray-100 bg-white rounded-none sm:rounded-[2.5rem] shadow-sm mb-8"
    >
      <div className="flex flex-col lg:flex-row min-h-[500px] w-full max-w-[1920px] mx-auto">
        {/* ─── LEFT SIDE — CONTENT ─── */}
        <div
          className="relative flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-8 lg:w-[55%] shrink-0 z-10"
          style={{ background: cfg.bg }}
        >
          {/* Decorative ambient light */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-60"
            style={{
              background: `radial-gradient(circle at 10% 20%, ${cfg.blob}80 0%, transparent 50%), radial-gradient(circle at 90% 80%, ${cfg.blob}40 0%, transparent 50%)`,
            }}
          />

          {/* Header row */}
          <div className="relative flex items-center justify-between z-10 max-w-[500px] mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-white shadow-sm border border-gray-100"
              style={{
                color: cfg.accent,
              }}
            >
              <Sparkles className="w-3 h-3" />
              {badge}
            </motion.div>

            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hidden sm:flex">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{
                  background: cfg.accent,
                  boxShadow: `0 0 10px ${cfg.accent}`,
                }}
              />
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">
                Saison 2026
              </span>
            </div>
          </div>

          {/* Core Content */}
          <div className="relative flex flex-col gap-4 flex-1 justify-center z-10">
            <div className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-16 h-px"
                  style={{ backgroundColor: cfg.accent }}
                />
                <span
                  className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]"
                  style={{ color: cfg.accent }}
                >
                  Haute Couture — Modernité
                </span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-gray-900 tracking-tighter leading-[0.9]"
              >
                {title}
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-sm md:text-base leading-relaxed max-w-[520px] font-medium hidden md:block"
            >
              {enableTypewriter ? (
                <StoreTypewriter text={subtitle} delay={1000} speed={40} />
              ) : (
                subtitle
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                href="#products"
                className="group/btn relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95"
                style={{
                  background: cfg.accent,
                  color: "#ffffff",
                }}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                Explorer
                <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </Link>
            </motion.div>
          </div>

          {/* ── Stats Glass Card (COMPACT) ── */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative lg:absolute lg:bottom-8 lg:-right-32 lg:w-[420px] bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 grid grid-cols-3 gap-6 z-50 shadow-2xl shadow-gray-200/50 overflow-hidden mt-6 lg:mt-0 hidden md:grid"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-50 pointer-events-none`}
            />

            {[
              { value: "4.9", label: "Excellence", icon: Target },
              { value: "+38%", label: "Tendance", icon: TrendingUp },
              { value: "30j", label: "Garantie", icon: ShieldCheck },
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="relative flex flex-col items-center gap-1.5"
              >
                <Icon
                  className="w-5 h-5 mb-1.5 opacity-80"
                  style={{ color: cfg.accent }}
                />
                <span className="text-gray-900 font-black text-xl md:text-2xl tracking-tighter">
                  {value}
                </span>
                <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em]">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── RIGHT SIDE — MEDIA ─── */}
        <div className="relative flex-1 min-h-[250px] lg:min-h-0 overflow-hidden bg-gray-100">
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={title}
              fill
              priority
              unoptimized
              className="object-cover object-center scale-105 transition-transform hover:scale-100 duration-1000"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Blends and Vignettes tuned for light mode */}
          <div
            className="absolute inset-x-0 inset-y-0 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${cfg.bg} 0%, ${cfg.bg}E6 10%, transparent 40%)`,
            }}
          />
          <div
            className="absolute inset-x-0 inset-y-0 pointer-events-none lg:hidden"
            style={{
              background: `linear-gradient(to bottom, ${cfg.bg} 0%, transparent 20%)`,
            }}
          />

          {/* Artistic vignette - lighter for light mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent pointer-events-none mix-blend-multiply" />

          {/* Subtle light leak matching background */}
          <div className="absolute top-0 right-0 w-full h-full bg-white/10 mix-blend-overlay pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
