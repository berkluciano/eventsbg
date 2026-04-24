"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CartIcon() {
  const { totalItems, hydrated } = useCart();

  return (
    <Link
      href="/checkout"
      className="relative p-2 text-blue-100 hover:text-white transition-colors"
      aria-label="Cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {hydrated && totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-brand text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
