"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  ticketTypeId: string;
  eventId: string;
  eventName: string;
  eventSlug: string;
  ticketTypeName: string;
  priceCents: number;
  quantity: number;
  startsAt: string;
  venue: string;
  city: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty: number) => void;
  updateQty: (ticketTypeId: string, qty: number) => void;
  removeItem: (ticketTypeId: string) => void;
  clearCart: () => void;
  getQty: (ticketTypeId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eventor_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("eventor_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.ticketTypeId === item.ticketTypeId);
      if (existing) {
        return prev.map((i) =>
          i.ticketTypeId === item.ticketTypeId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const updateQty = useCallback((ticketTypeId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.ticketTypeId !== ticketTypeId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.ticketTypeId === ticketTypeId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const removeItem = useCallback((ticketTypeId: string) => {
    setItems((prev) => prev.filter((i) => i.ticketTypeId !== ticketTypeId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getQty = useCallback(
    (ticketTypeId: string) => items.find((i) => i.ticketTypeId === ticketTypeId)?.quantity ?? 0,
    [items]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, hydrated, addItem, updateQty, removeItem, clearCart, getQty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
