"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Cart } from "@/lib/whatsapp";

type CartApi = {
  cart: Cart;
  setQty: (id: string, qty: number) => void;
  add: (id: string) => void;
  clear: () => void;
  total: number;
};

const CartCtx = createContext<CartApi | null>(null);
const MAX = 99;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const setQty = useCallback(
    (id: string, qty: number) => setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(MAX, qty)) })),
    [],
  );
  const add = useCallback((id: string) => setCart((c) => ({ ...c, [id]: Math.min(MAX, (c[id] ?? 0) + 1) })), []);
  const clear = useCallback(() => setCart({}), []);
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  const api = useMemo(() => ({ cart, setQty, add, clear, total }), [cart, setQty, add, clear, total]);
  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
