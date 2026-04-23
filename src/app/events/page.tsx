import { Suspense } from "react";
import { Search, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Events",
  description: "Browse all upcoming events and book your tickets through our concierge service.",
};

async function getEvents(query?: string, city?: string) {
  return prisma.event.findMany({
    where: {
      published: true,
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
      ticketTypes: {
        orderBy: { priceCents: "asc" },
        take: 1,
      },
    },
  });
}

async function getCities() {
  const events = await prisma.event.findMany({
    where: { published: true },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return events.map((e) => e.city);
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
      <main className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Events</h1>

            {/* Search & Filter */}
            <form method="GET" className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="q"
                  defaultValue={q}
                  type="text"
                  placeholder="Search events, venues..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand text-sm"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="city"
                  defaultValue={city ?? "all"}
                  className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand text-sm bg-white"
                >
                  <option value="all">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-brand text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-800 transition-colors"
              >
                Search
              </button>
              {(q || city) && (
                <a
                  href="/events"
                  className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors text-center"
                >
                  Clear
                </a>
              )}
            </form>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Suspense>
            {events.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🎫</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No events found</h2>
                <p className="text-gray-400 mb-6">Try adjusting your search or check back later.</p>
                <a href="/events" className="text-brand font-medium hover:underline">
                  View all events
                </a>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  {events.length} event{events.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
              </>
            )}
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
