import Image from "next/image";
import { Mail, MapPin, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getPaymentLabel, type OrderDetails } from "./order-view.types";
import React from "react";

/** Reusable Info Row */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <span
        className="text-sm font-bold text-foreground truncate"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

/** Customer Card */
export function OrderCustomerCard({
  customer,
  paymentMethod,
}: {
  customer: OrderDetails["customer"];
  paymentMethod: string;
}) {
  return (
    <div className="p-5 rounded-3xl bg-background border border-border/30 space-y-4 shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70">
        Informations Client
      </h3>

      <div className="flex items-center gap-4 p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-primary/10 shadow-sm bg-background">
          {customer.avatar ? (
            <Image
              src={customer.avatar}
              alt={customer.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-base font-black">
              {customer.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-black text-foreground truncate">
            {customer.name}
          </span>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md w-fit mt-1">
            Client Fidèle
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <InfoRow icon={Mail} label="Email de contact" value={customer.email} />
        <Separator className="bg-border/20" />
        <InfoRow
          icon={MapPin}
          label="Adresse de livraison"
          value={customer.address || "Point relais boutique"}
        />
        <Separator className="bg-border/20" />
        <InfoRow
          icon={CreditCard}
          label="Méthode de paiement"
          value={getPaymentLabel(paymentMethod)}
        />
      </div>
    </div>
  );
}
