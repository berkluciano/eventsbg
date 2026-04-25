import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WorkWithUsContent } from "@/components/WorkWithUsContent";

export const metadata: Metadata = {
  title: "Работете с нас | Eventor BG",
  description: "Организирате събитие? Свържете се с нас за билети, консиерж услуга и маркетинг.",
};

export default function WorkWithUsPage() {
  return (
    <>
      <Navbar />
      <WorkWithUsContent />
      <Footer />
    </>
  );
}
