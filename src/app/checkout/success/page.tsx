"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle, Mail, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutSuccessPage() {
  const { t } = useLanguage();
  const { clearCart } = useCart();
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@eventor.bg";

  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 mb-3">{t.success.title}</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">{t.success.subtitle}</p>

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <Mail className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">
                    {t.success.checkEmail}
                  </div>
                  <div className="text-xs text-gray-500">{t.success.checkEmailDesc}</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <Clock className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">
                    {t.success.ticketOnWay}
                  </div>
                  <div className="text-xs text-gray-500">{t.success.ticketOnWayDesc}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left">
              <p className="text-xs text-blue-700">
                <strong>{t.success.questions}</strong>{" "}
                <a href={`mailto:${supportEmail}`} className="underline hover:no-underline">
                  {supportEmail}
                </a>
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors"
            >
              {t.success.browseMore} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
