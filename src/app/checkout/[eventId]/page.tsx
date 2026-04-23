import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/CheckoutForm";
import { formatDateTime, formatCents } from "@/lib/utils";
import { SERVICE_FEE_CENTS } from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id, published: true },
    include: {
      ticketTypes: {
        orderBy: { priceCents: "asc" },
      },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) return { title: "Checkout" };
  return { title: `Checkout – ${event.name}` };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) notFound();

  const availableTicketTypes = event.ticketTypes.filter(
    (tt) => tt.capacity === null || tt.capacity - tt.sold > 0
  );

  if (availableTicketTypes.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 bg-gray-50">
          <div className="text-center">
            <div className="text-5xl mb-4">😔</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sold Out</h1>
            <p className="text-gray-500 mb-6">
              All tickets for this event have been sold.
            </p>
            <Link href="/events" className="text-brand font-medium hover:underline">
              Browse other events
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to event
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Order</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <CheckoutForm eventId={event.id} ticketTypes={availableTicketTypes} />
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">Event Details</h2>

                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                  {event.squareImage ? (
                    <Image src={event.squareImage} alt={event.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🎫
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 mb-3">{event.name}</h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-brand flex-shrink-0" />
                    {formatDateTime(event.startsAt)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
                    {event.venue}, {event.city}
                  </div>
                </div>
              </div>

              {/* Service info */}
              <div className="bg-brand/5 border border-brand/20 rounded-2xl p-5">
                <div className="flex items-start gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <h3 className="text-sm font-semibold text-brand">Concierge Service</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  A service fee of <strong>{formatCents(SERVICE_FEE_CENTS)}</strong> per ticket
                  covers our cost to manually purchase your ticket from the official vendor. Your
                  ticket will arrive directly from the vendor to your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
