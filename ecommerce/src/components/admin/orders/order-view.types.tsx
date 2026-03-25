import { CheckCircle, Clock, Truck, AlertCircle } from "lucide-react";
import React from "react";

/** Order detail data shape. */
export interface OrderDetails {
  id: string;
  reference: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "COMPLETED";
  total: number;
  createdAt: Date | string;
  paymentMethod: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    address: string | null;
  };
  items: Array<{
    id: string;
    productName: string;
    productImage: string | null;
    quantity: number;
    price: number;
    variant?: string;
  }>;
}

/** Custom SVG icon (lucide-react doesn't export RefreshCcw in all versions). */
function RefreshCcwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

/** Status configuration map. */
export const STATUS_CONFIG = {
  PENDING: {
    label: "En attente",
    icon: Clock,
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  PROCESSING: {
    label: "Traitement",
    icon: RefreshCcwIcon,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  SHIPPED: {
    label: "Expédié",
    icon: Truck,
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  DELIVERED: {
    label: "Livré",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  COMPLETED: {
    label: "Terminé",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  CANCELLED: {
    label: "Annulé",
    icon: AlertCircle,
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
} as const;

/** Payment method labels. */
export const getPaymentLabel = (method: string): string => {
  const labels: Record<string, string> = {
    MVOLA: "MVola Mobile Money",
    ORANGE_MONEY: "Orange Money",
    AIRTEL_MONEY: "Airtel Money",
    STRIPE: "Carte Bancaire / Stripe",
    COD: "Paiement à la livraison",
  };
  return labels[method] || method;
};

/** Format MGA currency. */
export const formatMoney = (amount: number): string =>
  new Intl.NumberFormat("fr-MG", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(amount);
