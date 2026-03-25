import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceGeneratorService, InvoiceData } from "@/utils/pdf-invoice";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG, type OrderDetails } from "./order-view.types";

/** Colored status badge. */
function StatusBadge({ status }: { status: string }) {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-sm",
        config.color,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="uppercase tracking-wider">{config.label}</span>
    </div>
  );
}

/** Status card with select + PDF download. */
export function OrderStatusCard({
  order,
  onStatusChange,
}: {
  order: OrderDetails;
  onStatusChange: (newStatus: string) => void;
}) {
  return (
    <div className="p-5 rounded-3xl bg-secondary/20 border border-border/40 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
          État de la commande
        </span>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-2 print:hidden">
        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">
          Modifier le statut
        </label>
        <Select value={order.status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-11 rounded-2xl bg-background/50 border-border/40 shadow-sm font-semibold text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/40 shadow-2xl">
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="PROCESSING">Traitement</SelectItem>
            <SelectItem value="SHIPPED">Expédié</SelectItem>
            <SelectItem value="DELIVERED">Livré</SelectItem>
            <SelectItem value="COMPLETED">Terminé</SelectItem>
            <SelectItem value="CANCELLED" className="text-rose-500">
              Annulé
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2 print:hidden">
        <Button
          variant="outline"
          className="w-full h-10 rounded-xl bg-background/50 border-border/40 hover:bg-background gap-2 text-xs font-bold"
          onClick={async () =>
            await InvoiceGeneratorService.generate(
              order as unknown as InvoiceData,
            )
          }
        >
          <Download className="w-3.5 h-3.5 text-primary" />
          Télécharger PDF existant
        </Button>
      </div>
    </div>
  );
}
