import React from "react";
import Link from "next/link";
import { Sparkles, Trophy, ShoppingBag, Tag } from "lucide-react";

interface MegaMenuProps {
  onClose: () => void;
}

const MegaMenu = ({ onClose }: MegaMenuProps) => {
  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
      <div className="max-w-[1400px] mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Top Vente Card */}
          <div className="w-full md:w-[300px] lg:w-[350px] shrink-0">
            <Link
              href="/shop?sort=best-selling"
              onClick={onClose}
              className="block group h-full"
            >
              <div className="bg-gray-50 rounded-2xl p-6 h-full flex flex-col items-center text-center transition-colors group-hover:bg-gray-100">
                <div className="relative w-48 h-48 mb-6 transition-transform duration-300 group-hover:scale-110">
                  <img
                    src="/assets/menu/cart-3d.png"
                    alt="Top Vente Panier"
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase mb-2 tracking-tight">
                  TOP VENTE
                </h3>
                <p className="text-gray-500 font-medium">
                  Découvers nos meilleures offres
                </p>
              </div>
            </Link>
          </div>

          {/* Right Column: Navigation Grid */}
          <div className="flex-1 flex flex-col justify-between py-2">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">
                Explorer
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/shop?sort=newest"
                  onClick={onClose}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group text-center"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Sparkles size={24} />
                  </div>
                  <span className="font-bold text-gray-900">Nouveautés</span>
                </Link>

                <Link
                  href="/shop?sort=best-selling"
                  onClick={onClose}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group text-center"
                >
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Trophy size={24} />
                  </div>
                  <span className="font-bold text-gray-900">Top Ventes</span>
                </Link>

                <Link
                  href="/shop"
                  onClick={onClose}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group text-center"
                >
                  <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <ShoppingBag size={24} />
                  </div>
                  <span className="font-bold text-gray-900">Boutique</span>
                </Link>

                <Link
                  href="/shop?promo=true"
                  onClick={onClose}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group text-center"
                >
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <Tag size={24} />
                  </div>
                  <span className="font-bold text-gray-900">Promos</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 px-4">
                <Link
                  href="/shop?category=Hommes"
                  onClick={onClose}
                  className="text-gray-600 hover:text-black font-medium transition-colors"
                >
                  Hommes
                </Link>
                <Link
                  href="/shop?category=Femmes"
                  onClick={onClose}
                  className="text-gray-600 hover:text-black font-medium transition-colors"
                >
                  Femmes
                </Link>
                <Link
                  href="/shop?category=Enfants"
                  onClick={onClose}
                  className="text-gray-600 hover:text-black font-medium transition-colors"
                >
                  Enfants
                </Link>
                <Link
                  href="/shop?category=Accessoires"
                  onClick={onClose}
                  className="text-gray-600 hover:text-black font-medium transition-colors"
                >
                  Accessoires
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
