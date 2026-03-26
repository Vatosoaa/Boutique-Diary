"use client";

import { useState } from "react";
import { Loader2, Tag, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AppliedPromo {
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  discount: number;
}

interface PromoCodeInputProps {
  cartTotal: number;
  onPromoApplied: (promo: AppliedPromo | null) => void;
  appliedPromo: AppliedPromo | null;
}

export default function PromoCodeInput({
  cartTotal,
  onPromoApplied,
  appliedPromo,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Veuillez entrer un code promo");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), cartTotal }),
      });

      const data = await res.json();

      if (data.valid) {
        toast.success(data.message || "Code promo appliqué !");
        onPromoApplied({
          code: data.code,
          type: data.type,
          value: data.value,
          discount: data.discount,
        });
        setCode("");
      } else {
        toast.error(data.message || "Code promo invalide");
        onPromoApplied(null);
      }
    } catch (err) {
      console.error("Promo validation error:", err);
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onPromoApplied(null);
    toast.info("Code promo retiré");
  };

  // If promo is applied, show applied state
  if (appliedPromo) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">{appliedPromo.code}</p>
              <p className="text-xs text-muted-foreground">
                {appliedPromo.type === "PERCENTAGE"
                  ? `-${appliedPromo.value}%`
                  : `-${appliedPromo.value.toLocaleString("fr-FR")} Ar`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Code promo"
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-secondary/5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/5 text-foreground transition-all placeholder:text-muted-foreground/50 outline-none",
            )}
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Appliquer"
          )}
        </button>
      </div>
    </div>
  );
}
