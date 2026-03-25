"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Send,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StoreFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Service Client": [
      { label: "FAQ", href: "#" },
      { label: "Mes Commandes", href: "/dashboard/customer/orders" },
      { label: "Mes Favoris", href: "/dashboard/customer/wishlist" },
      { label: "Mes Adresses", href: "/dashboard/customer/addresses" },
      { label: "Retours", href: "#" },
      { label: "Livraison", href: "#" },
    ],
    Produits: [
      { label: "Nouveautés", href: "/nouveautes" },
      { label: "Promotions", href: "/promotions" },
      { label: "Top Vente", href: "/top-vente" },
      { label: "Hommes", href: "/shop?category=hommes" },
      { label: "Femmes", href: "/shop?category=femmes" },
    ],
    "Notre Histoire": [
      { label: "À Propos", href: "/store/about" },
      { label: "Nos Magasins", href: "#" },
      { label: "Le Blog", href: "/blog" },
      { label: "Engagements", href: "#" },
      { label: "Carrières", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { icon: Youtube, href: "#", color: "hover:text-red-600" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
  ];

  return (
    <footer className="relative bg-zinc-950 text-zinc-400 pt-24 pb-12 overflow-hidden border-t border-zinc-900 font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-black text-white tracking-tighter mb-6 flex items-center">
                <span className="bg-white text-black px-2 py-0.5 rounded italic">
                  D
                </span>
                iary Boutique
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-sm">
                L'excellence du prêt-à-porter de luxe, sélectionnée avec passion
                pour définir votre allure quotidienne.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start justify-center lg:justify-start gap-3 group group-hover:cursor-default">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="text-white font-medium">Antananarivo</p>
                    <p className="text-zinc-500">
                      Ambohitrarahaba, c20bis Antsahamaina
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 group">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href="mailto:contact@diaryboutique.com"
                    className="text-sm hover:text-white transition-colors"
                  >
                    contact@diaryboutique.com
                  </a>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 group">
                  <Phone className="w-5 h-5 text-primary" />
                  <a
                    href="tel:+261340000000"
                    className="text-sm hover:text-white transition-colors"
                  >
                    +261 34 00 000 00
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links], idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center lg:items-start"
              >
                <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">
                  {title}
                </h3>
                <ul className="space-y-4 text-sm">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-all duration-300 inline-flex items-center group"
                      >
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-sm"
            >
              <h3 className="text-white font-bold text-lg mb-4">
                Rejoignez le Club
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Inscrivez-vous pour recevoir nos dernières collections et offres
                exclusives.
              </p>

              <div className="relative group">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
                />
                <button className="absolute right-2 top-2 bottom-2 aspect-square bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-primary/20">
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-zinc-950 border border-zinc-800 rounded-xl transition-all ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold uppercase tracking-widest">
          <p className="text-zinc-600">
            &copy; {currentYear}{" "}
            <span className="text-zinc-400">DIARY BOUTIQUE</span>. CONÇU AVEC
            PASSION.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-3 text-[9px] font-bold grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fcd34d] shadow-[0_0_8px_#fcd34d]" />{" "}
              MVOLA
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />{" "}
              AIRTEL
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]" />{" "}
              ORANGE
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />{" "}
              BANCAIRE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
