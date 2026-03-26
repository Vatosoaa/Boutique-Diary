"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Gift,
  Tag,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Coins,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PaymentMethods, {
  type PaymentMethod,
} from "@/components/checkout/PaymentMethods";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomPromoForm } from "@/features/marketing/components/CustomPromoForm";
import type { PromoCode } from "@/features/marketing/types";

interface PromoShopItem {
  id: number;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minOrderAmount: number | null;
  expiresAt: string | null;
  purchasePrice?: number;
  moneyPrice?: number;
  description: string;
  status?: "PENDING" | "ACTIVE" | "EXPIRED";
}

export default function PromoCodesPage() {
  const [availableCodes, setAvailableCodes] = useState<PromoShopItem[]>([]);
  const [myCodes, setMyCodes] = useState<PromoShopItem[]>([]);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [renewingPromo, setRenewingPromo] = useState<PromoShopItem | null>(
    null,
  );

  // New: Payment for shop items with money
  const [payingWithMoney, setPayingWithMoney] = useState<PromoShopItem | null>(
    null,
  );

  // Payment Method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Mobile payment fields
  const [mvolaPhone, setMvolaPhone] = useState("");
  const [mvolaName, setMvolaName] = useState("");
  const [orangePhone, setOrangePhone] = useState("");
  const [orangeName, setOrangeName] = useState("");
  const [airtelPhone, setAirtelPhone] = useState("");
  const [airtelName, setAirtelName] = useState("");

  const fetchPromoCodes = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/promo-codes", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setPoints(data.points);
        setAvailableCodes(data.available);
        setMyCodes(data.owned);
      }
    } catch (error) {
      console.error("Failed to fetch promo codes:", error);
      toast.error("Erreur lors du chargement des codes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromoCodes();

    // SSE Setup
    const eventSource = new EventSource("/api/notifications/stream?role=user");
    eventSource.onmessage = event => {
      try {
        if (event.data.startsWith("{")) {
          const data = JSON.parse(event.data);
          if (
            data.type === "PROMO_UPDATE" ||
            data.type === "NEW_NOTIFICATION"
          ) {
            fetchPromoCodes();
          }
        }
      } catch {
        // Ignore heartbeat
      }
    };

    return () => eventSource.close();
  }, [fetchPromoCodes]);

  const handlePurchase = async (item: PromoShopItem) => {
    if (item.purchasePrice) {
      // Purchase with points
      if (points < item.purchasePrice) {
        toast.error("Points insuffisants");
        return;
      }
      setIsPurchasing(item.id);

      try {
        const res = await fetch("/api/customer/promo-codes/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            promoCodeId: item.id,
            paymentMethod: "POINTS",
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur d'achat");

        toast.success("Code promo acheté avec succès !");
        setPoints(data.newPoints);
        setMyCodes([data.promo, ...myCodes]);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Une erreur est survenue");
      } finally {
        setIsPurchasing(null);
      }
    } else {
      // Purchase with money
      setPayingWithMoney(item); // Open payment flow
    }
  };

  const handleMoneyPayment = async () => {
    if (!payingWithMoney || !paymentMethod) return;

    setIsProcessingPayment(true);
    try {
      let promoIdToPay = payingWithMoney.id;

      // 1. Initialize the purchase (if not already an owned PENDING promo)
      if (payingWithMoney.status !== "PENDING") {
        const initRes = await fetch("/api/customer/promo-codes/purchase/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: payingWithMoney.id }),
        });

        const initData = await initRes.json();
        if (!initRes.ok)
          throw new Error(initData.error || "Erreur d'initialisation");

        promoIdToPay = initData.promoId;
      }

      // 2. Process payment (simulated webhook call for success)
      const payRes = await fetch("/api/webhooks/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoId: promoIdToPay,
          status: "SUCCESS",
          provider: paymentMethod.toUpperCase(),
          metadata: {
            mvolaPhone,
            mvolaName,
            orangePhone,
            orangeName,
            airtelPhone,
            airtelName,
            amount: payingWithMoney.moneyPrice || 15000,
          },
        }),
      });

      if (!payRes.ok) throw new Error("Échec du paiement");

      toast.success("Code promo activé avec succès !");
      setPayingWithMoney(null);
      fetchPromoCodes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Code copié !");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Points */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Gift className="w-8 h-8 text-primary" />
            Mes Récompenses
          </h1>
          <p className="text-muted-foreground mt-2">
            Échangez vos points contre des réductions exclusives
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl flex items-center gap-3">
          <div className="bg-primary rounded-full p-2">
            <Coins className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Mon Solde
            </p>
            <p className="text-xl sm:text-2xl font-black text-primary">
              {points.toLocaleString()} pts
            </p>
          </div>
        </div>
      </div>

      {/* Personalized Promo Code Section */}
      <section className="bg-primary/5 rounded-3xl p-1 border border-primary/10">
        <CustomPromoForm renewPromo={renewingPromo as unknown as PromoCode} />
      </section>

      {/* My Codes Section */}
      {myCodes.length > 0 && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCodes.map((item: PromoShopItem) => (
              <div
                key={item.id}
                className="relative group bg-white border border-dashed border-gray-300 rounded-3xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 p-8 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Tag className="w-24 h-24 -rotate-12 text-indigo-600" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                          item.type === "PERCENTAGE"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-emerald-100 text-emerald-700",
                        )}
                      >
                        {item.type === "PERCENTAGE"
                          ? "Réduction %"
                          : "Réduction Fixe"}
                      </span>
                      {item.status === "PENDING" ? (
                        <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                          Paiement en attente
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                          Actif
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-black text-gray-900 tracking-tighter">
                        {item.type === "PERCENTAGE"
                          ? `-${item.value}%`
                          : `-${item.value.toLocaleString()} Ar`}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-500 mb-8 line-clamp-2 leading-relaxed">
                      {item.description ||
                        "Offre exclusive limitée. Profitez-en dès maintenant sur toute la boutique."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 group-hover:bg-white group-hover:border-indigo-200 transition-colors shadow-inner">
                      <div className="flex-1 font-mono font-black text-xl text-center tracking-[0.2em] text-indigo-600 border-r border-gray-300 border-dashed pr-2 uppercase">
                        {item.code}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.code)}
                        className={cn(
                          "shrink-0 h-10 w-10 rounded-xl transition-all",
                          copiedCode === item.code
                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            : "hover:bg-indigo-50 hover:text-indigo-600",
                        )}
                      >
                        {copiedCode === item.code ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                    </div>

                    {item.status === "PENDING" && (
                      <Button
                        variant="default"
                        className="w-full h-12 rounded-2xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                        onClick={() => setPayingWithMoney(item)}
                      >
                        <Coins className="w-4 h-4 mr-2" />
                        Payer maintenant
                      </Button>
                    )}
                    {item.status === "EXPIRED" && (
                      <Button
                        variant="default"
                        className="w-full h-12 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                        onClick={() => {
                          setRenewingPromo(item);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Renouveler
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shop Section */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Boutique Cadeaux
        </h2>
        {availableCodes.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">
              Aucune offre disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {availableCodes.map(item => {
              const canBuy = item.purchasePrice && points >= item.purchasePrice;
              return (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col"
                >
                  <div className="bg-linear-to-br from-primary/5 to-transparent p-5 md:p-6 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      {item.type === "PERCENTAGE" ? (
                        <Tag className="w-6 h-6 text-primary" />
                      ) : (
                        <Gift className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-1">
                      {item.type === "PERCENTAGE"
                        ? `-${item.value}%`
                        : `-${item.value.toLocaleString("fr-FR")} Ar`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.minOrderAmount && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Min. commande:{" "}
                        {item.minOrderAmount.toLocaleString("fr-FR")} Ar
                      </p>
                    )}
                  </div>
                  <div className="p-4 border-t border-border bg-card/50">
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 font-bold"
                        variant={canBuy ? "default" : "secondary"}
                        disabled={!canBuy || isPurchasing === item.id}
                        onClick={() => handlePurchase(item)}
                      >
                        {isPurchasing === item.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Coins className="w-4 h-4 mr-2" />
                        )}
                        {item.purchasePrice} pts
                      </Button>

                      {item.moneyPrice !== undefined && item.moneyPrice > 0 && (
                        <Button
                          className="flex-1 font-bold"
                          variant="outline"
                          onClick={() => setPayingWithMoney(item)}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          {item.moneyPrice.toLocaleString("fr-FR")} Ar
                        </Button>
                      )}
                    </div>
                    {!canBuy && (!item.moneyPrice || item.moneyPrice === 0) && (
                      <p className="text-center text-xs text-destructive mt-2 font-medium">
                        Points insuffisants
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Payment Selection Modal */}
      <Dialog
        open={!!payingWithMoney}
        onOpenChange={() => setPayingWithMoney(null)}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-card rounded-3xl border-none shadow-2xl">
          <div className="bg-primary/5 p-6 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-foreground flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-primary" />
                Acheter le code promo
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                Vous allez acheter le code{" "}
                <span className="font-bold text-foreground">
                  {payingWithMoney?.type === "PERCENTAGE"
                    ? `-${payingWithMoney?.value}%`
                    : `-${payingWithMoney?.value.toLocaleString()} Ar`}
                </span>{" "}
                pour{" "}
                <span className="font-black text-primary">
                  {payingWithMoney?.moneyPrice?.toLocaleString("fr-FR")} Ar
                </span>
                .
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            <PaymentMethods
              selected={paymentMethod}
              onChange={setPaymentMethod}
              mvolaPhone={mvolaPhone}
              onMvolaPhoneChange={setMvolaPhone}
              mvolaName={mvolaName}
              onMvolaNameChange={setMvolaName}
              orangePhone={orangePhone}
              onOrangePhoneChange={setOrangePhone}
              orangeName={orangeName}
              onOrangeNameChange={setOrangeName}
              airtelPhone={airtelPhone}
              onAirtelPhoneChange={setAirtelPhone}
              airtelName={airtelName}
              onAirtelNameChange={setAirtelName}
            />

            <div className="mt-8 flex flex-col gap-3">
              <Button
                className="w-full py-7 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                disabled={!paymentMethod || isProcessingPayment}
                onClick={handleMoneyPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>Confirmer le paiement</>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPayingWithMoney(null)}
                className="text-muted-foreground"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
