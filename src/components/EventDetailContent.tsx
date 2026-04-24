"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowLeft, Ticket, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDateTime, formatCents } from "@/lib/utils";

interface TicketType {
  id: string;
  name: string;
  priceCents: number;
  capacity: number | null;
  sold: number;
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
  };
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const { t, locale } = useLanguage();
  const minPrice = event.ticketTypes[0]?.priceCents;

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {t.event.backToEvents}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 max-w-lg">
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

            {/* Mobile buy button */}
            {event.ticketTypes.some((tt) => tt.capacity === null || tt.capacity - tt.sold > 0) && (
              <Link
                href={`/checkout/${event.id}`}
                className="lg:hidden block w-full bg-brand text-white text-center font-semibold py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-sm"
              >
                {t.event.getTickets}
              </Link>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.event.aboutEvent}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
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

              {/* Ticket Types */}
              {event.ticketTypes.length > 0 ? (
                <div className="space-y-3 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {t.event.availableTickets}
                  </h3>
                  {event.ticketTypes.map((tt) => {
                    const available = tt.capacity !== null ? tt.capacity - tt.sold : null;
                    const soldOut = available !== null && available <= 0;
                    return (
                      <div
                        key={tt.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          soldOut ? "border-gray-200 bg-gray-50 opacity-60" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tt.name}</div>
                          {soldOut ? (
                            <div className="text-xs text-red-500">{t.event.soldOut}</div>
                          ) : available !== null && available <= 10 ? (
                            <div className="text-xs text-amber-600">{t.event.left(available)}</div>
                          ) : (
                            <div className="text-xs text-green-600">{t.event.available}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-brand">
                            {formatCents(tt.priceCents)}
                          </div>
                          <div className="text-xs text-gray-400">{t.event.perTicket}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-6">{t.event.noTickets}</p>
              )}

              {event.ticketTypes.some(
                (tt) => tt.capacity === null || tt.capacity - tt.sold > 0
              ) && (
                <Link
                  href={`/checkout/${event.id}`}
                  className="block w-full bg-brand text-white text-center font-semibold py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-sm"
                >
                  {t.event.getTickets}
                </Link>
              )}

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : `https://eventsbg.com/events/${event.slug}`)}`}
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
