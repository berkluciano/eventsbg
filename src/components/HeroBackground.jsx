"use client";

import { useMemo } from "react";

const TICKET_COUNT = 9;
const ORB_COUNT = 5;
const DUST_COUNT = 36;

function rand(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export default function HeroBackground() {
  const tickets = useMemo(
    () =>
      Array.from({ length: TICKET_COUNT }, (_, i) => {
        const r = (n) => rand(i * 7 + n);
        return {
          id: i,
          left: r(1) * 100,
          top: 5 + r(2) * 80,
          dur: 38 + r(3) * 24,
          delay: -r(4) * 60,
          rotStart: -8 + r(5) * 16,
          rotEnd: -8 + r(6) * 16,
          scale: 0.6 + r(7) * 0.6,
          blur: r(8) > 0.7 ? 1 + r(9) * 1.5 : 0,
          driftX: -6 + r(10) * 12,
          driftY: -10 + r(11) * 20,
          opacity: 0.55 + r(12) * 0.35,
        };
      }),
    []
  );

  const orbs = useMemo(
    () =>
      Array.from({ length: ORB_COUNT }, (_, i) => {
        const r = (n) => rand(i * 13 + n + 100);
        return {
          id: i,
          left: r(1) * 100,
          top: r(2) * 100,
          size: 380 + r(3) * 460,
          dur: 22 + r(4) * 18,
          delay: -r(5) * 30,
          tint:
            i % 4 === 0
              ? "rgba(120, 170, 255, 0.55)"
              : i % 4 === 1
              ? "rgba(80, 130, 230, 0.45)"
              : i % 4 === 2
              ? "rgba(180, 210, 255, 0.4)"
              : "rgba(150, 130, 220, 0.35)",
          driftX: -40 + r(6) * 80,
          driftY: -30 + r(7) * 60,
        };
      }),
    []
  );

  const dust = useMemo(
    () =>
      Array.from({ length: DUST_COUNT }, (_, i) => {
        const r = (n) => rand(i * 5 + n + 500);
        return {
          id: i,
          left: r(1) * 100,
          top: r(2) * 100,
          size: 1 + r(3) * 2.5,
          dur: 6 + r(4) * 8,
          delay: -r(5) * 10,
          opacity: 0.3 + r(6) * 0.5,
        };
      }),
    []
  );

  return (
    <div className="hb-root" aria-hidden="true">
      <div className="hb-base" />

      <div className="hb-orbs">
        {orbs.map((o) => (
          <div
            key={o.id}
            className="hb-orb"
            style={{
              left: `${o.left}%`,
              top: `${o.top}%`,
              width: o.size,
              height: o.size,
              background: `radial-gradient(circle, ${o.tint} 0%, transparent 65%)`,
              animationDuration: `${o.dur}s`,
              animationDelay: `${o.delay}s`,
              ["--dx"]: `${o.driftX}px`,
              ["--dy"]: `${o.driftY}px`,
            }}
          />
        ))}
      </div>

      <div className="hb-tickets">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="hb-ticket-wrap"
            style={{
              left: `${t.left}%`,
              top: `${t.top}%`,
              animationDuration: `${t.dur}s`,
              animationDelay: `${t.delay}s`,
              ["--rot-start"]: `${t.rotStart}deg`,
              ["--rot-end"]: `${t.rotEnd}deg`,
              ["--drift-x"]: `${t.driftX}vw`,
              ["--drift-y"]: `${t.driftY}vh`,
              ["--scale"]: t.scale,
              filter: t.blur ? `blur(${t.blur}px)` : "none",
              opacity: t.opacity,
            }}
          >
            <TicketSVG />
          </div>
        ))}
      </div>

      <div className="hb-dust">
        {dust.map((d) => (
          <span
            key={d.id}
            className="hb-speck"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              animationDuration: `${d.dur}s`,
              animationDelay: `${d.delay}s`,
              ["--peak"]: d.opacity,
            }}
          />
        ))}
      </div>

      <div className="hb-vignette" />
      <div className="hb-grain" />

      <style jsx>{`
        .hb-root { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .hb-base {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 90% 70% at 50% 25%,
            #1a3d8a 0%, #102a64 45%, #081a44 80%, #050f2e 100%);
        }
        .hb-orbs, .hb-tickets, .hb-dust { position: absolute; inset: 0; }
        .hb-orb {
          position: absolute; border-radius: 50%;
          transform: translate(-50%, -50%);
          filter: blur(80px); mix-blend-mode: screen;
          will-change: transform;
          animation: hb-orb-drift ease-in-out infinite alternate;
        }
        @keyframes hb-orb-drift {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1); }
          100% { transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1.15); }
        }
        .hb-ticket-wrap {
          position: absolute;
          transform: translate(-50%, -50%) scale(var(--scale));
          will-change: transform;
          animation: hb-ticket-float ease-in-out infinite alternate;
        }
        @keyframes hb-ticket-float {
          0%   { transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rot-start)); }
          100% { transform: translate(calc(-50% + var(--drift-x)), calc(-50% + var(--drift-y)))
                  scale(var(--scale)) rotate(var(--rot-end)); }
        }
        .hb-speck {
          position: absolute; border-radius: 50%;
          background: rgba(220, 235, 255, 1);
          box-shadow: 0 0 6px rgba(180, 210, 255, 0.7);
          opacity: 0;
          animation: hb-speck-twinkle ease-in-out infinite;
        }
        @keyframes hb-speck-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50%      { opacity: var(--peak, 0.6); transform: scale(1.2); }
        }
        .hb-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 100% 80% at 50% 50%,
            transparent 40%, rgba(3, 8, 28, 0.55) 90%, rgba(3, 8, 28, 0.85) 100%);
        }
        .hb-grain {
          position: absolute; inset: 0; opacity: 0.06; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='5'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }
        /* Mobile: keep only 3 tickets, shrink them */
        @media (max-width: 639px) {
          .hb-ticket-wrap:nth-child(n+4) { display: none; }
          .hb-ticket-wrap { opacity: 0.35 !important; transform: translate(-50%, -50%) scale(calc(var(--scale) * 0.65)); }
        }

        /* Small tablet: keep 5 tickets, slightly smaller */
        @media (min-width: 640px) and (max-width: 1023px) {
          .hb-ticket-wrap:nth-child(n+6) { display: none; }
          .hb-ticket-wrap { transform: translate(-50%, -50%) scale(calc(var(--scale) * 0.8)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hb-orb, .hb-ticket-wrap, .hb-speck { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function TicketSVG() {
  return (
    <svg width="180" height="68" viewBox="0 0 180 68"
      style={{ display: "block", filter: "drop-shadow(0 10px 18px rgba(0, 8, 30, 0.55))" }}>
      <defs>
        <linearGradient id="hb-tk-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbfaf3" />
          <stop offset="50%" stopColor="#f3eedf" />
          <stop offset="100%" stopColor="#e6dfc7" />
        </linearGradient>
        <linearGradient id="hb-tk-stub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f4ea8" />
          <stop offset="100%" stopColor="#163b80" />
        </linearGradient>
        <linearGradient id="hb-tk-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path d="M 4 4 h 118 v 60 h -118 a 4 4 0 0 1 -4 -4 v -52 a 4 4 0 0 1 4 -4 z" fill="url(#hb-tk-paper)" />
      <path d="M 130 4 h 46 a 4 4 0 0 1 4 4 v 52 a 4 4 0 0 1 -4 4 h -46 z" fill="url(#hb-tk-stub)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={126} cy={8 + i * 7} r={1.6} fill="#0a1f52" opacity="0.55" />
      ))}
      <circle cx="126" cy="2" r="2" fill="#050f2e" />
      <circle cx="126" cy="66" r="2" fill="#050f2e" />
      <g transform="translate(10, 44)" fill="#0a1f52" opacity="0.78">
        {[[0,2],[3,1],[5,3],[9,1],[11,2],[14,1],[16,3],[20,1],[22,2],[25,3],[29,1],[31,2],[34,1],[36,2],[39,3],[43,1],[45,2]].map(([x, w], i) => (
          <rect key={i} x={x} y="0" width={w} height="16" />
        ))}
      </g>
      <rect x="10" y="12" width="58" height="4" rx="1" fill="#0a1f52" opacity="0.85" />
      <rect x="10" y="20" width="78" height="2.5" rx="1" fill="#0a1f52" opacity="0.5" />
      <rect x="10" y="26" width="42" height="2.5" rx="1" fill="#0a1f52" opacity="0.5" />
      <g transform="translate(140, 12)" fill="rgba(255,255,255,0.85)">
        <rect x="0" y="0" width="30" height="3" rx="1" />
        <rect x="0" y="6" width="22" height="2" rx="1" opacity="0.7" />
        <circle cx="15" cy="26" r="9" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" />
        <text x="15" y="29" fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700" textAnchor="middle" fill="rgba(255,255,255,0.95)">★</text>
        <rect x="2" y="42" width="26" height="2" rx="1" opacity="0.55" />
        <rect x="6" y="46" width="18" height="2" rx="1" opacity="0.4" />
      </g>
      <rect x="0" y="0" width="180" height="68" fill="url(#hb-tk-sheen)" opacity="0.25" />
    </svg>
  );
}
