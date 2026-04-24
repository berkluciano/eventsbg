import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createEvent } from "@/actions/events";
import { EventForm } from "@/components/admin/EventForm";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Event" };

export default async function NewEventPage() {
  const allEvents = await prisma.event.findMany({
    select: { id: true, name: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <EventForm action={createEvent} submitLabel="Create Event" allEvents={allEvents} />
      </div>
    </div>
  );
}
