import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "За нас | Eventor BG",
  description: "Eventor BG е платформа за билети, консиерж услуга и маркетинг на събития в България.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutContent />
      <Footer />
    </>
  );
}
