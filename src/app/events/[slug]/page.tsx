import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Clock, ArrowLeft, Ticket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatDate, formatDateTime, formatCents } from "@/lib/utils";
import { SERVICE_FEE_CENTS } from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug, published: true },
    include: {
      ticketTypes: { orderBy: { priceCents: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.name,
    description: `${event.name} at ${event.venue}, ${event.city} on ${formatDate(event.startsAt)}. Book your tickets through Events BG.`,
    openGraph: {
      images: event.squareImage ? [event.squareImage] : [],
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  const minPrice = event.ticketTypes[0]?.priceCents;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to events
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

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Event Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-4">{event.name}</h1>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateTime(event.startsAt)}
                      </div>
                      {event.endsAt && (
                        <div className="text-xs text-gray-500">
                          Ends: {formatDateTime(event.endsAt)}
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
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          From {formatCents(minPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          + {formatCents(SERVICE_FEE_CENTS)} service fee per ticket
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ticket Types */}
                {event.ticketTypes.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Available Tickets
                    </h3>
                    {event.ticketTypes.map((tt) => {
                      const available =
                        tt.capacity !== null ? tt.capacity - tt.sold : null;
                      const soldOut = available !== null && available <= 0;
                      return (
                        <div
                          key={tt.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            soldOut
                              ? "border-gray-200 bg-gray-50 opacity-60"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-900">{tt.name}</div>
                            {soldOut ? (
                              <div className="text-xs text-red-500">Sold out</div>
                            ) : available !== null && available <= 10 ? (
                              <div className="text-xs text-amber-600">{available} left</div>
                            ) : (
                              <div className="text-xs text-green-600">Available</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-brand">
                              {formatCents(tt.priceCents)}
                            </div>
                            <div className="text-xs text-gray-400">per ticket</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-6">No tickets available yet.</p>
                )}

                {event.ticketTypes.some(
                  (tt) => tt.capacity === null || tt.capacity - tt.sold > 0
                ) && (
                  <Link
                    href={`/checkout/${event.id}`}
                    className="block w-full bg-brand text-white text-center font-semibold py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-sm"
                  >
                    Get Tickets →
                  </Link>
                )}
              </div>

              {/* How it works mini */}
              <div className="bg-brand/5 border border-brand/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-brand mb-3">
                  How our concierge service works
                </h3>
                <ol className="space-y-2 text-xs text-gray-600">
                  <li className="flex gap-2">
                    <span className="font-bold text-brand">1.</span>
                    You pay the ticket price + €5 service fee per ticket
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-brand">2.</span>
                    We purchase your ticket from the official vendor
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-brand">3.</span>
                    The vendor sends your ticket directly to your email
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
