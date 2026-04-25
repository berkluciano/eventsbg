"use client";

import Link from "next/link";
import { Ticket, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate, formatCents } from "@/lib/utils";
import { signOut } from "next-auth/react";

type OrderStatus = "PENDING_PURCHASE" | "PURCHASED" | "FAILED" | "REFUNDED";

interface OrderRow {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  qty: number;
  totalCents: number;
  eventName: string;
  eventSlug: string;
  eventStartsAt: Date;
  ticketTypeName: string;
}

interface Props {
  orders: OrderRow[];
  userName: string;
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING_PURCHASE: "bg-amber-50 text-amber-700 border border-amber-200",
  PURCHASED: "bg-green-50 text-green-700 border border-green-200",
  FAILED: "bg-red-50 text-red-700 border border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border border-purple-200",
};

export function TicketsDashboard({ orders, userName }: Props) {
  const { t, locale } = useLanguage();

  function statusLabel(s: OrderStatus) {
    if (s === "PURCHASED") return t.account.statusPurchased;
    if (s === "FAILED") return t.account.statusFailed;
    if (s === "REFUNDED") return t.account.statusRefunded;
    return t.account.statusPending;
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.account.ticketsTitle}</h1>
            {userName && (
              <p className="text-sm text-gray-500 mt-0.5">{userName}</p>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t.account.logout}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t.account.noOrders}</p>
            <Link
              href="/events"
              className="inline-block bg-brand text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-800 transition-colors text-sm"
            >
              {t.account.browseEvents}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Link
                        href={`/events/${order.eventSlug}`}
                        className="font-semibold text-gray-900 hover:text-brand transition-colors"
                      >
                        {order.eventName}
                      </Link>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    </div>

                    <p className="text-sm text-gray-500 mb-3">
                      {order.ticketTypeName} &times; {order.qty} {t.account.qty}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(order.eventStartsAt, locale)}
                      </span>
                      <span>
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span>{formatDate(order.createdAt, locale)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}>
                      {statusLabel(order.status)}
                    </span>
                    <span className="font-bold text-brand">{formatCents(order.totalCents)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
