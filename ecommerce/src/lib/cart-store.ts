"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  productId: number;
  productImageId?: number;
  name: string;
  reference: string;
  image: string;
  price: number;
  quantity: number;
  maxStock: number;
  color?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;

  getItemCount: () => number;
  getSubtotal: () => number;
}

const generateId = (item: Omit<CartItem, "id">) =>
  `${item.productId}-${item.color || "default"}-${item.size || "default"}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: item => {
        const id = generateId(item);
        const existingItem = get().items.find(i => i.id === id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + item.quantity,
            item.maxStock,
          );
          set({
            items: get().items.map(i =>
              i.id === id ? { ...i, quantity: newQuantity } : i,
            ),
          });
          toast.success(`Quantité de "${item.name}" mise à jour`);
        } else {
          set({
            items: [...get().items, { ...item, id }],
          });
          toast.success(`"${item.name}" ajouté au panier`);
        }

        set({ isOpen: true });
      },

      removeItem: id => {
        const item = get().items.find(i => i.id === id);
        set({
          items: get().items.filter(i => i.id !== id),
        });
        if (item) {
          toast.success(`"${item.name}" retiré du panier`);
        }
      },

      updateQuantity: (id, quantity) => {
        const item = get().items.find(i => i.id === id);
        if (!item) return;

        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const newQuantity = Math.min(quantity, item.maxStock);
        set({
          items: get().items.map(i =>
            i.id === id ? { ...i, quantity: newQuantity } : i,
          ),
        });

        if (quantity > item.maxStock) {
          toast.warning(`Stock maximum atteint (${item.maxStock})`);
        }
      },

      clearCart: () => {
        set({ items: [] });
        toast.success("Le panier a été vidé");
      },

      setOpen: open => {
        set({ isOpen: open });
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "boutique-diary-cart",
    },
  ),
);

// Re-export formatPrice from utils for backward compatibility
export { formatPrice } from "@/lib/utils";
