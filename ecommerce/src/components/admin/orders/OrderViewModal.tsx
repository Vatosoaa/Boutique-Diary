"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X, Calendar, Mail } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { type OrderDetails } from "./order-view.types";
export { type OrderDetails } from "./order-view.types";
import { OrderStatusCard } from "./OrderStatusCard";
import { OrderCustomerCard } from "./OrderCustomerCard";
import { OrderItemsList } from "./OrderItemsList";

export function OrderFloatingPanel({
  open,
  onClose,
  initialOrder,
  onSendInvoice,
}: {
  open: boolean;
  onClose: () => void;
  initialOrder: OrderDetails | null;
  onSendInvoice?: (order: OrderDetails) => void;
}) {
  const [order, setOrder] = useState<OrderDetails | null>(initialOrder);

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      setOrder({ ...order, status: newStatus as OrderDetails["status"] });
      toast.success("Statut mis à jour avec succès");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      console.error("[OrderUpdateError]", error);
      toast.error(message || "Impossible de mettre à jour le statut");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-h-[90vh] p-0 flex flex-col overflow-hidden sm:rounded-[32px] border border-border/40 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl",
          order ? "max-w-4xl" : "max-w-md",
        )}
      >
        {!order ? (
          <>
            <DialogTitle className="sr-only">
              Chargement de la commande
            </DialogTitle>
            <div className="flex items-center justify-center p-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                  Chargement...
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogTitle className="sr-only">
              Détails de la commande #{order.reference}
            </DialogTitle>

            {/* Header */}
            <div className="relative overflow-hidden shrink-0 border-b border-border/40 bg-secondary/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10" />

              <div className="flex items-center justify-between p-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Badge
                      variant="outline"
                      className="bg-background/50 border-primary/20 text-primary font-mono text-[10px] uppercase tracking-tighter"
                    >
                      Transaction
                    </Badge>
                    <h2 className="text-xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-2">
                      Détails Commande
                      <span className="text-muted-foreground/40 font-mono text-sm not-italic font-medium">
                        #{order.reference}
                      </span>
                    </h2>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    Passée le{" "}
                    {format(
                      new Date(order.createdAt),
                      "dd MMM yyyy 'à' HH:mm",
                      {
                        locale: fr,
                      },
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-10 w-10 rounded-full bg-background/50 border border-border/50 hover:bg-background shadow-sm transition-all active:scale-90"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Summary & Customer */}
                  <div className="lg:col-span-5 space-y-6">
                    <OrderStatusCard
                      order={order}
                      onStatusChange={handleStatusChange}
                    />

                    <OrderCustomerCard
                      customer={order.customer}
                      paymentMethod={order.paymentMethod}
                    />
                  </div>

                  {/* Right Column: Order Items */}
                  <OrderItemsList order={order} />
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 sm:p-6 bg-transparent flex items-center justify-end shrink-0 print:hidden">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="font-bold text-xs hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fermer
                </Button>

                {order && onSendInvoice && (
                  <Button
                    className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                    onClick={() => onSendInvoice(order)}
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer la facture
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
