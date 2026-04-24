import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2, ExternalLink, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateEvent, deleteEvent, createTicketType, deleteTicketType } from "@/actions/events";
import { EventForm } from "@/components/admin/EventForm";
import { TicketTypeForm } from "@/components/admin/TicketTypeForm";
import { EditableTicketType } from "@/components/admin/EditableTicketType";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { formatCents } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: { orderBy: { priceCents: "asc" } },
      _count: { select: { orders: true } },
      subEvents: { select: { id: true, name: true, startsAt: true, published: true }, orderBy: { startsAt: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  return { title: event ? `Edit: ${event.name}` : "Edit Event" };
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const [event, allEvents] = await Promise.all([
    getEvent(id),
    prisma.event.findMany({ select: { id: true, name: true }, orderBy: { startsAt: "desc" } }),
  ]);

  if (!event) notFound();

  const updateEventWithId = updateEvent.bind(null, id);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  event.published
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {event.published ? "Published" : "Draft"}
              </span>
              <span className="text-xs text-gray-400">{event._count.orders} orders</span>
              <Link
                href={`/events/${event.slug}`}
                target="_blank"
                className="text-xs text-brand hover:underline inline-flex items-center gap-1"
              >
                View public page <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <ConfirmButton
            action={async () => {
              "use server";
              await deleteEvent(id);
            }}
            confirmMessage="Delete this event? This will also delete all ticket types. Orders will remain."
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-2 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
            Delete Event
          </ConfirmButton>
        </div>
      </div>

      {/* Event Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Event Details</h2>
        <EventForm
          action={updateEventWithId}
          defaultValues={{
            name: event.name,
            description: event.description,
            city: event.city,
            venue: event.venue,
            startsAt: event.startsAt.toISOString(),
            endsAt: event.endsAt?.toISOString(),
            squareImage: event.squareImage,
            published: event.published,
            parentId: event.parentId,
          }}
          submitLabel="Update Event"
          allEvents={allEvents}
          currentEventId={id}
        />
      </div>

      {/* Ticket Types */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Ticket Types</h2>

        {event.ticketTypes.length > 0 && (
          <div className="mb-6 space-y-2">
            {event.ticketTypes.map((tt) => {
              const deleteWithIds = deleteTicketType.bind(null, tt.id, id);
              return (
                <EditableTicketType
                  key={tt.id}
                  tt={tt}
                  eventId={id}
                  deleteAction={deleteWithIds as unknown as (fd: FormData) => void}
                />
              );
            })}
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Ticket Type</h3>
          <TicketTypeForm eventId={id} action={createTicketType} />
        </div>
      </div>

      {/* Sub-events (festival days) */}
      {event.subEvents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <CalendarDays className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-semibold text-gray-900">Festival Days</h2>
          </div>
          <div className="space-y-2">
            {event.subEvents.map((sub) => (
              <Link
                key={sub.id}
                href={`/admin/events/${sub.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand/40 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900">{sub.name}</div>
                  <div className="text-sm text-gray-500">
                    {sub.startsAt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sub.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {sub.published ? "Published" : "Draft"}
                </span>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">To add more days, create a new event and set this event as its parent.</p>
        </div>
      )}
    </div>
  );
}
