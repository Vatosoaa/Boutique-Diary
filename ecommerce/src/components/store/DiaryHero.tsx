"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { Great_Vibes, Playfair_Display } from "next/font/google";
import anime from "animejs";
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
  @keyframes morph {
    0%, 100% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; }
    30% { border-radius: 60% 40% 30% 70% / 60% 50% 50% 60%; }
    60% { border-radius: 70% 30% 50% 50% / 30% 60% 70% 40%; }
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
          style={{ backgroundColor: "var(--store-primary)" }}
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

  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

  const animateIn = useCallback(() => {
    if (!contentRef.current) return;

    // Staggered text animation
    anime({
      targets: contentRef.current.querySelectorAll(".stagger-item"),
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(150, { start: 200 }),
      duration: 800,
      easing: "easeOutExpo",
    });

    // Image scale animation
    if (imageRef.current) {
      anime({
        targets: imageRef.current,
        scale: [1.1, 1],
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutExpo",
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      animateIn();
    }
  }, [currentIndex, isLoading, animateIn]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
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
      className="relative w-full overflow-hidden flex flex-col md:block"
      style={{
        background:
          "linear-gradient(to right, var(--store-primary) 70%, var(--background) 70%)",
        minHeight: "460px",
        borderTop: "1px solid var(--store-primary)",
        borderBottom: "1px solid var(--store-primary)",
      }}
    >
      {/* ─── FIXED BACKGROUND ELEMENTS ─── */}
      <div className="absolute inset-0 mx-auto max-w-[1200px] pointer-events-none overflow-hidden">
        <div className="hidden sm:block">
          <DotsPattern />
        </div>

        {/* Logo */}
        <div className="absolute top-4 sm:top-7 left-6 sm:left-12 z-20 flex items-center gap-2 pointer-events-auto">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-sm"
            style={{ backgroundColor: "var(--store-primary)" }}
          >
            <span className="text-white text-[10px] sm:text-xs font-black">
              D
            </span>
          </div>
          <span className="text-white text-[10px] sm:text-sm font-bold uppercase tracking-widest leading-none">
            Diary boutique
          </span>
        </div>

        {/* Decorative circle */}
        <div
          className="absolute -top-16 right-[10%] md:right-[42%] w-24 h-24 md:w-32 md:h-32 rounded-full opacity-10"
          style={{ backgroundColor: "var(--store-primary)" }}
        />

        {/* ─── RIGHT BACKGROUND (Morphing Blob + Cream Ellipse + Floating) ─── */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[52%] flex items-center justify-center">
          {/* Infinite Morphing Blob */}
          <div
            className="absolute z-0 animate-morph opacity-10"
            style={{
              width: "clamp(400px, 50vw, 600px)",
              height: "clamp(400px, 50vw, 600px)",
              backgroundColor: "var(--store-primary)",
              filter: "blur(60px)",
              right: "-5%",
              top: "10%",
            }}
          />

          <div
            className="absolute inset-0 md:inset-y-0 md:right-0 w-full"
            style={{
              backgroundColor: "var(--background)",
              clipPath: "ellipse(100% 50% at 50% 100%)",
            }}
          />
          <div
            className="hidden md:block absolute inset-y-0 right-0 w-full"
            style={{
              backgroundColor: "var(--background)",
              clipPath: "ellipse(78% 90% at 80% 50%)",
            }}
          />
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <FloatingElements />
          </div>
        </div>
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: "1200px",
          minHeight: "460px",
        }}
      >
        {/* ─── LEFT: Text content ─── */}
        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-12 py-16 sm:py-24 w-full md:w-[52%]">
          <span
            className="stagger-item inline-block text-[10px] font-extrabold uppercase tracking-[3px] mb-5 px-4 py-1.5 w-fit rounded-full shadow-sm"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--store-primary)",
              opacity: 0,
            }}
          >
            {banner.title}
          </span>

          <div
            className="relative"
            style={{ marginBottom: "clamp(48px, 5vw, 68px)" }}
          >
            <h1
              className={`${playfair.className} stagger-item leading-none uppercase m-0 select-none`}
              style={{
                fontSize: "clamp(80px, 12vw, 150px)",
                color: "rgba(var(--store-accent-rgb), 0.6)",
                lineHeight: 0.85,
                opacity: 0,
              }}
            >
              {banner.subtitle}
            </h1>
            <span
              className={`${greatVibes.className} stagger-item absolute text-white pointer-events-none`}
              style={{
                fontSize: "clamp(60px, 8vw, 100px)",
                top: "min(35px, 4vw)",
                left: "20px",
                textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
                lineHeight: 1,
                opacity: 0,
              }}
            >
              {banner.description}
            </span>
          </div>

          <p
            className="stagger-item text-white/40 text-[10px] uppercase tracking-[3px] mb-5 font-medium"
            style={{ opacity: 0 }}
          >
            www.diary-boutique.com
          </p>

          {banner.buttonText && (
            <Link
              href={banner.buttonLink || "/shop"}
              className="stagger-item group inline-flex items-center gap-2 w-fit rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--store-primary)",
                padding: "13px 32px",
                opacity: 0,
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
        <div className="relative md:absolute md:inset-y-0 md:right-0 w-full md:w-[52%] flex flex-col items-center justify-center py-10 md:py-0">
          {/* Product Image container */}
          <div
            ref={imageRef}
            className="relative z-10 overflow-hidden"
            style={{
              width: "clamp(260px, 40vw, 360px)",
              height: "clamp(340px, 55vw, 480px)",
              marginRight: "0 md:50px",
              opacity: 0,
            }}
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
            className="absolute top-0 md:top-6 right-4 md:right-4 z-20 animate-float-gentle scale-75 sm:scale-100 origin-top-right"
            style={{ animationDelay: "0.5s" }}
          >
            <div
              className="rounded-2xl px-4 py-3 flex flex-col items-center gap-2 shadow-lg border"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "rgba(var(--store-primary-rgb), 0.25)",
                minWidth: "120px",
              }}
            >
              <div className="flex -space-x-3">
                {(recentCustomers.length > 0
                  ? recentCustomers.slice(0, 4)
                  : [26, 27, 28, 29]
                ).map((c, i) => (
                  <div
                    key={typeof c === "object" ? c.id : i}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white overflow-hidden relative shadow bg-gray-100"
                  >
                    <Image
                      src={
                        typeof c === "object" && c.photo
                          ? c.photo
                          : `https://i.pravatar.cc/150?img=${
                              typeof c === "object" ? 20 + i : c
                            }`
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
                  className="block text-base sm:text-lg font-black leading-none"
                  style={{ color: "var(--store-primary)" }}
                >
                  {customerCount}+
                </span>
                <span
                  className="block text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest mt-0.5"
                  style={{ color: "var(--store-primary)", opacity: 0.55 }}
                >
                  Clients satisfaits
                </span>
              </div>
            </div>
          </div>

          {/* Badge 50% Réduction */}
          <div
            className="absolute left-4 md:left-auto md:right-10 bottom-6 md:bottom-10 z-30 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-default select-none scale-90 md:scale-100 shadow-xl"
            style={{
              width: "110px",
              height: "110px",
              backgroundColor: "var(--store-primary)",
              borderRadius: "50%",
              border: "8px solid rgba(255,255,255,0.2)",
              color: "#fff",
              transform: "rotate(10deg)",
            }}
          >
            <span className="text-2xl sm:text-3xl font-black leading-none">
              50%
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5 text-center">
              Réduction
            </span>
          </div>

          {/* Arrow navigation */}
          {total > 1 && (
            <div className="absolute bottom-4 right-4 md:right-48 z-40 flex gap-2">
              <button
                onClick={goToPrev}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--store-primary)] text-[var(--store-primary)] bg-background/80 flex items-center justify-center hover:bg-[var(--store-primary)] hover:text-white transition-all duration-300 active:scale-90 shadow-md"
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
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--store-primary)] text-[var(--store-primary)] bg-background/80 flex items-center justify-center hover:bg-[var(--store-primary)] hover:text-white transition-all duration-300 active:scale-90 shadow-md"
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
      </div>
    </section>
  );
}
