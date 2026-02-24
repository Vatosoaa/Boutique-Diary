"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Great_Vibes, Playfair_Display } from "next/font/google";
import { Banner } from "@/types/banner";

/** Keyframes injected once */
const ANIMATIONS = `
  @keyframes hero-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(8deg); }
  }
  @keyframes hero-drift {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    33% { transform: translateX(12px) translateY(-10px) rotate(15deg); }
    66% { transform: translateX(-8px) translateY(8px) rotate(-10deg); }
  }
  @keyframes hero-spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes hero-pulse-soft {
    0%, 100% { opacity: 0.08; transform: scale(1); }
    50% { opacity: 0.18; transform: scale(1.15); }
  }
  @keyframes hero-sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
    50% { opacity: 0.7; transform: scale(1.2) rotate(180deg); }
  }
`;

/** Star SVG shape */
function StarShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

/** Diamond shape */
function DiamondShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L22 12L12 22L2 12Z" />
    </svg>
  );
}

/** Cross/sparkle shape */
function SparkleShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** All floating decorative elements for the cream section */
function FloatingElements() {
  return (
    <>
      <style>{ANIMATIONS}</style>

      {/* Large soft circle - top left in cream */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "5%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px solid rgba(212,163,115,0.35)",
          animation: "hero-float 7s ease-in-out infinite",
        }}
      />

      {/* Small filled circle */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "18%",
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "rgba(212,163,115,0.4)",
          animation: "hero-drift 9s ease-in-out infinite",
          animationDelay: "1s",
        }}
      />

      {/* Medium circle outline */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "8%",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1.5px solid rgba(180,140,90,0.15)",
          animation: "hero-float 11s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />

      {/* Tiny dot */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "12%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(212,163,115,0.3)",
          animation: "hero-pulse-soft 5s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      />

      {/* Circle pulse large */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "rgba(212,163,115,0.12)",
          animation: "hero-pulse-soft 8s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />

      {/* Star top-right area */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "10%",
          opacity: 0.35,
          animation: "hero-sparkle 4s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      >
        <StarShape size={20} color="#c49a5a" />
      </div>

      {/* Star small center-left */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "3%",
          opacity: 0.15,
          animation: "hero-drift 10s ease-in-out infinite",
          animationDelay: "4s",
        }}
      >
        <StarShape size={14} color="#b8895a" />
      </div>

      {/* Star bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "22%",
          opacity: 0.2,
          animation: "hero-sparkle 6s ease-in-out infinite",
          animationDelay: "2.5s",
        }}
      >
        <StarShape size={16} color="#d4a373" />
      </div>

      {/* Diamond top */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "5%",
          opacity: 0.12,
          animation: "hero-float 8s ease-in-out infinite",
          animationDelay: "3.5s",
        }}
      >
        <DiamondShape size={18} color="#c49a5a" />
      </div>

      {/* Diamond small */}
      <div
        style={{
          position: "absolute",
          bottom: "35%",
          left: "5%",
          opacity: 0.14,
          animation: "hero-drift 12s ease-in-out infinite",
          animationDelay: "1s",
        }}
      >
        <DiamondShape size={12} color="#b8895a" />
      </div>

      {/* Sparkle cross */}
      <div
        style={{
          position: "absolute",
          top: "65%",
          right: "8%",
          opacity: 0.16,
          animation: "hero-sparkle 5s ease-in-out infinite",
          animationDelay: "2s",
        }}
      >
        <SparkleShape size={22} color="#d4a373" />
      </div>

      {/* Sparkle small */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "30%",
          opacity: 0.13,
          animation: "hero-drift 7s ease-in-out infinite",
          animationDelay: "0s",
        }}
      >
        <SparkleShape size={14} color="#c49a5a" />
      </div>

      {/* Rotating ring */}
      <div
        style={{
          position: "absolute",
          bottom: "45%",
          right: "12%",
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "1.5px dashed rgba(212,163,115,0.2)",
          animation: "hero-spin-slow 15s linear infinite",
        }}
      />

      {/* Extra tiny dots */}
      <div
        style={{
          position: "absolute",
          top: "75%",
          left: "25%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "rgba(212,163,115,0.25)",
          animation: "hero-pulse-soft 6s ease-in-out infinite",
          animationDelay: "1.8s",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "38%",
          right: "18%",
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "rgba(180,140,90,0.18)",
          animation: "hero-float 9s ease-in-out infinite",
          animationDelay: "4.2s",
        }}
      />
    </>
  );
}

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "900",
  display: "swap",
});

interface DiaryHeroProps {
  customerCount?: number;
  recentCustomers?: {
    id: string | number;
    username: string;
    photo?: string | null;
  }[];
  previewMode?: boolean;
}

const defaultBanner: Banner = {
  id: 0,
  title: "NOUVELLE COLLECTION",
  subtitle: "SUPER",
  description: "Sale",
  buttonText: "Acheter maintenant",
  buttonLink: "/shop",
  imageUrl: "/hero-model.png",
  bgColor: null,
  order: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function DotsPattern() {
  return (
    <div
      className="absolute bottom-5 left-12 z-10 grid opacity-40"
      style={{ gridTemplateColumns: "repeat(5, 6px)", gap: "8px" }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: "#d4a373" }}
        />
      ))}
    </div>
  );
}

export default function DiaryHero({
  customerCount = 150,
  recentCustomers = [],
}: DiaryHeroProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/banners");
        if (res.ok) {
          const data = await res.json();
          setBanners(data.filter((b: Banner) => b.isActive));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const goTo = useCallback((index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 350);
  }, []);

  const total = banners.length || 1;
  const goToNext = useCallback(
    () => goTo((currentIndex + 1) % total),
    [currentIndex, total, goTo],
  );
  const goToPrev = useCallback(
    () => goTo((currentIndex - 1 + total) % total),
    [currentIndex, total, goTo],
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(goToNext, 6000);
    return () => clearInterval(id);
  }, [banners.length, goToNext]);

  const banner = banners.length > 0 ? banners[currentIndex] : defaultBanner;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(to right, #4a3728 70%, #f4f0e8 70%)",
        minHeight: "460px",
      }}
    >
      {/* ─── FIXED BACKGROUND ELEMENTS (DO NOT ANIMATE) ─── */}
      <div className="absolute inset-0 mx-auto max-w-[1200px] pointer-events-none">
        <DotsPattern />

        {/* Logo */}
        <div className="absolute top-7 left-12 z-20 flex items-center gap-2 pointer-events-auto">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-sm"
            style={{ backgroundColor: "#d4a373" }}
          >
            <span className="text-white text-xs font-black">D</span>
          </div>
          <span className="text-white text-sm font-bold uppercase tracking-widest">
            Diary Store
          </span>
        </div>

        {/* Decorative circle */}
        <div
          className="absolute -top-16 right-[42%] w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: "#d4a373" }}
        />

        {/* ─── RIGHT BACKGROUND (Cream Ellipse + Floating) ─── */}
        <div className="absolute inset-y-0 right-0 w-[52%] flex items-center justify-center">
          <div
            className="absolute inset-y-0 right-0 w-full"
            style={{
              backgroundColor: "#f4f0e8",
              clipPath: "ellipse(78% 90% at 80% 50%)",
            }}
          />
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <FloatingElements />
          </div>
        </div>
      </div>

      {/* ─── ANIMATED CONTENT LAYER ─── */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1200px",
          minHeight: "460px",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      >
        {/* ─── LEFT: Text content ─── */}
        <div className="relative z-10 flex flex-col justify-center pl-12 pr-4 py-24 w-[52%]">
          <span
            className="inline-block text-white text-[10px] font-extrabold uppercase tracking-[3px] mb-5 px-4 py-1.5 w-fit"
            style={{ backgroundColor: "#d4a373" }}
          >
            {banner.title}
          </span>

          <div
            className="relative"
            style={{ marginBottom: "clamp(48px, 5vw, 68px)" }}
          >
            <h1
              className={`${playfair.className} leading-none uppercase m-0 select-none`}
              style={{
                fontSize: "clamp(72px, 9vw, 120px)",
                color: "rgba(212, 163, 115, 0.22)",
                lineHeight: 0.85,
              }}
            >
              {banner.subtitle}
            </h1>
            <span
              className={`${greatVibes.className} absolute text-white pointer-events-none`}
              style={{
                fontSize: "clamp(52px, 6.5vw, 84px)",
                top: "28px",
                left: "18px",
                textShadow: "3px 3px 14px rgba(0,0,0,0.25)",
                lineHeight: 1,
              }}
            >
              {banner.description}
            </span>
          </div>

          <p className="text-white/40 text-[10px] uppercase tracking-[3px] mb-5 font-medium">
            www.diary-boutique.com
          </p>

          {banner.buttonText && (
            <Link
              href={banner.buttonLink || "/shop"}
              className="group inline-flex items-center gap-2 w-fit rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: "#d4a373",
                color: "#fff",
                padding: "13px 32px",
              }}
            >
              {banner.buttonText}
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {total > 1 && (
            <div className="flex items-center gap-2 mt-8">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? "26px" : "7px",
                    height: "7px",
                    backgroundColor:
                      i === currentIndex ? "#d4a373" : "rgba(255,255,255,0.3)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT: Product Image + Badges ─── */}
        <div className="absolute inset-y-0 right-0 w-[52%] flex items-center justify-center">
          {/* Product Image content */}
          <div
            className="relative z-10 overflow-hidden"
            style={{ width: "320px", height: "420px", marginRight: "50px" }}
          >
            {!isLoading && (
              <Image
                key={currentIndex}
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Badge Clients satisfaits */}
          <div
            className="absolute top-6 right-4 z-20 animate-float-gentle"
            style={{ animationDelay: "0.5s" }}
          >
            <div
              className="rounded-2xl px-4 py-3 flex flex-col items-center gap-2 shadow-lg border"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(212,163,115,0.25)",
                minWidth: "130px",
              }}
            >
              <div className="flex -space-x-3">
                {(recentCustomers.length > 0
                  ? recentCustomers.slice(0, 4)
                  : [26, 27, 28, 29]
                ).map((c, i) => (
                  <div
                    key={typeof c === "object" ? c.id : i}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow bg-gray-100"
                  >
                    <Image
                      src={
                        typeof c === "object" && c.photo
                          ? c.photo
                          : `https://i.pravatar.cc/150?img=${typeof c === "object" ? 20 + i : c}`
                      }
                      alt="client"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <span
                  className="block text-lg font-black leading-none"
                  style={{ color: "#4a3728" }}
                >
                  {customerCount}+
                </span>
                <span
                  className="block text-[9px] font-semibold uppercase tracking-widest mt-0.5"
                  style={{ color: "#4a3728", opacity: 0.55 }}
                >
                  Clients satisfaits
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Badge 50% Réduction */}
        <div
          className="absolute right-10 bottom-10 z-30 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-default select-none"
          style={{
            width: "110px",
            height: "110px",
            backgroundColor: "#d4a373",
            borderRadius: "50%",
            border: "8px solid rgba(255,255,255,0.2)",
            color: "#fff",
            transform: "rotate(10deg)",
          }}
        >
          <span className="text-2xl font-black leading-none">50%</span>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">
            Réduction
          </span>
        </div>

        {/* Arrow navigation */}
        {total > 1 && (
          <div className="absolute bottom-10 right-28 z-30 flex gap-2">
            <button
              onClick={goToPrev}
              className="w-8 h-8 rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-white/15 transition-all active:scale-90"
              aria-label="Précédent"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="w-8 h-8 rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-white/15 transition-all active:scale-90"
              aria-label="Suivant"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
