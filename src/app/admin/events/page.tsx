import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { toggleEventPublished } from "@/actions/events";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Events" };

async function getEvents() {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true, ticketTypes: true } },
    },
  });
}

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">{events.length} events total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Event
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-gray-700 font-semibold mb-2">No events yet</h3>
            <p className="text-gray-400 text-sm mb-6">Create your first event to get started.</p>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-800"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 font-medium text-gray-600">Event</th>
                <th className="px-5 py-3 font-medium text-gray-600">Date</th>
                <th className="px-5 py-3 font-medium text-gray-600">Ticket Types</th>
                <th className="px-5 py-3 font-medium text-gray-600">Orders</th>
                <th className="px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900 max-w-xs truncate">
                      {event.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {event.venue}, {event.city}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(event.startsAt)}
                    {event.startsAt < new Date() && (
                      <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
                        Past
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{event._count.ticketTypes}</td>
                  <td className="px-5 py-4 text-gray-600">{event._count.orders}</td>
                  <td className="px-5 py-4">
                    <form
                      action={async () => {
                        "use server";
                        await toggleEventPublished(event.id, !event.published);
                      }}
                    >
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-colors ${
                          event.published
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {event.published ? (
                          <>
                            <Eye className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
