import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface MegaMenuProps {
  onClose: () => void;
}

const categories = [
  {
    name: "Femmes",
    href: "/shop?category=Femmes",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    colSpan: "col-span-2",
  },
  {
    name: "Hommes",
    href: "/shop?category=Hommes",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop",
    colSpan: "col-span-1",
  },
  {
    name: "Enfants",
    href: "/shop?category=Enfants",
    image: "/images/enfant2.jpg",
    colSpan: "col-span-1",
  },
  {
    name: "Accessoires",
    href: "/shop?category=Accessoires",
    image: "/images/accessoir.jpg",
    colSpan: "col-span-2",
  },
  {
    name: "Nouveautés",
    href: "/shop?sort=newest",
    image: "/images/collection.jpg",
    colSpan: "col-span-2",
  },
];

const MegaMenu = ({ onClose }: MegaMenuProps) => {
  return (
    <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
      <div className="max-w-7xl mx-auto p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left Column: Categories Grid */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground tracking-tight">
                Découvrir la Boutique
              </h3>
              <Link
                href="/produits"
                onClick={onClose}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
              >
                Tout voir <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 min-h-[400px]">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={onClose}
                  className={`group relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                    category.colSpan === "col-span-2" ? "col-span-2 md:col-span-2" : "col-span-1 md:col-span-1"
                  } h-48 md:h-auto`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={category.name === "Femmes"}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white text-xl md:text-2xl font-black mb-1">
                      {category.name}
                    </h4>
                    <span className="text-white/80 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                      Explorer <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Promo / Bestseller */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-lg font-black text-foreground tracking-tight mb-6">
              À ne pas manquer
            </h3>
            <Link
              href="/shop?sort=best-selling"
              onClick={onClose}
              className="block group h-[400px] relative rounded-2xl overflow-hidden bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10"
            >
              <div className="absolute inset-0 p-8 flex flex-col items-center text-center z-10">
                <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                  Top Vente
                </span>
                <div className="relative w-40 h-40 mb-auto transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src="/assets/menu/cart-3d.png"
                    alt="Best sellers"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <h4 className="text-2xl font-black text-foreground tracking-tight mb-2">
                  Nos Essentiels
                </h4>
                <p className="text-muted-foreground text-sm font-medium">
                  Les pièces préférées de nos clients cette saison.
                </p>
                
                <div className="mt-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
