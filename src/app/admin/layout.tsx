import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, CalendarDays, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin – Eventor BG",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-brand text-white flex flex-col flex-shrink-0 shadow-lg">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="text-lg font-bold text-white hover:opacity-90">
            Eventor BG
          </Link>
          <div className="text-xs text-blue-200 mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            Events
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-xs text-blue-200">Signed in</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
