import Image from "next/image";
import { Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatMoney, type OrderDetails } from "./order-view.types";
import React from "react";

/** Items List and Summary totals */
export function OrderItemsList({ order }: { order: OrderDetails }) {
  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
            Articles commandés ({order.items.length})
          </h3>
        </div>

        <div className="space-y-3">
          {order.items.map(item => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-3xl bg-background border border-border/30 hover:border-primary/20 hover:bg-secondary/5 transition-all duration-300 group shadow-sm"
            >
              <div className="h-20 w-20 rounded-2xl bg-white border border-border/40 overflow-hidden relative shrink-0 shadow-xs group-hover:scale-95 transition-transform">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {item.productName}
                </h4>
                {item.variant && (
                  <p className="text-[10px] font-bold text-muted-foreground/70 uppercase">
                    Modèle: {item.variant}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] font-black bg-secondary/40 px-2 py-0.5 rounded-lg border border-border/40 tabular-nums uppercase">
                    Qté: {item.quantity}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground/60 font-medium">
                    {formatMoney(item.price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center pr-2">
                <span className="font-black text-sm tabular-nums text-foreground">
                  {formatMoney(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Summary Card */}
      <div className="p-6 rounded-[32px] bg-primary text-primary-foreground shadow-xl shadow-primary/10 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mb-10 -mr-10" />

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center opacity-80">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Sous-total
            </span>
            <span className="font-mono text-sm font-bold">
              {formatMoney(order.total)}
            </span>
          </div>
          <div className="flex justify-between items-center opacity-80">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Frais de port
            </span>
            <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-white/20 rounded-full">
              Offerts
            </span>
          </div>

          <Separator className="bg-white/20" />

          <div className="flex justify-between items-center pt-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                Total Final
              </span>
              <span className="text-[10px] font-medium opacity-60 lowercase">
                Toutes taxes comprises
              </span>
            </div>
            <span className="text-3xl font-black tabular-nums tracking-tighter">
              {formatMoney(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
