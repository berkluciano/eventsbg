import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Ticket,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { markOrderPurchased, markOrderFailed, refundOrder } from "@/actions/orders";
import { SubmitButton } from "@/components/SubmitButton";
import { formatCents, formatDateTime } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      event: true,
      ticketType: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id.slice(-8).toUpperCase()}` };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const markPurchasedWithId = markOrderPurchased.bind(null, id);
  const markFailedWithId = markOrderFailed.bind(null, id);
  const refundWithId = refundOrder.bind(null, id);

  const ticketPrice = order.totalCents - order.serviceFeeCents;

  const statusMap = {
    PENDING_PURCHASE: {
      icon: Clock,
      label: "Pending Purchase",
      className: "bg-orange-100 text-orange-700 border-orange-300",
      iconColor: "text-orange-500",
    },
    PURCHASED: {
      icon: CheckCircle,
      label: "Purchased",
      className: "bg-green-100 text-green-700 border-green-300",
      iconColor: "text-green-500",
    },
    FAILED: {
      icon: XCircle,
      label: "Failed",
      className: "bg-red-100 text-red-700 border-red-300",
      iconColor: "text-red-500",
    },
    REFUNDED: {
      icon: RotateCcw,
      label: "Refunded",
      className: "bg-purple-100 text-purple-700 border-purple-300",
      iconColor: "text-purple-500",
    },
  } as const;

  const status = statusMap[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${status.className}`}
          >
            <StatusIcon className={`w-4 h-4 ${status.iconColor}`} />
            {status.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-brand" />
            Customer Details
          </h2>
          <div className="space-y-3">
            <DetailRow icon={User} label="Full Name" value={order.customerName} />
            <DetailRow
              icon={Mail}
              label="Email"
              value={
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="text-brand hover:underline break-all"
                >
                  {order.customerEmail}
                </a>
              }
            />
            <DetailRow
              icon={Phone}
              label="Phone"
              value={
                <a href={`tel:${order.customerPhone}`} className="text-brand hover:underline">
                  {order.customerPhone}
                </a>
              }
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-brand" />
            Ticket Details
          </h2>
          <div className="space-y-3">
            <DetailRow icon={Calendar} label="Event" value={order.event.name} />
            <DetailRow
              icon={MapPin}
              label="Venue"
              value={`${order.event.venue}, ${order.event.city}`}
            />
            <DetailRow
              icon={Calendar}
              label="Event Date"
              value={formatDateTime(order.event.startsAt)}
            />
            <DetailRow
              icon={Ticket}
              label="Ticket Type"
              value={`${order.ticketType.name} × ${order.qty}`}
            />
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-brand" />
          Payment Summary
        </h2>
        <div className="space-y-2 max-w-xs">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ticket subtotal</span>
            <span>{formatCents(ticketPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service fee</span>
            <span>{formatCents(order.serviceFeeCents)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total Paid</span>
            <span className="text-brand">{formatCents(order.totalCents)}</span>
          </div>
        </div>
        {order.stripeSessionId && (
          <p className="text-xs text-gray-400 mt-3">
            Stripe Session: <code className="font-mono">{order.stripeSessionId}</code>
          </p>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}

      {/* Actions */}
      {order.status === "PENDING_PURCHASE" && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Action Required</h2>
          <p className="text-sm text-gray-600 mb-5">
            Go to the official ticket vendor and purchase{" "}
            <strong>
              {order.qty}x {order.ticketType.name}
            </strong>{" "}
            for <strong>{order.event.name}</strong> using the customer&apos;s details above.
            <br />
            Use <strong>{order.customerName}</strong> and{" "}
            <strong>{order.customerEmail}</strong> when purchasing.
          </p>

          <form action={markPurchasedWithId as unknown as (fd: FormData) => void} className="space-y-4">
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes / Reference Number{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Paste the vendor's order confirmation number or any notes here..."
                defaultValue={order.notes ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 resize-y"
              />
            </div>
            <div className="flex gap-3">
              <SubmitButton
                loadingText="Updating..."
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 text-sm font-semibold rounded-lg"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Purchased
              </SubmitButton>
            </div>
          </form>

          <div className="flex gap-4 mt-3">
            <form action={markFailedWithId as unknown as (fd: FormData) => void}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium"
              >
                <XCircle className="w-4 h-4" />
                Mark as Failed
              </button>
            </form>
            <form action={refundWithId as unknown as (fd: FormData) => void}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Refund &amp; Notify Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {order.status === "PURCHASED" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <div className="font-semibold text-green-800">Ticket purchased successfully</div>
            <div className="text-sm text-green-700">
              The vendor has been notified to send the ticket to {order.customerEmail}.
            </div>
          </div>
        </div>
      )}

      {order.status === "FAILED" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <div className="font-semibold text-red-800">Order failed</div>
            <div className="text-sm text-red-700 mb-3">
              This order was marked as failed. Contact the customer at {order.customerEmail}.
            </div>
            <form action={refundWithId as unknown as (fd: FormData) => void}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Issue Refund &amp; Notify Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {order.status === "REFUNDED" && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-purple-500 flex-shrink-0" />
          <div>
            <div className="font-semibold text-purple-800">Order refunded</div>
            <div className="text-sm text-purple-700">
              A full refund of {formatCents(order.totalCents)} was issued and the customer was notified at {order.customerEmail}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-medium text-gray-900 break-words">{value}</div>
      </div>
    </div>
  );
}
