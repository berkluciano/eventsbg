import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Контакти",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Контакти</h1>
          <p className="text-gray-500 mb-10">Свържете се с нас при въпроси относно поръчка или събитие.</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            <div className="flex items-center gap-4 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 flex-shrink-0">
                <Phone className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Телефон за връзка</p>
                <a
                  href="tel:+359000000000"
                  className="text-lg font-semibold text-gray-900 hover:text-brand transition-colors"
                >
                  +359 00 000 0000
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 flex-shrink-0">
                <Mail className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Имейл</p>
                <a
                  href="mailto:support@eventor.bg"
                  className="text-lg font-semibold text-gray-900 hover:text-brand transition-colors"
                >
                  support@eventor.bg
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
