"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Phone,
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
    <footer className="relative bg-zinc-950 text-zinc-400 pt-24 pb-12 overflow-hidden border-t border-zinc-900 font-sans text-center lg:text-left">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-black text-white tracking-tighter mb-6 flex items-center">
                <span className="bg-white text-black px-2 py-0.5 rounded italic mr-2">
                  D
                </span>
                iary Boutique
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-sm">
                L'excellence du prêt-à-porter de luxe, sélectionnée avec passion
                pour définir votre allure quotidienne.
              </p>

              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 bg-zinc-900 rounded-full transition-colors ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div
              key={title}
              className="lg:col-span-2 flex flex-col items-center lg:items-start"
            >
              <h3 className="font-bold mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 decoration-primary/30">
                {title}
              </h3>
              <ul className="space-y-4 text-sm font-medium">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block hover:text-white hover:translate-x-1 transition-all duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Information */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            <h3 className="font-bold mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 decoration-primary/30">
              Contact
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href="mailto:contact@diaryboutique.com"
                  className="text-sm hover:text-white transition-colors"
                >
                  contact@diaryboutique.com
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-primary" />
                <a
                  href="tel:+261340000000"
                  className="text-sm hover:text-white transition-colors"
                >
                  +261 34 00 000 00
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold uppercase tracking-widest">
          <p className="text-zinc-600 text-center md:text-left">
            &copy; {currentYear}{" "}
            <span className="text-zinc-400">DIARY BOUTIQUE</span>. CONÇU AVEC
            PASSION.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              CGV & Mentions
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-3 text-[9px] font-bold grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {[
              { name: "MVOLA", color: "#fcd34d" },
              { name: "AIRTEL", color: "#ef4444" },
              { name: "ORANGE", color: "#f97316" },
              { name: "BANCAIRE", color: "#60a5fa" },
            ].map(payment => (
              <span
                key={payment.name}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: payment.color,
                    boxShadow: `0 0 8px ${payment.color}`,
                  }}
                />{" "}
                {payment.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
