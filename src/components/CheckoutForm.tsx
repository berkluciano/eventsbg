"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, Info } from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout";
import { SubmitButton } from "@/components/SubmitButton";
import { formatCents } from "@/lib/utils";
import { SERVICE_FEE_CENTS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface TicketType {
  id: string;
  name: string;
  priceCents: number;
  capacity: number | null;
  sold: number;
}

interface CheckoutFormProps {
  eventId: string;
  ticketTypes: TicketType[];
}

type FormState = { error?: string };

async function checkoutAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await createCheckoutSession(formData);
  return result ?? {};
}

export function CheckoutForm({ eventId, ticketTypes }: CheckoutFormProps) {
  const { t } = useLanguage();
  const [selectedTypeId, setSelectedTypeId] = useState(ticketTypes[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [insurance, setInsurance] = useState(false);
  const [state, formAction] = useActionState(checkoutAction, {});

  const selectedType = ticketTypes.find((tt) => tt.id === selectedTypeId);
  const ticketSubtotal = (selectedType?.priceCents ?? 0) * qty;
  const serviceFeeTotal = SERVICE_FEE_CENTS * qty;
  const insuranceCost = insurance ? Math.round((selectedType?.priceCents ?? 0) * 0.05) * qty : 0;
  const total = ticketSubtotal + serviceFeeTotal + insuranceCost;

  const available =
    selectedType?.capacity !== null && selectedType?.capacity !== undefined
      ? selectedType.capacity - selectedType.sold
      : 10;
  const maxQty = Math.min(10, Math.max(1, available));

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="eventId" value={eventId} />

      {/* Ticket Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.checkout.ticketType}
        </label>
        <div className="space-y-2">
          {ticketTypes.map((tt) => {
            const avail = tt.capacity !== null ? tt.capacity - tt.sold : null;
            const soldOut = avail !== null && avail <= 0;
            return (
              <label
                key={tt.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTypeId === tt.id
                    ? "border-brand bg-brand/5"
                    : soldOut
                    ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    : "border-gray-200 hover:border-brand/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="ticketTypeId"
                    value={tt.id}
                    checked={selectedTypeId === tt.id}
                    onChange={() => !soldOut && setSelectedTypeId(tt.id)}
                    disabled={soldOut}
                    className="text-brand"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{tt.name}</div>
                    {avail !== null && avail <= 10 && avail > 0 && (
                      <div className="text-xs text-amber-600">{t.checkout.onlyLeft(avail)}</div>
                    )}
                    {soldOut && (
                      <div className="text-xs text-red-500">{t.checkout.soldOut}</div>
                    )}
                  </div>
                </div>
                <div className="font-semibold text-brand">{formatCents(tt.priceCents)}</div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-2">
          {t.checkout.quantity}
        </label>
        <select
          id="qty"
          name="qty"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
        >
          {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n > 1 ? t.checkout.tickets : t.checkout.ticket}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Details */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">{t.checkout.yourDetails}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{t.checkout.yourDetailsDesc}</p>
        </div>
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            {t.checkout.fullName} <span className="text-red-500">*</span>
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            placeholder={t.checkout.fullNamePlaceholder}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
            {t.checkout.email} <span className="text-red-500">*</span>
          </label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            required
            placeholder={t.checkout.emailPlaceholder}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
            {t.checkout.phone} <span className="text-red-500">*</span>
          </label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            required
            placeholder="+359 88 123 4567"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="customerCity" className="block text-sm font-medium text-gray-700 mb-1">
              {t.checkout.city} <span className="text-red-500">*</span>
            </label>
            <input
              id="customerCity"
              name="customerCity"
              type="text"
              required
              placeholder={t.checkout.cityPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>
          <div>
            <label htmlFor="customerPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
              {t.checkout.postalCode} <span className="text-red-500">*</span>
            </label>
            <input
              id="customerPostalCode"
              name="customerPostalCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              placeholder={t.checkout.postalCodePlaceholder}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>
        </div>
        <div>
          <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
            {t.checkout.address} <span className="text-red-500">*</span>
          </label>
          <input
            id="customerAddress"
            name="customerAddress"
            type="text"
            required
            placeholder={t.checkout.addressPlaceholder}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
      </div>

      {/* Insurance */}
      <label
        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
          insurance ? "border-brand bg-brand/5" : "border-gray-200 hover:border-brand/40"
        }`}
      >
        <input
          type="checkbox"
          name="insurance"
          value="true"
          checked={insurance}
          onChange={(e) => setInsurance(e.target.checked)}
          className="mt-0.5 text-brand accent-brand"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-gray-900">{t.checkout.insuranceLabel}</span>
            <span className="text-sm font-semibold text-brand flex-shrink-0">
              {formatCents(Math.round((selectedType?.priceCents ?? 0) * 0.05) * qty)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{t.checkout.insuranceDesc}</p>
        </div>
      </label>

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">{t.checkout.priceSummary}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t.checkout.subtotal(selectedType?.name ?? "Ticket", qty)}
            </span>
            <span className="text-gray-900">{formatCents(ticketSubtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              {t.checkout.serviceFee(qty)}
              <span title="Per-ticket fee for our concierge purchasing service">
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </span>
            </span>
            <span className="text-gray-900">{formatCents(serviceFeeTotal)}</span>
          </div>
          {insurance && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.checkout.insuranceLabel}</span>
              <span className="text-gray-900">{formatCents(insuranceCost)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
            <span>{t.checkout.total}</span>
            <span className="text-brand text-lg">{formatCents(total)}</span>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <span>{t.checkout.securePayment}</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <CreditCard className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
          <span>{t.checkout.ticketDelivery}</span>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="termsAccepted"
          required
          className="mt-0.5 accent-brand"
        />
        <span className="text-sm text-gray-600">
          {t.checkout.termsAgree}{" "}
          <Link href="/terms" target="_blank" className="text-brand underline hover:no-underline">
            {t.checkout.termsLink}
          </Link>
        </span>
      </label>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      <SubmitButton
        className="w-full py-4 text-base"
        loadingText={t.checkout.payingBtn}
      >
        {t.checkout.payButton}
      </SubmitButton>

      <p className="text-xs text-center text-gray-400">
        {t.checkout.terms(formatCents(SERVICE_FEE_CENTS))}
      </p>
    </form>
  );
}
