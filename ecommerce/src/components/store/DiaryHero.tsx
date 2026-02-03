"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import anime from "animejs";
import { Playfair_Display, Great_Vibes } from "next/font/google";

// Load fonts locally for this component to ensure perfect style match
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

interface BannerData {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface DiaryHeroProps {
  customerCount?: number;
  recentCustomers?: {
    id: string | number;
    username: string;
    photo?: string | null;
  }[];
  previewMode?: boolean;
}

const defaultBanner: BannerData = {
  id: 0,
  title: "SUPER",
  subtitle: "Sale",
  description: "New Collection with 50% discount",
  buttonText: "SHOP NOW",
  buttonLink: "/shop",
  imageUrl: "/hero-model.png",
  order: 1,
  isActive: true,
};

export default function DiaryHero({ previewMode = false }: DiaryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/banners");
        if (response.ok) {
          const data = await response.json();
          const activeBanners = data.filter((b: BannerData) => b.isActive);
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error("Error loading banners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const goToNext = useCallback(() => {
    const total = banners.length || 1;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    const total = banners.length || 1;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [banners.length]);

  // Auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [banners.length, goToNext]);

  // Animations
  useEffect(() => {
    if (previewMode || !containerRef.current) return;

    anime({
      targets: containerRef.current.querySelectorAll(".hero-animate"),
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: "easeOutQuad",
      duration: 800,
    });
  }, [previewMode, currentIndex, isLoading]);

  const currentBanner =
    banners.length > 0 ? banners[currentIndex] : defaultBanner;

  // Colors inspired by the new Sage Green mockup
  const colors = {
    background: "#C9E4CA", // Sage Mint Green
    darkGreen: "#1F4D42", // Deep Teal/Green for Blob
    beige: "#d76e1990", // Beige for Text/Buttons
    white: "#ffffff",
    textDark: "#4A5D55", // Darker green/grey for small text
  };

  return (
    <section
      ref={containerRef}
      className={`relative w-full overflow-hidden ${playfair.className}`}
      style={{
        backgroundColor: colors.background,
        padding: "40px 5%", // Reduced padding to bring focus to center
      }}
    >
      <div className="max-w-[1400px] mx-auto min-h-[500px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 w-full items-center">
          {/* Reduced gap from gap-12 to gap-0/8 for 'mifanakaiky' (closer elements) */}
          {/* LEFT: Typography & Content (Span 7 cols) */}
          <div className="lg:col-span-7 relative z-10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left pl-0 lg:pl-10">
            {/* Top Logo / Label */}
            <div className="hero-animate opacity-0 mb-4 flex items-center gap-3">
              <div className="h-[2px] w-12 bg-[#4A5D55]/50"></div>
              <span className="text-[#4A5D55] tracking-[0.3em] text-xs font-bold uppercase">
                Boutique Diary
              </span>
            </div>

            {/* Main Title Box */}
            <div className="hero-animate opacity-0 relative">
              {/* Box Border - Removed for cleaner look in this version or made subtle */}

              {/* NEW COLLECTION Badge */}
              <div
                className="inline-block px-4 py-1 mb-2 text-[10px] font-bold tracking-[0.2em] transform -skew-x-12"
                style={{ backgroundColor: colors.beige, color: "#3a2012" }}
              >
                NEW COLLECTION
              </div>

              {/* SUPER (Serif) */}
              <h1 className="leading-[0.85] relative">
                <span
                  className="block font-black tracking-tighter uppercase"
                  style={{
                    fontSize: "clamp(80px, 12vw, 160px)",
                    color: colors.beige,
                  }}
                >
                  Super
                </span>

                {/* Sale (Script) */}
                <span
                  className={`block text-white relative z-10 ${greatVibes.className}`}
                  style={{
                    fontSize: "clamp(90px, 14vw, 180px)",
                    marginTop: "-0.3em",
                    marginLeft: "0.2em",
                    transform: "rotate(-5deg)",
                    textShadow: "0 5px 15px rgba(0,0,0,0.2)",
                  }}
                >
                  Sale
                </span>
              </h1>
            </div>

            {/* Button */}
            {currentBanner.buttonText && (
              <div className="hero-animate opacity-0 mt-8 lg:ml-4">
                <Link
                  href={currentBanner.buttonLink || "/shop"}
                  className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden rounded-full transition-transform hover:-translate-y-1 shadow-lg"
                  style={{ backgroundColor: colors.beige }}
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:scale-[1.5] group-hover:rotate-45 transition-transform duration-500 ease-out origin-center scale-0 rounded-full" />
                  <span
                    className="relative text-xs font-black tracking-[0.25em] uppercase"
                    style={{ color: "#3a2012" }}
                  >
                    {currentBanner.buttonText}
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: Image & Blob (Span 5 cols) */}
          <div className="lg:col-span-5 relative h-[500px] flex items-center justify-center lg:justify-center">
            {/* Main Image Container (Combined Blob & Image) */}
            <div className="hero-animate opacity-0 relative w-[450px] h-[450px] z-10 flex items-center justify-center">
              {/* Clients Satisfaits Badge (Top Right of Image) */}
              <div className="absolute -top-12 -right-12 z-30 flex flex-col items-center animate-bounce-slow">
                <div className="flex -space-x-4 mb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-[#C9E4CA] overflow-hidden relative shadow-md"
                    >
                      <Image
                        src={`https://i.pravatar.cc/150?img=${i + 25}`}
                        alt="client"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-[#C9E4CA] bg-white text-[#1F4D42] flex items-center justify-center text-sm font-bold shadow-md">
                    +
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-[#1F4D42]">
                    11+
                  </span>
                  <span className="text-[10px] font-bold text-[#4A5D55] uppercase tracking-widest">
                    Clients satisfaits
                  </span>
                </div>
              </div>{" "}
              {/* The Organic Blob Shape Container */}
              <div
                className="absolute inset-0 shadow-2xl transition-transform duration-500 hover:scale-105"
                style={{
                  borderRadius: "44% 56% 63% 37% / 46% 59% 41% 54%", // More organic shape
                  backgroundColor: colors.darkGreen, // The Dark Green Blob Background
                  overflow: "hidden",
                  transform: "rotate(-3deg)", // Slight tilt for dynamic feel
                }}
              >
                {/* Decorative Circle behind image (optional depth) */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>

                {!isLoading && (
                  <Image
                    src={currentBanner.imageUrl}
                    alt={currentBanner.title}
                    fill
                    className="object-cover" // object-cover to Fill the blob
                    priority
                  />
                )}
              </div>
              {/* 50% DISCOUNT Badge (Floating on top left edge of the blob) */}
              <div className="absolute bottom-12 -left-4 z-20">
                <div className="relative w-28 h-28 transform hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[#EACFA8] rounded-full shadow-xl animate-spin-slow-custom">
                    <div className="absolute inset-1 border border-dashed border-[#1F4D42] rounded-full opacity-60"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1F4D42] leading-none transform -rotate-12">
                    <span className="text-3xl font-black">50%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Discount
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
              <div className="absolute -bottom-10 right-10 flex gap-3 z-20">
                <button
                  onClick={goToPrev}
                  className="w-12 h-12 rounded-full border border-[#EACFA8]/50 text-[#EACFA8] flex items-center justify-center hover:bg-[#EACFA8] hover:text-[#1F4D42] transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="w-12 h-12 rounded-full border border-[#EACFA8]/50 text-[#EACFA8] flex items-center justify-center hover:bg-[#EACFA8] hover:text-[#1F4D42] transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
