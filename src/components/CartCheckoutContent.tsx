"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { formatCents, formatDateTime } from "@/lib/utils";
import { createCheckoutSession } from "@/actions/checkout";
import { SERVICE_FEE_CENTS } from "@/lib/constants";

export function CartCheckoutContent() {
  const { t } = useLanguage();
  const { items, totalItems, updateQty, removeItem, clearCart } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [insurance, setInsurance] = useState(false);

  const ticketSubtotal = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
  const totalServiceFee = items.reduce((s, i) => s + SERVICE_FEE_CENTS * i.quantity, 0);
  const insuranceCost = insurance ? Math.round(ticketSubtotal * 0.05) : 0;
  const grandTotal = ticketSubtotal + totalServiceFee + insuranceCost;

  if (!totalItems) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingCart className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.checkout.cartEmpty}</h1>
          <p className="text-gray-500 mb-6">{t.checkout.cartEmptyDesc}</p>
          <Link href="/events" className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors">
            {t.footer.browseEvents}
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("items", JSON.stringify(items.map((i) => ({ ticketTypeId: i.ticketTypeId, qty: i.quantity }))));
    formData.set("insurance", insurance ? "true" : "false");

    startTransition(async () => {
      const result = await createCheckoutSession(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t.checkout.title}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left column */}
            <div className="lg:col-span-3 space-y-6">
              {/* Cart items */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">{t.checkout.cartTitle}</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.ticketTypeId} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900">{item.eventName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.ticketTypeName}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(new Date(item.startsAt))} · {item.venue}, {item.city}
                        </div>
                        <div className="text-sm font-bold text-brand mt-1">{formatCents(item.priceCents)} {t.event.perTicket}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQty(item.ticketTypeId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.ticketTypeId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.ticketTypeId)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-4 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  {t.events.clear}
                </button>
              </div>

              {/* Customer details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-1">{t.checkout.yourDetails}</h2>
                <p className="text-sm text-gray-500 mb-5">{t.checkout.yourDetailsDesc}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.fullName} <span className="text-red-500">*</span></label>
                    <input name="customerName" required placeholder={t.checkout.fullNamePlaceholder} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.email} <span className="text-red-500">*</span></label>
                    <input name="customerEmail" type="email" required placeholder={t.checkout.emailPlaceholder} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.phone} <span className="text-red-500">*</span></label>
                    <input name="customerPhone" type="tel" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.city} <span className="text-red-500">*</span></label>
                      <input name="customerCity" required placeholder={t.checkout.cityPlaceholder} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.postalCode} <span className="text-red-500">*</span></label>
                      <input name="customerPostalCode" required placeholder={t.checkout.postalCodePlaceholder} inputMode="numeric" pattern="[0-9]*" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.address} <span className="text-red-500">*</span></label>
                    <input name="customerAddress" required placeholder={t.checkout.addressPlaceholder} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                  </div>
                </div>

                {/* Insurance */}
                <div
                  onClick={() => setInsurance(!insurance)}
                  className={`mt-5 flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${insurance ? "border-brand/40 bg-brand/5" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
                >
                  <input type="checkbox" checked={insurance} onChange={() => {}} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.checkout.insuranceLabel}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {t.checkout.insuranceDesc} {insurance && `(${formatCents(insuranceCost)})`}
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 mt-4 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                  <span className="text-sm text-gray-600">
                    {t.checkout.termsAgree}{" "}
                    <Link href="/terms" target="_blank" className="text-brand hover:underline font-medium">{t.checkout.termsLink}</Link>
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
              )}
            </div>

            {/* Right column — price summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="font-semibold text-gray-900 mb-4">{t.checkout.priceSummary}</h2>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.ticketTypeId} className="flex justify-between text-gray-600">
                      <span className="truncate mr-2">{item.ticketTypeName} × {item.quantity}</span>
                      <span className="flex-shrink-0">{formatCents(item.priceCents * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-gray-600">
                    <span>{t.checkout.serviceFee(totalItems)}</span>
                    <span>{formatCents(totalServiceFee)}</span>
                  </div>
                  {insurance && (
                    <div className="flex justify-between text-gray-600">
                      <span>{t.checkout.insuranceLabel}</span>
                      <span>{formatCents(insuranceCost)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-gray-900">
                    <span>{t.checkout.total}</span>
                    <span>{formatCents(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="mt-5 w-full bg-brand text-white font-semibold py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pending ? t.checkout.payingBtn : t.checkout.payButton}
                </button>

                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Lock className="w-3 h-3" /> {t.checkout.securePayment}
                  </div>
                  <div className="text-xs text-gray-400">{t.checkout.ticketDelivery}</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
