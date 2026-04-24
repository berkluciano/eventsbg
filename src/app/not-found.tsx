"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-20">
        <div className="text-center">
          <div className="text-7xl font-black text-gray-100 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.notFound.title}</h1>
          <p className="text-gray-500 mb-8">{t.notFound.subtitle}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors"
          >
            {t.notFound.backHome}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
