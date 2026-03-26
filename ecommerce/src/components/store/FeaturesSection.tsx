"use client";

import {
  Plus,
  Minus,
  Award,
  Leaf,
  ShieldCheck,
  Star,
  CheckCircle2,
  Gem,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import anime from "animejs";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function FeaturesSection({
  customerCount = 0,
  recentCustomers = [],
}: {
  customerCount?: number;
  recentCustomers?: {
    id: string | number;
    username: string;
    photo?: string | null;
  }[];
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const displayCount = customerCount;

  const displayAvatars =
    recentCustomers.length > 0
      ? recentCustomers.slice(0, 4).map(c => ({
          url: c.photo || `https://i.pravatar.cc/150?u=${c.id}`,
          name: c.username,
        }))
      : [
          { url: "https://i.pravatar.cc/150?u=1", name: "Client" },
          { url: "https://i.pravatar.cc/150?u=2", name: "Client" },
          { url: "https://i.pravatar.cc/150?u=3", name: "Client" },
          { url: "https://i.pravatar.cc/150?u=4", name: "Client" },
        ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target.querySelector(".visual-reveal"),
              scale: [0.99, 1],
              opacity: [0, 1],
              easing: "easeOutExpo",
              duration: 1000,
            });

            anime({
              targets: entry.target.querySelectorAll(".stagger-animate"),
              translateY: [10, 0],
              opacity: [0, 1],
              delay: anime.stagger(50),
              easing: "easeOutExpo",
              duration: 800,
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Matériaux d'Élite",
      icon: Gem,
      content:
        "Nous voyageons pour dénicher les fibres les plus nobles. De la soie sauvage au lin premium, chaque pièce est une ode à la matière.",
      color: "text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/20",
    },
    {
      title: "Artisanat d'Art",
      icon: Award,
      content:
        "Nos créations sont le fruit d'un savoir-faire artisanal méticuleux. Chaque couture est vérifiée à la main pour une perfection sans compromis.",
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-500/10",
    },
    {
      title: "Éco-Conscience",
      icon: Leaf,
      content:
        "Le luxe de demain est durable. Nos processus de teinture naturels et nos circuits courts réduisent notre empreinte tout en préservant l'éclat.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Service Signature",
      icon: ShieldCheck,
      content:
        "Un accompagnement royal pour chaque client. De la personnalisation sur mesure au suivi post-achat, vous faites partie de la famille.",
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-14 px-4 md:px-8 bg-white dark:bg-[#0a0a0a] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Visual Showcase - Slimmer aspect for minimal height */}
          <div className="lg:col-span-5 visual-reveal opacity-0 relative order-2 lg:order-1">
            <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden shadow-xl group border-[3px] border-white dark:border-white/5">
              <Image
                src="/images/why-choose-us.png"
                alt="L'Esprit Diary"
                fill
                className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50" />

              <div className="absolute top-3 left-3">
                <div className="px-3 py-1.5 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-full shadow-md border border-white/20 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
                    Certifié
                  </span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/10 p-3 rounded-[16px] shadow-lg">
                  <h4 className="text-sm font-black text-white italic tracking-tight leading-tight">
                    &quot;L&apos;excellence Diary.&quot;
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column - Ultra-tightened spacing */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="space-y-3">
              <div className="stagger-animate opacity-0 inline-flex items-center gap-2 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">
                  Signature
                </span>
              </div>

              <h2 className="stagger-animate opacity-0 text-3xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
                Pourquoi Nous{" "}
                <span className="italic text-primary">Choisir ?</span>
              </h2>

              <p className="stagger-animate opacity-0 text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium max-w-lg">
                Plongez dans un univers où le luxe rencontre l&apos;âme
                malgache. Une promesse d&apos;excellence et d&apos;authenticité
                sans compromis.
              </p>

              <div className="stagger-animate opacity-0 flex items-center gap-5 pt-1">
                <div className="flex -space-x-2">
                  {displayAvatars.map((client, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-[2px] border-white dark:border-[#0a0a0a] overflow-hidden shadow-sm transition-transform hover:scale-105 hover:z-10 cursor-pointer"
                    >
                      <Image
                        src={client.url}
                        alt={client.name}
                        width={36}
                        height={36}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full border-[2px] border-white dark:border-[#0a0a0a] bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                    <span className="text-[8px] font-black">
                      {displayCount}+
                    </span>
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    4.9
                  </span>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                </div>
              </div>
            </div>

            <div className="stagger-animate opacity-0 space-y-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={cn(
                      "group rounded-[18px] transition-all duration-300 overflow-hidden cursor-pointer",
                      isOpen
                        ? "bg-white dark:bg-white/5 shadow-md shadow-primary/5 border border-primary/20 dark:border-primary/10"
                        : "hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent",
                    )}
                    onClick={() => setOpenIndex(index)}
                  >
                    <div className="flex items-center justify-between p-3 md:p-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-300",
                            isOpen
                              ? feature.bgColor
                              : "bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4.5 h-4.5 transition-all duration-300",
                              isOpen ? feature.color : "text-gray-400",
                            )}
                          />
                        </div>
                        <h3
                          className={cn(
                            "font-black text-base transition-all duration-300 tracking-tight",
                            isOpen
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300",
                          )}
                        >
                          {feature.title}
                        </h3>
                      </div>
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
                          isOpen
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 rotate-180"
                            : "bg-gray-100 dark:bg-white/10 text-gray-400",
                        )}
                      >
                        {isOpen ? (
                          <Minus className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "grid transition-all duration-300 px-4 ml-12",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 pb-4"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed font-medium pr-4">
                          {feature.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
