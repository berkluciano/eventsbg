"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroBackground from "@/components/HeroBackground";
import { EventsRow } from "@/components/EventsRow";

interface Event {
  id: string;
  name: string;
  slug: string;
  city: string;
  venue: string;
  startsAt: Date;
  squareImage: string | null;
  ticketTypes: { priceCents: number; capacity: number | null; sold: number }[];
}

export function HomeContent({ events }: { events: Event[] }) {
  const { t } = useLanguage();

  return (
    <main className="flex-1">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-screen flex flex-col text-white">
        <HeroBackground />

        {/* bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none"
          style={{ height: 200, background: "linear-gradient(to bottom, transparent 0%, #050f2e 100%)" }}
        />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
          {/* kicker */}
          <div
            style={{
              fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(180,210,255,0.85)",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span style={{ width: 28, height: 1, background: "linear-gradient(to right, transparent, rgba(180,210,255,0.5))", display: "inline-block" }} />
            {t.home.badge}
            <span style={{ width: 28, height: 1, background: "linear-gradient(to left, transparent, rgba(180,210,255,0.5))", display: "inline-block" }} />
          </div>

          {/* headline */}
          <h1
            style={{
              fontSize: "clamp(44px, 7vw, 88px)",
              lineHeight: 1,
              letterSpacing: "-0.038em",
              fontWeight: 700,
              maxWidth: 980,
              marginBottom: 22,
            }}
          >
            {t.home.heroTitle}
            <br />
            <em
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontStyle: "italic",
                fontWeight: 500,
                background: "linear-gradient(120deg,#fff 0%,#93c5fd 50%,#fff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {t.home.heroTitleHighlight}
            </em>
          </h1>

          {/* subtitle */}
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 580,
              margin: "0 auto 32px",
            }}
          >
            {t.home.heroSubtitle}
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
            <Link
              href="/events"
              style={{
                padding: "15px 28px",
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                background: "linear-gradient(135deg,#4a90ff 0%,#2563eb 100%)",
                color: "#fff",
                boxShadow: "0 12px 32px rgba(37,99,235,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {t.home.browseEvents} <ArrowRight size={16} />
            </Link>
            <Link
              href="/work-with-us"
              style={{
                padding: "15px 28px",
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
              }}
            >
              {t.home.howItWorksBtn}
            </Link>
          </div>

          {/* trust strip */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 18,
              padding: "10px 18px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 100,
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <span style={{ color: "#fbbf24" }}>★</span>
              <strong style={{ color: "#fff", fontWeight: 700 }}>{t.home.trustRating}</strong>
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
            <span style={{ whiteSpace: "nowrap" }}>
              <strong style={{ color: "#fff", fontWeight: 700 }}>{t.home.trustTickets}</strong>
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
            <span style={{ whiteSpace: "nowrap" }}>🔒 {t.home.trustSecure}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
            <span style={{ whiteSpace: "nowrap" }}>{t.home.trustResponse}</span>
          </div>
        </div>
      </section>

      {/* ── Trending Events Row ── */}
      {events.length > 0 && (
        <EventsRow
          events={events}
          title={t.home.trendingTitle}
          eyebrow={t.home.trendingEyebrow}
        />
      )}

      {/* ── CTA ── */}
      <section className="bg-[#050f2e] py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.home.ctaTitle}</h2>
          <p className="text-blue-100 mb-8">{t.home.ctaSubtitle}</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-white text-brand font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t.home.browseEvents} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
