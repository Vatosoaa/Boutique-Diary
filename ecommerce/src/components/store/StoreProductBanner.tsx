import { Sparkles, ArrowUpRight, Zap } from "lucide-react";
import StoreTypewriter from "./StoreTypewriter";
import Image from "next/image";
import Link from "next/link";

interface Customer {
  id: number;
  username: string;
  photo?: string | null;
}

interface StoreProductBannerProps {
  title: string;
  subtitle: string;
  badge: string;
  customerCount: number;
  recentCustomers?: Customer[];
  variant?: "indigo" | "rose" | "amber" | "cyan" | "emerald" | "theme";
  enableTypewriter?: boolean;
}

const variantConfig = {
  indigo: { accent: "#818cf8", bg: "#0b0b18", blob: "#4f46e5" },
  rose: { accent: "#fb7185", bg: "#12080d", blob: "#e11d48" },
  amber: { accent: "#fbbf24", bg: "#110d00", blob: "#d97706" },
  cyan: { accent: "#22d3ee", bg: "#040d12", blob: "#0891b2" },
  emerald: { accent: "#34d399", bg: "#041009", blob: "#059669" },
  theme: { accent: "#a78bfa", bg: "#0c0b1a", blob: "#6366f1" },
};

export default function StoreProductBanner({
  title,
  subtitle,
  badge,
  customerCount,
  recentCustomers = [],
  variant = "indigo",
  enableTypewriter = false,
}: StoreProductBannerProps) {
  const cfg = variantConfig[variant];

  const formatCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count.toString();
  };

  const avatars =
    recentCustomers.length > 0
      ? recentCustomers.slice(0, 4)
      : [1, 2, 3, 4].map((i) => ({
          id: i + 100,
          username: "Client",
          photo: null,
        }));

  return (
    <div
      className="relative w-full rounded-[2rem] overflow-hidden mb-12 shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
      style={{ minHeight: "420px" }}
    >
      <div className="flex flex-col md:flex-row min-h-[420px]">
        {/* ─── LEFT — content ─── */}
        <div
          className="relative flex flex-col justify-between px-10 md:px-14 pt-10 pb-0 md:w-[52%] shrink-0 z-10"
          style={{ background: cfg.bg }}
        >
          {/* Subtle glow */}
          <div
            className="absolute bottom-0 left-0 w-3/4 h-1/2 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 0% 100%, ${cfg.blob}18 0%, transparent 65%)`,
            }}
          />

          {/* Top */}
          <div className="relative flex items-center justify-between">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border"
              style={{
                borderColor: `${cfg.accent}30`,
                background: `${cfg.accent}10`,
                color: cfg.accent,
              }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              {badge}
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: cfg.accent,
                  boxShadow: `0 0 6px ${cfg.accent}`,
                }}
              />
              <span className="text-white/25 text-[9px] font-bold uppercase tracking-widest">
                2026
              </span>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative flex flex-col gap-5 flex-1 justify-center py-8">
            {/* Eyebrow line */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-px" style={{ background: cfg.accent }} />
              <span
                className="text-[9px] font-black uppercase tracking-[0.35em]"
                style={{ color: `${cfg.accent}80` }}
              >
                Printemps — Été 2026
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[clamp(2.6rem,4.5vw,4.2rem)] font-black text-white tracking-tighter leading-[0.88]">
              {title.split(" ").map((word, i) => {
                const highlighted = [
                  "Produits",
                  "Promotions",
                  "Journal",
                  "Nouveautés",
                ].includes(word);
                return (
                  <span key={i} className="inline-block mr-2.5 last:mr-0">
                    {highlighted ? (
                      <span className="italic" style={{ color: cfg.accent }}>
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                );
              })}
            </h1>

            {/* Subtitle */}
            <p className="text-white/45 text-sm leading-relaxed max-w-[360px]">
              {enableTypewriter ? (
                <StoreTypewriter text={subtitle} delay={800} speed={35} />
              ) : (
                subtitle
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#products"
                className="group/btn inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-95"
                style={{
                  background: cfg.accent,
                  color: "#000",
                  boxShadow: `0 8px 28px ${cfg.accent}35`,
                }}
              >
                Explorer
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>

              <Link
                href="/nouveautes"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider border border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-300"
              >
                <Zap className="w-3.5 h-3.5" />
                Nouveautés
              </Link>
            </div>

            {/* Avatars + count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {avatars.map((c, i) => (
                  <div
                    key={c.id}
                    className="w-7 h-7 rounded-full overflow-hidden border-2 bg-slate-800"
                    style={{ borderColor: cfg.bg, zIndex: 10 - i }}
                  >
                    <Image
                      src={c.photo || `https://i.pravatar.cc/80?u=${c.id}`}
                      alt={c.username}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-white/35 text-xs">
                <span className="text-white font-black">
                  +{formatCount(customerCount)}
                </span>{" "}
                clients satisfaits
              </span>
            </div>
          </div>

          {/* ── Bottom stats row ── */}
          <div
            className="relative -mx-10 md:-mx-14 border-t px-10 md:px-14 py-4 grid grid-cols-3 gap-4"
            style={{
              borderColor: `rgba(255,255,255,0.06)`,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {[
              { value: "4.9", label: "Note / 5" },
              { value: "+38%", label: "Ce mois" },
              { value: "30j", label: "Retours" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span
                  className="text-white font-black text-lg leading-none"
                  style={{ color: cfg.accent }}
                >
                  {value}
                </span>
                <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT — image ─── */}
        <div className="relative flex-1 min-h-[280px] md:min-h-0">
          <Image
            src="/images/banner.jpg"
            alt="Women's Collection"
            fill
            priority
            unoptimized
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 640px"
          />

          {/* Left-side blend */}
          <div
            className="absolute inset-x-0 inset-y-0 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${cfg.bg} 0%, ${cfg.bg}cc 8%, transparent 35%)`,
            }}
          />

          {/* Vignette effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
