"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import styles from "./HeroBackground.module.css";

/**
 * Drop-in animated background for the eventor.bg hero.
 * Usage:
 *   <section className="hero">
 *     <HeroBackground />
 *     <div className="hero-content"> ... your existing content ... </div>
 *   </section>
 *
 * Parent must be position: relative and overflow: hidden.
 * Keep your existing blue background color — this renders on top of it.
 */
export default function HeroBackground({
  density = 1,        // 0.5 - 2, scales particle counts
  spotlights = true,  // sweeping light beams
  tickets = true,     // floating ticket shapes
  sparkles = true,    // tiny glints
  confetti = false,   // heavier — enable only on key moments
}) {
  // Only spawn on client to avoid SSR hydration mismatch on random values.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ticketItems = useMemo(() => {
    if (!mounted) return [];
    const n = Math.round(14 * density);
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: -Math.random() * 18,
      dur: 14 + Math.random() * 14,
      rotStart: Math.random() * 360,
      rotEnd: Math.random() * 540 - 270,
      scale: 0.55 + Math.random() * 0.55,
      accent: Math.random() > 0.7, // 30% use accent blue, rest subtle
    }));
  }, [mounted, density]);

  const sparkleItems = useMemo(() => {
    if (!mounted) return [];
    const n = Math.round(30 * density);
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: -Math.random() * 6,
      dur: 3 + Math.random() * 4,
    }));
  }, [mounted, density]);

  return (
    <div className={styles.bg} aria-hidden="true">
      {/* Soft vignette + tone depth */}
      <div className={styles.depth} />

      {/* Sweeping spotlight cones anchored at top */}
      {spotlights && (
        <>
          <div className={`${styles.beam} ${styles.beamA}`} />
          <div className={`${styles.beam} ${styles.beamB}`} />
          <div className={`${styles.beam} ${styles.beamC}`} />
        </>
      )}

      {/* Floating tickets */}
      {tickets &&
        ticketItems.map((t) => (
          <div
            key={t.id}
            className={styles.ticketWrap}
            style={{
              left: `${t.left}%`,
              animationDuration: `${t.dur}s`,
              animationDelay: `${t.delay}s`,
              transform: `scale(${t.scale})`,
              // @ts-ignore - CSS custom props
              "--rot-start": `${t.rotStart}deg`,
              "--rot-end": `${t.rotEnd}deg`,
            }}
          >
            <div
              className={`${styles.ticket} ${
                t.accent ? styles.ticketAccent : styles.ticketMuted
              }`}
            >
              <span className={styles.ticketPerf} />
              <span className={styles.ticketLine} />
              <span className={`${styles.ticketLine} ${styles.ticketLineShort}`} />
            </div>
          </div>
        ))}

      {/* Tiny sparkles */}
      {sparkles &&
        sparkleItems.map((s) => (
          <div
            key={s.id}
            className={styles.sparkle}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

      {/* Grain (pure CSS noise) */}
      <div className={styles.grain} />
    </div>
  );
}
