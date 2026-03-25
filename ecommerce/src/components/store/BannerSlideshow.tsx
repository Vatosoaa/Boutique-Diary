"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Banner } from "@/types/banner";

export default function BannerSlideshow() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/banners");
        if (response.ok) {
          const data = await response.json();
          const activeBanners = data.filter((b: Banner) => b.isActive);
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
    if (banners.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [banners.length, goToNext]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-store-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group shadow-lg">
      {/* Banner Image */}
      <div className="relative w-full h-full">
        <Image
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          fill
          className="object-cover transition-transform duration-700"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {currentBanner.subtitle && (
            <span className="text-xs uppercase tracking-wider text-white/80 font-medium">
              {currentBanner.subtitle}
            </span>
          )}
          <h3 className="text-xl md:text-2xl font-heading font-bold mt-1">
            {currentBanner.title}
          </h3>
          {currentBanner.description && (
            <p className="text-sm text-white/80 mt-2 line-clamp-2 max-w-md">
              {currentBanner.description}
            </p>
          )}
          {currentBanner.buttonText && currentBanner.buttonLink && (
            <a
              href={currentBanner.buttonLink}
              className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-md"
            >
              {currentBanner.buttonText}
            </a>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
