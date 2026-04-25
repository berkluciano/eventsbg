"use client";

// FlowDivider — slick animated curved lines that connect two sections.
// Drop between <Hero/> and <EventsRow/>:
//
//   <Hero />
//   <FlowDivider />
//   <EventsRow />
//
// The divider sits on the same dark blue background, so it visually bridges them.

export default function FlowDivider() {
  return (
    <div className="fd-wrap" aria-hidden="true">
      <svg
        className="fd-svg"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fd-stroke-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(74, 144, 255, 0)" />
            <stop offset="35%" stopColor="rgba(74, 144, 255, 0.85)" />
            <stop offset="65%" stopColor="rgba(147, 197, 253, 0.85)" />
            <stop offset="100%" stopColor="rgba(74, 144, 255, 0)" />
          </linearGradient>
          <linearGradient id="fd-stroke-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0)" />
            <stop offset="50%" stopColor="rgba(37, 99, 235, 0.55)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
          </linearGradient>
          <linearGradient id="fd-stroke-3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(180, 210, 255, 0)" />
            <stop offset="50%" stopColor="rgba(180, 210, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(180, 210, 255, 0)" />
          </linearGradient>
          <linearGradient id="fd-stroke-4" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0)" />
            <stop offset="50%" stopColor="rgba(124, 58, 237, 0.4)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
          </linearGradient>
          <filter id="fd-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Soft glow background curves (blurred) */}
        <path
          className="fd-line fd-line-glow"
          d="M -50 90 C 280 30, 480 200, 720 130 S 1200 40, 1500 150"
          fill="none"
          stroke="url(#fd-stroke-1)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#fd-glow)"
          opacity="0.55"
        />

        {/* Crisp curves on top */}
        <path
          className="fd-line fd-line-1"
          d="M -50 90 C 280 30, 480 200, 720 130 S 1200 40, 1500 150"
          fill="none"
          stroke="url(#fd-stroke-1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="fd-line fd-line-2"
          d="M -50 130 C 220 80, 520 240, 760 170 S 1180 90, 1500 190"
          fill="none"
          stroke="url(#fd-stroke-2)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          className="fd-line fd-line-3"
          d="M -50 60 C 320 130, 540 -10, 800 80 S 1240 200, 1500 110"
          fill="none"
          stroke="url(#fd-stroke-3)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          className="fd-line fd-line-4"
          d="M -50 170 C 260 220, 600 60, 880 140 S 1280 210, 1500 80"
          fill="none"
          stroke="url(#fd-stroke-4)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Travelling dots along the main curve */}
        <circle r="3" fill="#93c5fd" filter="url(#fd-glow)">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            path="M -50 90 C 280 30, 480 200, 720 130 S 1200 40, 1500 150"
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#fff" filter="url(#fd-glow)">
          <animateMotion
            dur="11s"
            begin="-3s"
            repeatCount="indefinite"
            path="M -50 130 C 220 80, 520 240, 760 170 S 1180 90, 1500 190"
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="11s" begin="-3s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="#7eb6ff" filter="url(#fd-glow)">
          <animateMotion
            dur="13s"
            begin="-7s"
            repeatCount="indefinite"
            path="M -50 60 C 320 130, 540 -10, 800 80 S 1240 200, 1500 110"
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="13s" begin="-7s" repeatCount="indefinite" />
        </circle>
      </svg>

      <style jsx>{`
        .fd-wrap {
          position: relative;
          width: 100%;
          height: 240px;
          background: #050f2e;
          overflow: hidden;
          pointer-events: none;
        }
        .fd-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .fd-line {
          stroke-dasharray: 1600;
          stroke-dashoffset: 1600;
          animation: fd-draw 4s ease-out forwards;
        }
        .fd-line-1 { animation-delay: 0.1s; }
        .fd-line-2 { animation-delay: 0.4s; }
        .fd-line-3 { animation-delay: 0.7s; }
        .fd-line-4 { animation-delay: 1s; }
        .fd-line-glow { animation: fd-draw 5s ease-out 0.1s forwards, fd-pulse 6s ease-in-out 4s infinite; }

        @keyframes fd-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fd-pulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.75; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fd-line { animation: none; stroke-dashoffset: 0; }
        }

        @media (max-width: 720px) {
          .fd-wrap { height: 160px; }
        }
      `}</style>
    </div>
  );
}
