"use client";

import { useEffect, useRef } from "react";

/*
  Earth → Mars Hohmann transfer, to scale (1 AU = 100 units).
  Static geometry is one SVG. The planets are HTML rings rotated with
  CSS transforms so they composite on the GPU; the loop pauses when
  the diagram leaves the viewport.
*/

const C = 200;
const R_EARTH = 100;
const R_MARS = 152.4;
const A = (R_EARTH + R_MARS) / 2; // semi-major axis
const B = Math.round(Math.sqrt(R_EARTH * R_MARS) * 100) / 100; // semi-minor axis
const TRANSFER = `M ${C - R_EARTH} ${C} A ${A} ${B} 0 0 1 ${C + R_MARS} ${C}`;

const EARTH_PERIOD = 80; // seconds per revolution (display time)
const MARS_PERIOD = EARTH_PERIOD * 1.881;

// Launch geometry: Earth at 270° (left), Mars leads by 44°
const EARTH_START = 270;
const MARS_START = 314;

// Rounded so server and client render byte-identical attributes
const r2 = (n: number) => Math.round(n * 100) / 100;

const ticks = Array.from({ length: 120 }, (_, i) => {
  const a = (i / 120) * Math.PI * 2;
  const major = i % 10 === 0;
  const r1 = 192;
  const rr = major ? 182 : 187;
  return {
    x1: r2(C + Math.cos(a) * r1),
    y1: r2(C + Math.sin(a) * r1),
    x2: r2(C + Math.cos(a) * rr),
    y2: r2(C + Math.sin(a) * rr),
    major,
  };
});

export function OrbitDiagram() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle("orbit-paused", !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="m-0">
      <div ref={ref} className="relative aspect-square w-full select-none" aria-hidden>
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full overflow-visible" fill="none">
          {/* dial */}
          <g className="orbit-ring" style={{ "--i": 0 } as React.CSSProperties}>
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke="var(--rule-strong)"
                strokeWidth={t.major ? 1 : 0.6}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {/* crosshair */}
          <g className="orbit-ring" style={{ "--i": 1 } as React.CSSProperties} stroke="var(--rule)" strokeWidth="1">
            <line x1={C - 176} y1={C} x2={C + 176} y2={C} vectorEffect="non-scaling-stroke" strokeDasharray="1 4" />
            <line x1={C} y1={C - 176} x2={C} y2={C + 176} vectorEffect="non-scaling-stroke" strokeDasharray="1 4" />
          </g>

          {/* orbits */}
          <circle
            className="orbit-ring"
            style={{ "--i": 2 } as React.CSSProperties}
            cx={C}
            cy={C}
            r={R_EARTH}
            stroke="var(--ink-3)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            className="orbit-ring"
            style={{ "--i": 3 } as React.CSSProperties}
            cx={C}
            cy={C}
            r={R_MARS}
            stroke="var(--ink-3)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* transfer arc, drawn on load */}
          <path
            className="orbit-draw"
            d={TRANSFER}
            pathLength={1}
            stroke="var(--signal)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* sun */}
          <circle className="orbit-ring" style={{ "--i": 1 } as React.CSSProperties} cx={C} cy={C} r="3.5" fill="var(--ink)" />
          <circle className="orbit-ring" style={{ "--i": 1 } as React.CSSProperties} cx={C} cy={C} r="9" stroke="var(--ink-3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

          {/* departure + arrival */}
          <circle cx={C - R_EARTH} cy={C} r="3" fill="var(--paper)" stroke="var(--signal)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="orbit-ring" style={{ "--i": 4 } as React.CSSProperties} />
          <g className="orbit-pop">
            <circle cx={C + R_MARS} cy={C} r="7" stroke="var(--signal)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle cx={C + R_MARS} cy={C} r="3" fill="var(--signal)" />
          </g>
        </svg>

        {/* planets: rotating rings, composited */}
        <div
          className="orbit-spin absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${(R_EARTH * 2) / 4}%`,
            height: `${(R_EARTH * 2) / 4}%`,
            margin: `-${R_EARTH / 4}% 0 0 -${R_EARTH / 4}%`,
            animationDuration: `${EARTH_PERIOD}s`,
            animationDelay: `-${(EARTH_START / 360) * EARTH_PERIOD}s`,
          }}
        >
          <span className="absolute left-1/2 top-0 block size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-4 ring-paper" />
        </div>
        <div
          className="orbit-spin absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${(R_MARS * 2) / 4}%`,
            height: `${(R_MARS * 2) / 4}%`,
            margin: `-${R_MARS / 4}% 0 0 -${R_MARS / 4}%`,
            animationDuration: `${MARS_PERIOD}s`,
            animationDelay: `-${(MARS_START / 360) * MARS_PERIOD}s`,
          }}
        >
          <span className="absolute left-1/2 top-0 block size-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal ring-4 ring-paper" />
        </div>

        {/* labels */}
        <span className="mono intro-fade absolute left-1/2 top-[76.5%] -translate-x-1/2 text-[0.6875rem] text-ink-3" style={{ "--i": 6 } as React.CSSProperties}>
          Earth 1.00 AU
        </span>
        <span className="mono intro-fade absolute left-1/2 top-[89.6%] -translate-x-1/2 text-[0.6875rem] text-ink-3" style={{ "--i": 7 } as React.CSSProperties}>
          Mars 1.52 AU
        </span>
      </div>
      <figcaption
        className="intro-fade mt-4 grid grid-cols-3 gap-4 border-t border-rule pt-3 text-[0.75rem] text-ink-3"
        style={{ "--i": 8 } as React.CSSProperties}
      >
        <span>
          Transfer
          <span className="mono tnum mt-0.5 block text-ink">259 d</span>
        </span>
        <span>
          Departure Δv
          <span className="mono tnum mt-0.5 block text-ink">2.94 km/s</span>
        </span>
        <span>
          Semi-major axis
          <span className="mono tnum mt-0.5 block text-ink">1.262 AU</span>
        </span>
      </figcaption>
    </figure>
  );
}
