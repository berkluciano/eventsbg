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
      <section className="hc-hero">
        <HeroBackground />

        {/* bottom fade */}
        <div className="hc-fade" />

        <div className="hc-content">
          {/* kicker */}
          <div className="hc-kicker">
            <span className="hc-kicker-line" />
            {t.home.badge}
            <span className="hc-kicker-line hc-kicker-line-r" />
          </div>

          {/* headline */}
          <h1 className="hc-title">
            {t.home.heroTitle}
            <br />
            <em className="hc-title-em">{t.home.heroTitleHighlight}</em>
          </h1>

          {/* subtitle */}
          <p className="hc-sub">{t.home.heroSubtitle}</p>

          {/* CTA buttons */}
          <div className="hc-cta-row">
            <Link href="/events" className="hc-btn hc-btn-primary">
              {t.home.browseEvents} <ArrowRight size={16} />
            </Link>
            <Link href="/work-with-us" className="hc-btn hc-btn-ghost">
              {t.home.howItWorksBtn}
            </Link>
          </div>

          {/* trust strip */}
          <div className="hc-trust">
            <span className="hc-ti">
              <span className="hc-star">★</span>
              <strong>{t.home.trustRating}</strong>
            </span>
            <span className="hc-sep" />
            <span className="hc-ti"><strong>{t.home.trustTickets}</strong></span>
            <span className="hc-sep" />
            <span className="hc-ti">🔒 {t.home.trustSecure}</span>
            <span className="hc-sep" />
            <span className="hc-ti">{t.home.trustResponse}</span>
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

      {/* ── Bottom CTA ── */}
      <section className="hc-cta-section">
        <div className="hc-cta-inner">
          <h2 className="hc-cta-title">{t.home.ctaTitle}</h2>
          <p className="hc-cta-sub">{t.home.ctaSubtitle}</p>
          <Link href="/events" className="hc-btn hc-btn-white">
            {t.home.browseEvents} <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Scoped styles — only affect this page ── */}
      <style jsx>{`
        /* ── Hero section ── */
        .hc-hero {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: #fff;
        }
        .hc-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 200px;
          z-index: 5;
          pointer-events: none;
          background: linear-gradient(to bottom, transparent 0%, #050f2e 100%);
        }
        .hc-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 64px 24px 100px;
        }

        /* kicker */
        .hc-kicker {
          font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(180, 210, 255, 0.85);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .hc-kicker-line {
          width: 28px; height: 1px; display: inline-block;
          background: linear-gradient(to right, transparent, rgba(180,210,255,0.5));
        }
        .hc-kicker-line-r {
          background: linear-gradient(to left, transparent, rgba(180,210,255,0.5));
        }

        /* headline */
        .hc-title {
          font-size: clamp(44px, 7vw, 88px);
          line-height: 1;
          letter-spacing: -0.038em;
          font-weight: 700;
          max-width: 980px;
          margin-bottom: 22px;
        }
        .hc-title-em {
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 500;
          background: linear-gradient(120deg, #fff 0%, #93c5fd 50%, #fff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* subtitle */
        .hc-sub {
          font-size: 18px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.72);
          max-width: 580px;
          margin: 0 auto 32px;
        }

        /* ── CTA row & shared button base ── */
        .hc-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 28px;
        }
        .hc-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 15px 28px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          will-change: transform;
          transition:
            transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.22s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        /* primary (blue gradient) */
        .hc-btn-primary {
          background: linear-gradient(135deg, #4a90ff 0%, #2563eb 100%);
          color: #fff;
          box-shadow:
            0 12px 32px rgba(37, 99, 235, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }
        @media (hover: hover) and (pointer: fine) {
          .hc-btn-primary:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow:
              0 18px 42px rgba(37, 99, 235, 0.65),
              0 0 0 1px rgba(255, 255, 255, 0.15) inset,
              0 0 0 4px rgba(74, 144, 255, 0.2);
          }
        }
        .hc-btn-primary:active { transform: scale(0.97); transition-duration: 0.1s; }

        /* ghost */
        .hc-btn-ghost {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
        }
        @media (hover: hover) and (pointer: fine) {
          .hc-btn-ghost:hover {
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.13);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          }
        }
        .hc-btn-ghost:active { transform: scale(0.97); transition-duration: 0.1s; }

        /* white (bottom CTA) */
        .hc-btn-white {
          background: #fff;
          color: #1d4ed8;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          padding: 16px 36px;
          font-size: 16px;
        }
        @media (hover: hover) and (pointer: fine) {
          .hc-btn-white:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3);
            background: #eff6ff;
          }
        }
        .hc-btn-white:active { transform: scale(0.97); transition-duration: 0.1s; }

        /* ── Trust strip ── */
        .hc-trust {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          flex-wrap: wrap;
          justify-content: center;
        }
        .hc-ti {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .hc-ti strong { color: #fff; font-weight: 700; }
        .hc-star { color: #fbbf24; }
        .hc-sep {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
        }

        /* ── Bottom CTA section ── */
        .hc-cta-section {
          background: #050f2e;
          padding: 80px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .hc-cta-inner {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          color: #fff;
        }
        .hc-cta-title {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .hc-cta-sub {
          color: rgba(147, 197, 253, 0.85);
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
      `}</style>
    </main>
  );
}
