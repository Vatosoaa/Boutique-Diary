"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart-store";

/**
 * Composant invisible qui vide le panier lors du changement d'état de connexion.
 * Cela garantit qu'un utilisateur ne voit pas le panier d'un utilisateur précédent
 * ou un panier "invité" s'il vient de se connecter.
 */
export function CartAutoCleaner() {
  const { user, isLoading } = useUser();
  const clearCart = useCartStore(state => state.clearCart);

  // Utiliser une ref pour suivre l'ID de l'utilisateur précédent
  // afin de ne vider que lors d'un CHANGEMENT réel (connexion ou déconnexion)
  const prevUserRef = useRef<string | undefined | null>(undefined);

  useEffect(() => {
    if (isLoading) return;

    // Si l'état de l'utilisateur a changé (passé de connecté à déconnecté ou inversement)
    if (
      prevUserRef.current !== undefined &&
      prevUserRef.current !== user?.sub
    ) {
      console.log("[CartAutoCleaner] État auth changé, nettoyage du panier...");
      clearCart();
    }

    // Mettre à jour la ref avec l'utilisateur actuel
    prevUserRef.current = user?.sub || null;
  }, [user, isLoading, clearCart]);

  return null;
}
