"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps a diagram: one-shot draw-in via [data-reveal="diagram"], and the
 * ambient SMIL clocks run only while the figure is on screen (and never
 * under reduced motion).
 */
export function DiagramFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const svg = el?.querySelector("svg");
    if (!el || !svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    svg.pauseAnimations();
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="diagram" className={className}>
      {children}
    </div>
  );
}
