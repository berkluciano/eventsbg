"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { AccountMenu } from "@/components/AccountMenu";
import { CartIcon } from "@/components/CartIcon";
import type { Locale } from "@/lib/translations";

export function Navbar() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-brand text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
          <Image src="/logo.png" alt="Eventor BG" height={36} width={160} className="h-9 w-auto" />
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/events"
              className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
            >
              {t.nav.allEvents}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
            >
              {t.about.nav}
            </Link>
          </div>

          {/* Language switcher */}
          <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
            {(["bg", "en"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide transition-all ${
                  locale === lang
                    ? "bg-white text-brand shadow-sm"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <CartIcon />
          <AccountMenu />
        </div>
      </nav>
    </header>
  );
}
