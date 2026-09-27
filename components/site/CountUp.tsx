"use client";

import { useEffect, useRef } from "react";

/**
 * Counts to `value` once, the first time it scrolls into view.
 * Writes textContent directly (no React render per frame), bounded rAF,
 * tabular figures so the width never shifts. SSR renders the final value.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const write = (n: number) => {
      el.textContent = `${prefix}${n}${suffix}`;
    };
    write(0);

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          write(Math.round((1 - Math.pow(1 - t, 4)) * value));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      write(value);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span className="tnum">
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span ref={ref} aria-hidden>
        {prefix}
        {value}
        {suffix}
      </span>
    </span>
  );
}
