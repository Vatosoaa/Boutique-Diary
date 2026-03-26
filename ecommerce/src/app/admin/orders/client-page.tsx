"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { OrdersStats } from "@/components/admin/orders/OrdersStats";
import { OrderList, Order } from "@/components/admin/orders/OrderList";
import {
  OrderFloatingPanel,
  OrderDetails,
} from "@/components/admin/orders/OrderViewModal";
import { InvoiceGeneratorService } from "@/utils/pdf-invoice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/admin/PageHeader";

interface OrdersResponse {
  orders: Array<{
    id: string;
    reference: string;
    customer: { name: string; email: string; avatar?: string };
    status:
      | "PENDING"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
      | "COMPLETED";
    total: number;
    createdAt: string;
  }>;
  counts: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    today: number;
  };
  metrics?: {
    total: { value: number; trend: number; sparkline: number[] };
    completed: { value: number; trend: number; sparkline: number[] };
    pending: { value: number; trend: number; sparkline: number[] };
    cancelled: { value: number; trend: number; sparkline: number[] };
  };
}

export default function OrdersClientPage({
  initialOrderId,
}: {
  initialOrderId?: string;
}) {
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR<OrdersResponse>("/api/admin/orders?limit=200", fetcher, {
    revalidateOnFocus: true,
  });

  const orders = React.useMemo<Order[]>(() => {
    if (!response?.orders) return [];
    return response.orders.map(order => ({
      id: order.id,
      reference: order.reference,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        avatar: order.customer.avatar,
      },
      status: order.status,
      total: order.total,
      createdAt: new Date(order.createdAt),
    }));
  }, [response?.orders]);

  const counts = React.useMemo(() => {
    if (!response?.counts)
      return { total: 0, completed: 0, pending: 0, cancelled: 0 };
    return response.counts;
  }, [response?.counts]);

  const params = useParams();
  const router = useRouter();
  const urlId = params?.id as string | undefined;
  const lastTargetId = useRef<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<
    Order | OrderDetails | null
  >(null);

  useEffect(() => {
    // SSE Setup - No need to call manually fetchOrders, SWR did it natively
    const eventSource = new EventSource("/api/notifications/stream?role=admin");

    eventSource.onmessage = event => {
      try {
        if (event.data.startsWith("{")) {
          const data = JSON.parse(event.data);
          if (
            data.type === "ORDER" ||
            data.type === "ORDER_UPDATE" ||
            data.type === "TRANSACTION_BULK_UPDATE"
          ) {
            mutate();
          }
        }
      } catch {
        // Ignore heartbeat
      }
    };

    return () => {
      eventSource.close();
    };
  }, [mutate]);

  const handleViewDetails = useCallback(
    async (order: Order | OrderDetails) => {
      // If it's already an OrderDetails and has items, just open it
      if ("items" in order && order.items && order.items.length > 0) {
        setSelectedOrder(order as OrderDetails);
        setIsModalOpen(true);
        router.push(`/admin/orders/${order.id}`, { scroll: false });
        return;
      }

      // Otherwise, fetch full details
      setIsModalOpen(true);
      setSelectedOrder(null); // Triggers loading state in Modal

      try {
        // Still open modal with placeholder data to show loading state if needed
        // (Actually, better wait for fetch to avoid UI jitter with empty basket)
        const res = await fetch(`/api/admin/orders/${order.id}`);
        if (!res.ok) throw new Error("Could not fetch order details");
        const orderData = await res.json();

        const orderDetails: OrderDetails = {
          ...orderData,
          createdAt: new Date(orderData.createdAt),
          items:
            orderData.items?.map(
              (item: {
                id: string;
                productName: string;
                productImage: string | null;
                quantity: number;
                price: number;
                color?: string;
                size?: string;
              }) => ({
                id: item.id,
                productName: item.productName,
                productImage: item.productImage,
                quantity: item.quantity,
                price: item.price,
                variant:
                  item.color || item.size
                    ? [item.color, item.size].filter(Boolean).join(", ")
                    : undefined,
              }),
            ) || [],
        };

        setSelectedOrder(orderDetails);
        setIsModalOpen(true);
        router.push(`/admin/orders/${order.id}`, { scroll: false });
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des détails");
      }
    },
    [router],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    router.push("/admin/orders", { scroll: false });
  }, [router]);

  useEffect(() => {
    // If we have an ID from URL (either from prop on mount or from URL change), open details
    const targetId = urlId || initialOrderId;
    if (targetId && lastTargetId.current !== targetId) {
      lastTargetId.current = targetId;
      handleViewDetails({ id: targetId } as Order);
    } else if (!targetId) {
      lastTargetId.current = null;
    }
  }, [urlId, initialOrderId, handleViewDetails]);

  const handleSendInvoice = async (order: Order | OrderDetails) => {
    try {
      toast.message(`Envoi de la facture #${order.reference}...`);

      const res = await fetch(`/api/admin/orders/${order.id}/send-invoice`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec de l'envoi");
      }

      toast.success(
        data.message || `Facture envoyée à ${order.customer.email}`,
      );
    } catch (error) {
      console.error("Failed to send invoice:", error);
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'envoi",
      );
    }
  };

  const handleRequestCancel = (order: Order | OrderDetails) => {
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    try {
      console.log("Cancelling order:", orderToCancel.id);

      const res = await fetch(`/api/admin/orders/${orderToCancel.id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("Cancel response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel order");
      }

      toast.success(`Commande #${orderToCancel.reference} annulée`);
      handleCloseModal();
      setCancelDialogOpen(false);
      setOrderToCancel(null);

      mutate();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'annulation",
      );
    }
  };

  const handleDownloadPDF = async (order: Order) => {
    try {
      toast.message(`Génération du PDF pour #${order.reference}...`);
      const res = await fetch(`/api/orders/${order.reference}/invoice`);
      if (res.ok) {
        const data = await res.json();
        await InvoiceGeneratorService.generate(data);
        toast.success("Facture téléchargée !");
      } else {
        toast.error("Impossible de récupérer les données de la facture");
      }
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commandes"
        description="Gérer les commandes de votre boutique"
        onRefresh={() => mutate()}
        isLoading={isLoading}
      />
      {/* Statistiques rapides */}
      <OrdersStats metrics={response?.metrics || null} loading={isLoading} />

      {}
      <OrderList
        orders={orders}
        loading={isLoading}
        counts={counts}
        onViewDetails={handleViewDetails}
        onSendInvoice={handleSendInvoice}
        onDownloadPDF={handleDownloadPDF}
        onDelete={handleRequestCancel}
      />

      {}
      <OrderFloatingPanel
        initialOrder={selectedOrder}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSendInvoice={handleSendInvoice}
      />

      {}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler cette commande ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler la commande{" "}
              <strong>#{orderToCancel?.reference}</strong> ?
              <br />
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, garder</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Oui, annuler la commande
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
