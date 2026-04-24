"use client";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { MapPin, Calendar, ArrowLeft, Ticket, Share2, CalendarDays, Minus, Plus, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { formatDateTime, formatCents } from "@/lib/utils";

interface TicketType {
  id: string;
  name: string;
  priceCents: number;
  capacity: number | null;
  sold: number;
}

interface SubEvent {
  id: string;
  name: string;
  slug: string;
  startsAt: Date;
  endsAt: Date | null;
  city: string;
  venue: string;
  squareImage: string | null;
  ticketTypes: { priceCents: number }[];
}

interface EventDetailContentProps {
  event: {
    id: string;
    name: string;
    slug: string;
    description: string;
    city: string;
    venue: string;
    startsAt: Date;
    endsAt: Date | null;
    squareImage: string | null;
    ticketTypes: TicketType[];
    parent?: { id: string; name: string; slug: string } | null;
    subEvents?: SubEvent[];
  };
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const { t, locale } = useLanguage();
  const { getQty, addItem, updateQty, totalItems } = useCart();
  const minPrice = event.ticketTypes[0]?.priceCents;
  const isFestivalHub = (event.subEvents?.length ?? 0) > 0;

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {event.parent ? (
          <Link
            href={`/events/${event.parent.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> {event.parent.name}
          </Link>
        ) : (
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> {t.event.backToEvents}
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 w-full">
              {event.squareImage ? (
                <Image
                  src={event.squareImage}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5">
                  <Ticket className="w-20 h-20 text-brand/30" />
                </div>
              )}
            </div>

            {/* Mobile cart button — only for non-hub events when cart has items */}
            {!isFestivalHub && totalItems > 0 && (
              <Link
                href="/checkout"
                className="lg:hidden flex items-center justify-center gap-2 w-full bg-brand text-white text-center font-semibold py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {t.event.viewCart} ({totalItems})
              </Link>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.event.aboutEvent}</h2>
              <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none prose-strong:text-gray-900 prose-em:text-gray-700">
                <ReactMarkdown>{event.description}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-4">{event.name}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateTime(event.startsAt, locale)}
                    </div>
                    {event.endsAt && (
                      <div className="text-xs text-gray-500">
                        {t.event.ends} {formatDateTime(event.endsAt, locale)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{event.venue}</div>
                    <div className="text-xs text-gray-500">{event.city}</div>
                  </div>
                </div>
                {minPrice && (
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                    <div className="text-sm font-medium text-gray-900">
                      {t.events.from} {formatCents(minPrice)}
                    </div>
                  </div>
                )}
              </div>

              {/* Festival days OR ticket types */}
              {isFestivalHub ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" /> {t.event.festivalDays}
                  </h3>
                  {event.subEvents!.map((sub) => {
                    const fromPrice = sub.ticketTypes[0]?.priceCents;
                    return (
                      <Link
                        key={sub.id}
                        href={`/events/${sub.slug}`}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:border-brand/50 hover:bg-brand/5 transition-colors group"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors">{sub.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{formatDateTime(sub.startsAt, locale)}</div>
                          {fromPrice && (
                            <div className="text-xs text-brand font-medium mt-0.5">{t.events.from} {formatCents(fromPrice)}</div>
                          )}
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-brand rotate-180 flex-shrink-0 ml-3 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <>
                  {event.ticketTypes.length > 0 ? (
                    <div className="space-y-3 mb-5">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {t.event.availableTickets}
                      </h3>
                      {event.ticketTypes.map((tt) => {
                        const available = tt.capacity !== null ? tt.capacity - tt.sold : null;
                        const soldOut = available !== null && available <= 0;
                        const qty = getQty(tt.id);
                        const maxQty = available !== null ? Math.min(available, 10) : 10;
                        return (
                          <div
                            key={tt.id}
                            className={`p-3 rounded-lg border transition-colors ${
                              soldOut
                                ? "border-gray-200 bg-gray-50 opacity-60"
                                : qty > 0
                                ? "border-brand/40 bg-brand/5"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900">{tt.name}</div>
                                {soldOut ? (
                                  <div className="text-xs text-red-500">{t.event.soldOut}</div>
                                ) : available !== null && available <= 10 ? (
                                  <div className="text-xs text-amber-600">{t.event.left(available)}</div>
                                ) : (
                                  <div className="text-xs text-green-600">{t.event.available}</div>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-sm font-bold text-brand">{formatCents(tt.priceCents)}</div>
                                <div className="text-xs text-gray-400">{t.event.perTicket}</div>
                              </div>
                            </div>
                            {!soldOut && (
                              <div className="flex items-center gap-2 mt-2.5">
                                <button
                                  type="button"
                                  onClick={() => updateQty(tt.id, qty - 1)}
                                  disabled={qty === 0}
                                  className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold text-gray-900">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (qty === 0) {
                                      addItem({
                                        ticketTypeId: tt.id,
                                        eventId: event.id,
                                        eventName: event.name,
                                        eventSlug: event.slug,
                                        ticketTypeName: tt.name,
                                        priceCents: tt.priceCents,
                                        startsAt: event.startsAt.toISOString(),
                                        venue: event.venue,
                                        city: event.city,
                                      }, 1);
                                    } else {
                                      updateQty(tt.id, qty + 1);
                                    }
                                  }}
                                  disabled={qty >= maxQty}
                                  className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                {qty > 0 && (
                                  <span className="text-xs text-brand font-medium ml-1">
                                    {formatCents(tt.priceCents * qty)} {t.event.total}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-6">{t.event.noTickets}</p>
                  )}

                  {totalItems > 0 && (
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2 w-full bg-brand text-white text-center font-semibold py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t.event.viewCart} ({totalItems})
                    </Link>
                  )}
                </>
              )}

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : `https://eventor.bg/events/${event.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm mt-3"
              >
                <Share2 className="w-4 h-4" />
                {t.event.shareOnFacebook}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
