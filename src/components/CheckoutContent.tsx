"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckoutForm } from "@/components/CheckoutForm";
import { formatDateTime } from "@/lib/utils";

interface TicketType {
  id: string;
  name: string;
  priceCents: number;
  capacity: number | null;
  sold: number;
}

interface CheckoutContentProps {
  event: {
    id: string;
    name: string;
    slug: string;
    venue: string;
    city: string;
    startsAt: Date;
    squareImage: string | null;
  };
  availableTicketTypes: TicketType[];
}

export function CheckoutContent({ event, availableTicketTypes }: CheckoutContentProps) {
  const { t, locale } = useLanguage();

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {t.checkout.backToEvent}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t.checkout.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <CheckoutForm eventId={event.id} ticketTypes={availableTicketTypes} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">{t.checkout.eventDetails}</h2>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                {event.squareImage ? (
                  <Image src={event.squareImage} alt={event.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🎫</div>
                )}
              </div>

              <h3 className="font-bold text-gray-900 mb-3">{event.name}</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-brand flex-shrink-0" />
                  {formatDateTime(event.startsAt, locale)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
                  {event.venue}, {event.city}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
