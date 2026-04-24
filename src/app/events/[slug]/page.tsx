import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventDetailContent } from "@/components/EventDetailContent";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug, published: true },
    include: {
      ticketTypes: { orderBy: { priceCents: "asc" } },
      parent: { select: { id: true, name: true, slug: true } },
      subEvents: {
        where: { published: true },
        orderBy: { startsAt: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          startsAt: true,
          endsAt: true,
          city: true,
          venue: true,
          squareImage: true,
          ticketTypes: { select: { priceCents: true }, orderBy: { priceCents: "asc" }, take: 1 },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Събитие не е намерено" };
  return {
    title: event.name,
    description: `${event.name} в ${event.venue}, ${event.city} на ${formatDate(event.startsAt)}.`,
    openGraph: { images: event.squareImage ? [event.squareImage] : [] },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <>
      <Navbar />
      <EventDetailContent event={event} />
      <Footer />
    </>
  );
}
