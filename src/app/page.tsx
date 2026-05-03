import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomeContent } from "@/components/HomeContent";

async function getFeaturedEvents() {
  return prisma.event.findMany({
    where: { published: true, parentId: null, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 6,
    include: {
      ticketTypes: {
        orderBy: { priceCents: "asc" },
        select: { priceCents: true, capacity: true, sold: true },
      },
    },
  });
}

export default async function HomePage() {
  const events = await getFeaturedEvents();

  return (
    <>
      <Navbar />
      <HomeContent events={events} />
      <Footer />
    </>
  );
}
