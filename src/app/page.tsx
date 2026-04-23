import Link from "next/link";
import { ArrowRight, ShieldCheck, Ticket, Mail, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

async function getFeaturedEvents() {
  return prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: "asc" },
    take: 6,
    include: {
      ticketTypes: {
        orderBy: { priceCents: "asc" },
        take: 1,
      },
    },
  });
}

export default async function HomePage() {
  const events = await getFeaturedEvents();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand via-brand-800 to-brand-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <Star className="w-4 h-4 text-yellow-300" />
                Trusted concierge ticket service
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                Get tickets to any event — <span className="text-blue-200">stress free</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Browse events, pay securely, and we handle the rest. We purchase your ticket from
                the official vendor and they deliver it straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Browse Events <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
                >
                  How It Works
                </a>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Events</h2>
                  <p className="text-gray-500 mt-1">Secure your spot before it sells out</p>
                </div>
                <Link
                  href="/events"
                  className="hidden sm:inline-flex items-center gap-1 text-brand font-medium hover:underline text-sm"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
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
                  View all events →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                How It Works
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                We do the heavy lifting so you can focus on enjoying the event.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Ticket,
                  step: "1",
                  title: "Choose Your Tickets",
                  description:
                    "Browse our events, select the ticket type and quantity you want, and enter your details.",
                },
                {
                  icon: ShieldCheck,
                  step: "2",
                  title: "Pay Securely",
                  description:
                    "Pay the ticket price + a small €5 per-ticket service fee via Stripe. Your payment is 100% secure.",
                },
                {
                  icon: Mail,
                  step: "3",
                  title: "Get Your Ticket",
                  description:
                    "We purchase your ticket from the official vendor using your details. The vendor emails it directly to you.",
                },
              ].map(({ icon: Icon, step, title, description }) => (
                <div
                  key={step}
                  className="relative text-center p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 mb-5">
                    <Icon className="w-7 h-7 text-brand" />
                  </div>
                  <div className="absolute top-4 right-4 text-5xl font-black text-gray-50">
                    {step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand py-16">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get your tickets?</h2>
            <p className="text-blue-100 mb-8">
              Browse our upcoming events and secure your spot today.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-white text-brand font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse Events <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
