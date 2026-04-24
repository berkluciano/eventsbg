"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserCircle, Ticket, LogOut, LogIn, UserPlus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AccountMenu() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return <UserCircle className="w-6 h-6 text-blue-200" />;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Account"
      >
        <UserCircle className="w-6 h-6 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          {session ? (
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-900 truncate">{session.user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
              </div>
              <Link
                href="/account/tickets"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Ticket className="w-4 h-4 text-brand" />
                {t.account.myTickets}
              </Link>
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                {t.account.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/account/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogIn className="w-4 h-4 text-brand" />
                {t.account.login}
              </Link>
              <Link
                href="/account/register"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-brand" />
                {t.account.register}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
