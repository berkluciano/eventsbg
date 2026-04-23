import Link from "next/link";
import { ShoppingBag, CheckCircle, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCents, formatDateTime } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardData() {
  const [orders, stats] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        event: { select: { name: true } },
        ticketType: { select: { name: true } },
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { totalCents: true },
    }),
  ]);

  const totalOrders = orders.length;
  const pendingCount = stats.find((s) => s.status === "PENDING_PURCHASE")?._count._all ?? 0;
  const purchasedCount = stats.find((s) => s.status === "PURCHASED")?._count._all ?? 0;
  const totalRevenue = stats.reduce((sum, s) => sum + (s._sum.totalCents ?? 0), 0);

  return { orders, totalOrders, pendingCount, purchasedCount, totalRevenue };
}

const statusConfig = {
  PENDING_PURCHASE: {
    label: "Pending",
    className: "bg-orange-100 text-orange-700 border border-orange-200",
  },
  PURCHASED: {
    label: "Purchased",
    className: "bg-green-100 text-green-700 border border-green-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
} as const;

export default async function AdminDashboard() {
  const { orders, totalOrders, pendingCount, purchasedCount, totalRevenue } =
    await getDashboardData();

  const pendingOrders = orders.filter((o) => o.status === "PENDING_PURCHASE");
  const otherOrders = orders.filter((o) => o.status !== "PENDING_PURCHASE");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of all orders and activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          iconColor="text-brand"
          iconBg="bg-brand/10"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Purchase"
          value={pendingCount}
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
          highlight={pendingCount > 0}
        />
        <StatCard
          icon={CheckCircle}
          label="Purchased"
          value={purchasedCount}
          iconColor="text-green-500"
          iconBg="bg-green-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={formatCents(totalRevenue)}
          iconColor="text-purple-500"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">
              Pending Purchase
              <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingOrders.length}
              </span>
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
            <OrderTable orders={pendingOrders} highlight />
          </div>
        </section>
      )}

      {/* All Orders */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Orders</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No orders yet.</div>
          ) : (
            <OrderTable orders={orders} />
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor: string;
  iconBg: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm border ${
        highlight ? "border-orange-300 ring-1 ring-orange-200" : "border-gray-200"
      }`}
    >
      <div className={`inline-flex p-2.5 rounded-lg ${iconBg} mb-3`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

type OrderRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  qty: number;
  totalCents: number;
  status: "PENDING_PURCHASE" | "PURCHASED" | "FAILED";
  createdAt: Date;
  event: { name: string };
  ticketType: { name: string };
};

function OrderTable({ orders, highlight }: { orders: OrderRow[]; highlight?: boolean }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className={`text-left border-b ${highlight ? "bg-orange-50" : "bg-gray-50"}`}>
          <th className="px-4 py-3 font-medium text-gray-600">Order</th>
          <th className="px-4 py-3 font-medium text-gray-600">Customer</th>
          <th className="px-4 py-3 font-medium text-gray-600">Event</th>
          <th className="px-4 py-3 font-medium text-gray-600">Total</th>
          <th className="px-4 py-3 font-medium text-gray-600">Status</th>
          <th className="px-4 py-3 font-medium text-gray-600">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, i) => {
          const cfg = statusConfig[order.status];
          return (
            <tr
              key={order.id}
              className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${
                order.status === "PENDING_PURCHASE" ? "bg-orange-50/30" : ""
              }`}
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-mono text-xs text-brand hover:underline font-semibold"
                >
                  #{order.id.slice(-8).toUpperCase()}
                </Link>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{order.customerName}</div>
                <div className="text-xs text-gray-400">{order.customerEmail}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-gray-900 max-w-xs truncate">{order.event.name}</div>
                <div className="text-xs text-gray-400">
                  {order.ticketType.name} × {order.qty}
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                {formatCents(order.totalCents)}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.className}`}>
                  {cfg.label}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-400">
                {formatDateTime(order.createdAt)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
