"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EventCard } from "@/components/EventCard";
import HeroBackground from "@/components/HeroBackground";

interface Event {
  id: string;
  name: string;
  slug: string;
  city: string;
  venue: string;
  startsAt: Date;
  squareImage: string | null;
  ticketTypes: { priceCents: number }[];
}

export function HomeContent({ events }: { events: Event[] }) {
  const { t } = useLanguage();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-800 to-brand-700 text-white">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Star className="w-4 h-4 text-yellow-300" />
              {t.home.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {t.home.heroTitle}
              <br />
              <span className="text-blue-200">{t.home.heroTitleHighlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                {t.home.browseEvents} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t.home.upcomingEvents}
                </h2>
                <p className="text-gray-500 mt-1">{t.home.upcomingSubtitle}</p>
              </div>
              <Link
                href="/events"
                className="hidden sm:inline-flex items-center gap-1 text-brand font-medium hover:underline text-sm"
              >
                {t.home.viewAll} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  name={event.name}
                  slug={event.slug}
                  city={event.city}
                  venue={event.venue}
                  startsAt={event.startsAt}
                  squareImage={event.squareImage}
                  minPriceCents={event.ticketTypes[0]?.priceCents}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/events" className="text-brand font-medium hover:underline">
                {t.home.viewAll} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.home.ctaTitle}</h2>
          <p className="text-blue-100 mb-8">{t.home.ctaSubtitle}</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-white text-brand font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t.home.browseEvents} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
