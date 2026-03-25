"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { toast } from "sonner";
import { Search, Star, Package, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/cart-store";

const reviewSchema = z.object({
  productId: z.string().min(1, "Veuillez choisir un produit"),
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(10, "Le commentaire doit faire au moins 10 caractères"),
});

type GlobalReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewFormContent({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const form = useForm<GlobalReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId: "",
      rating: 5,
      comment: "",
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products?limit=50");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(
      p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  async function onSubmit(values: GlobalReviewFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/products/${values.productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: values.rating,
            comment: values.comment,
          }),
        },
      );

      if (response.ok) {
        toast.success("Votre avis a été publié ! ✨");
        form.reset();
        setSelectedProduct(null);
        if (onSuccess) onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Une erreur est survenue");
      }
    } catch (err) {
      toast.error("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  }

  const ratingLabel = useMemo(() => {
    const r = form.watch("rating");
    if (r === 5) return "Exceptionnel ! 😍";
    if (r === 4) return "Très bien ! 😊";
    if (r === 3) return "Pas mal. 🙂";
    if (r === 2) return "Moyen... 😐";
    return "Déçu. 😞";
  }, [form.watch("rating")]);

  return (
    <div className="p-1">
      <div className="text-center mb-6">
        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-3 shadow-lg mx-auto">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
        </div>
        <h3 className="text-lg font-black tracking-tight text-gray-900 uppercase font-[family-name:var(--font-playfair)]">
          Votre avis compte
        </h3>
        <p className="text-gray-500 font-medium text-xs font-[family-name:var(--font-montserrat)]">
          Partagez votre expérience avec la communauté
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 font-[family-name:var(--font-montserrat)]">
                  Produit concerné
                </FormLabel>

                {!selectedProduct ? (
                  <div className="space-y-2">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-black transition-colors" />
                      <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-100 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-background transition-all font-medium text-xs font-[family-name:var(--font-montserrat)]"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="max-h-[140px] overflow-y-auto pr-2 custom-scrollbar space-y-1.5">
                      {filteredProducts.length === 0 ? (
                        <div className="py-6 text-center text-gray-400 text-xs italic font-[family-name:var(--font-montserrat)]">
                          Aucun produit trouvé
                        </div>
                      ) : (
                        filteredProducts.map(product => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedProduct(product);
                              field.onChange(product.id.toString());
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group text-left"
                          >
                            <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              {product.images?.[0]?.url ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform"
                                />
                              ) : (
                                <Package className="w-3.5 h-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 font-[family-name:var(--font-montserrat)]">
                              <h4 className="font-bold text-gray-900 text-xs truncate">
                                {product.name}
                              </h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                {product.category?.name || "Sans catégorie"}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-[10px] font-black text-gray-900">
                                {formatPrice(product.price)}
                              </div>
                              <ChevronRight className="w-3 h-3 text-gray-300 ml-auto group-hover:text-black group-hover:translate-x-1 transition-all" />
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-2.5 bg-gray-900 text-white rounded-[16px] shadow-lg group">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-background/10 flex-shrink-0">
                      {selectedProduct.images?.[0]?.url ? (
                        <Image
                          src={selectedProduct.images[0].url}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 font-[family-name:var(--font-montserrat)]">
                      <h4 className="font-bold text-xs truncate">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider">
                        {selectedProduct.category?.name ||
                          "Produit sélectionné"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(null);
                        field.onChange("");
                      }}
                      className="w-7 h-7 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center gap-2 pt-1 font-[family-name:var(--font-montserrat)]">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Note globale
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-1.5">
                    <StarRating
                      rating={field.value}
                      interactive
                      size="md"
                      onRatingChange={field.onChange}
                    />
                    <span className="text-xs font-black text-gray-900 transition-all animate-in fade-in slide-in-from-bottom-1">
                      {ratingLabel}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="space-y-2 font-[family-name:var(--font-montserrat)]">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Votre témoignage
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Qu'est-ce qui vous a plu ? Des points à améliorer ?"
                    className="min-h-[80px] rounded-[16px] bg-gray-50/50 border-gray-100 focus-visible:ring-black focus-visible:bg-background placeholder:text-gray-400 font-medium text-xs p-3.5 resize-none transition-all shadow-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2 pb-0 font-[family-name:var(--font-montserrat)]">
            <Button
              type="submit"
              disabled={isSubmitting || !selectedProduct}
              className="w-full bg-black text-white hover:bg-gray-800 rounded-[16px] py-6 font-black text-sm transition-all shadow-xl shadow-black/10 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 h-12"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publication...</span>
                </div>
              ) : (
                "Publier mon avis"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
