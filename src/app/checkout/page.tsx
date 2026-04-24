import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartCheckoutContent } from "@/components/CartCheckoutContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Количка | Eventor BG" };

export default function CartPage() {
  return (
    <>
      <Navbar />
      <CartCheckoutContent />
      <Footer />
    </>
  );
}
