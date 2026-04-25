"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

// Gradient palette cycling through a set of colour pairs
const GRADIENT_PAIRS = [
  { h1: "#7c3aed", h2: "#ec4899" },
  { h1: "#dc2626", h2: "#f59e0b" },
  { h1: "#2563eb", h2: "#06b6d4" },
  { h1: "#0891b2", h2: "#7c3aed" },
  { h1: "#16a34a", h2: "#ca8a04" },
  { h1: "#1e3a8a", h2: "#7c3aed" },
];

interface EventItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  venue: string;
  startsAt: Date;
  squareImage: string | null;
  ticketTypes: { priceCents: number; capacity: number | null; sold: number }[];
}

function EventArt({ seed, hue1, hue2 }: { seed: number; hue1: string; hue2: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={hue1} />
          <stop offset="100%" stopColor={hue2} />
        </linearGradient>
        <radialGradient id={`r-${seed}`} cx="0.7" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#g-${seed})`} />
      <circle cx={60 + (seed * 47) % 200} cy={40 + (seed * 23) % 80} r="55" fill="rgba(255,255,255,0.12)" />
      <circle cx={220 - (seed * 31) % 100} cy={120 - (seed * 17) % 50} r="38" fill="rgba(255,255,255,0.08)" />
      <rect width="320" height="180" fill={`url(#r-${seed})`} />
    </svg>
  );
}

function deriveTag(tt: EventItem["ticketTypes"]): { label: string; kind: "hot" | "few" | "new" | null } {
  if (!tt.length) return { label: "", kind: null };
  const totalCapacity = tt.reduce((s, t) => s + (t.capacity ?? 0), 0);
  const totalSold = tt.reduce((s, t) => s + t.sold, 0);
  const remaining = totalCapacity - totalSold;
  if (totalCapacity > 0 && remaining <= 10) return { label: "Few left", kind: "few" };
  return { label: "", kind: null };
}

export function EventsRow({
  events,
  title,
  eyebrow,
}: {
  events: EventItem[];
  title: string;
  eyebrow: string;
}) {
  const { t } = useLanguage();

  return (
    <section
      style={{
        position: "relative",
        padding: "80px 0 100px",
        background: "#050f2e",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "0 auto 28px",
          padding: "0 48px",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(147,197,253,0.85)",
              marginBottom: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 10px #4ade80",
                animation: "er-pulse 1.6s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            {eyebrow}
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            {title}
          </h2>
        </div>
        <Link
          href="/events"
          className="hover:-translate-y-1 hover:bg-white/10 active:scale-[0.97]"
          style={{
            color: "rgba(255,255,255,0.72)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            padding: "10px 16px",
            borderRadius: 100,
            border: "1px solid rgba(255,255,255,0.1)",
            whiteSpace: "nowrap",
            transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), background 0.18s ease",
          }}
        >
          {t.home.viewAll} →
        </Link>
      </div>

      {/* Scroll strip */}
      <div
        style={{
          display: "flex",
          gap: 18,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          padding: "0 48px 20px",
          WebkitOverflowScrolling: "touch",
        }}
        className="er-scroll"
      >
        {events.map((e, idx) => {
          const { h1, h2 } = GRADIENT_PAIRS[idx % GRADIENT_PAIRS.length];
          const tag = deriveTag(e.ticketTypes);
          const minPrice = e.ticketTypes.length
            ? Math.min(...e.ticketTypes.map((tt) => tt.priceCents))
            : null;
          const d = new Date(e.startsAt);
          const day = String(d.getDate()).padStart(2, "0");
          const mon = d.toLocaleString("default", { month: "short" }).toUpperCase();

          return (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="er-card hover:-translate-y-1.5 active:scale-[0.97]"
              style={{
                flex: "0 0 320px",
                scrollSnapAlign: "start",
                background: "linear-gradient(180deg,rgba(20,35,80,0.6) 0%,rgba(10,20,55,0.6) 100%)",
                borderRadius: 18,
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                display: "block",
                transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color 0.22s ease, box-shadow 0.22s ease",
              }}
            >
              {/* Image / art */}
              <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
                {e.squareImage ? (
                  <Image
                    src={e.squareImage}
                    alt={e.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="320px"
                  />
                ) : (
                  <EventArt seed={idx + 1} hue1={h1} hue2={h2} />
                )}
                {/* dark gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(10,20,55,0.95) 0%, transparent 50%)",
                  }}
                />
                {/* tag */}
                {tag.label && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      padding: "4px 10px",
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background:
                        tag.kind === "hot"
                          ? "linear-gradient(135deg,#f97316,#dc2626)"
                          : tag.kind === "few"
                          ? "linear-gradient(135deg,#fbbf24,#f97316)"
                          : "rgba(0,8,30,0.7)",
                      backdropFilter: "blur(10px)",
                      color: "#fff",
                      borderRadius: 100,
                      zIndex: 2,
                    }}
                  >
                    {tag.label}
                  </span>
                )}
                {/* date badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    background: "rgba(255,255,255,0.96)",
                    color: "#0a1f52",
                    padding: "6px 10px",
                    borderRadius: 10,
                    textAlign: "center",
                    lineHeight: 1,
                    zIndex: 2,
                    minWidth: 48,
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 700, display: "block" }}>{day}</span>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      opacity: 0.7,
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    {mon}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "16px 18px 18px" }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    marginBottom: 4,
                  }}
                >
                  {e.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 14,
                  }}
                >
                  📍 {e.venue}{e.city ? `, ${e.city}` : ""}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                    {minPrice != null && (
                      <>
                        {t.events.from}{" "}
                        <strong style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
                          €{(minPrice / 100).toFixed(2)}
                        </strong>
                      </>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#93c5fd",
                    }}
                  >
                    {t.event.getTickets}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .er-scroll::-webkit-scrollbar { height: 6px; }
        .er-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 100px;
        }

        /* Card base — border lives here; transition + transform handled inline + Tailwind */
        .er-card {
          border: 1px solid rgba(255,255,255,0.08);
          will-change: transform;
        }

        /* Border glow + shadow on hover (Tailwind owns transform) */
        @media (hover: hover) and (pointer: fine) {
          .er-card:hover {
            border-color: rgba(147, 197, 253, 0.35);
            box-shadow:
              0 24px 48px rgba(0, 8, 30, 0.45),
              0 0 0 1px rgba(147, 197, 253, 0.12);
          }
        }

        /* Tap feedback on touch */
        .er-card:active {
          transform: scale(0.97);
          transition-duration: 0.1s;
        }

        @keyframes er-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
