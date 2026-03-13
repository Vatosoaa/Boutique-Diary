"use client";

import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Truck,
    title: "Livraison Rapide",
    description:
      "Recevez vos vêtements en quelques jours seulement avec notre livraison rapide et fiable.",
  },
  {
    icon: RotateCcw,
    title: "Retours Faciles",
    description:
      "Essayez chez vous et retournez gratuitement si l'article ne vous convient pas.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement Sécurisé",
    description:
      "Toutes vos transactions sont protégées avec un système de paiement sécurisé.",
  },
  {
    icon: Sparkles,
    title: "Produits de Qualité",
    description:
      "Nous sélectionnons des vêtements de qualité pour un style unique et durable.",
  },
];

export default function StoreFeaturesBar() {
  return (
    <div className="w-full bg-white border-b border-gray-100 pt-12 pb-10 px-4 md:px-6">
      {/* Inject CSS using theme variables for secondary + accent hover */}
      <style>{`
        .feat-icon-box {
          background-color: color-mix(in srgb, var(--store-secondary, #d4b8a5) 20%, white);
          border: 1px solid color-mix(in srgb, var(--store-secondary, #d4b8a5) 35%, transparent);
          color: var(--store-secondary, #d4b8a5);
          transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .feat-card:hover .feat-icon-box {
          background-color: var(--store-accent, #c45a4a);
          border-color: var(--store-accent, #c45a4a);
          color: #ffffff;
          box-shadow: 0 8px 20px color-mix(in srgb, var(--store-accent, #c45a4a) 30%, transparent);
        }
        .feat-icon {
          color: var(--store-secondary, #d4b8a5);
          transition: color 0.3s;
        }
        .feat-card:hover .feat-icon {
          color: #ffffff;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-12 max-w-[1400px] mx-auto">
        <p
          className="text-[11px] font-extrabold uppercase tracking-[4px] mb-3"
          style={{ color: "var(--store-secondary, #d4b8a5)" }}
        >
          Notre promesse
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Nos Engagements
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div
            className="h-px w-16"
            style={{
              background:
                "linear-gradient(to right, transparent, color-mix(in srgb, var(--store-secondary, #d4b8a5) 50%, transparent))",
            }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--store-secondary, #d4b8a5)" }}
          />
          <div
            className="h-px w-16"
            style={{
              background:
                "linear-gradient(to left, transparent, color-mix(in srgb, var(--store-secondary, #d4b8a5) 50%, transparent))",
            }}
          />
        </div>
        <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto">
          Votre satisfaction est notre priorité absolue, à chaque commande.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`feat-card flex flex-col items-center text-center px-4 cursor-default${
                index !== 0 ? " pt-8 sm:pt-0" : ""
              }`}
            >
              <div className="feat-icon-box w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <Icon className="feat-icon w-7 h-7" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-2.5">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[260px] font-medium">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
