import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutContent } from "@/components/CheckoutContent";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id, published: true },
    include: { ticketTypes: { orderBy: { priceCents: "asc" } } },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) return { title: "Плащане" };
  return { title: `Плащане – ${event.name}` };
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Разпродадено</h1>
            <p className="text-gray-500 mb-6">Всички билети за това събитие са разпродадени.</p>
            <Link href="/events" className="text-brand font-medium hover:underline">
              Виж другите събития
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
      <CheckoutContent
        event={event}
        availableTicketTypes={availableTicketTypes}
      />
      <Footer />
    </>
  );
}
