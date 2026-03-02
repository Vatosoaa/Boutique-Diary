import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ProductsImageBanner() {
  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden mb-8 group shadow-2xl">
      {/* Image */}
      <div className="relative w-full h-[260px] md:h-[360px] lg:h-[420px]">
        <Image
          src="/images/banner.jpg"
          alt="Women's Collection Banner"
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1400px"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Badge top-left */}
      <div className="absolute top-5 left-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.25em]">
          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
          Nouvelle Collection
        </div>
      </div>

      {/* CTA bottom-left */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-3">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
          Printemps — Été 2026
        </p>
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-black text-sm uppercase tracking-wider shadow-xl hover:bg-white/90 hover:gap-3 transition-all duration-300 w-fit"
        >
          Découvrir
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
