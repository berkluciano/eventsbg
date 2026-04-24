import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventsContent } from "@/components/EventsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Събития | Eventor BG",
  description: "Разгледайте всички предстоящи събития и купете билети чрез нашата услуга.",
};

async function getEvents(query?: string, city?: string) {
  return prisma.event.findMany({
    where: {
      published: true,
      parentId: null,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { venue: { contains: query, mode: "insensitive" } },
              { city: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(city && city !== "all" ? { city: { equals: city, mode: "insensitive" } } : {}),
    },
    orderBy: { startsAt: "asc" },
    include: {
      ticketTypes: { orderBy: { priceCents: "asc" }, take: 1 },
    },
  });
}

async function getCities() {
  const rows = await prisma.event.findMany({
    where: { published: true, parentId: null },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return rows.map((r) => r.city);
}

interface PageProps {
  searchParams: Promise<{ q?: string; city?: string }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const { q, city } = await searchParams;
  const [events, cities] = await Promise.all([getEvents(q, city), getCities()]);

  return (
    <>
      <Navbar />
      <EventsContent events={events} cities={cities} q={q} city={city} />
      <Footer />
    </>
  );
}
