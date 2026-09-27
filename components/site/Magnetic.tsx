"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion, useSpring } from "motion/react";

const spring = { stiffness: 260, damping: 20, mass: 0.5 };

/**
 * Decorative pointer pull for primary CTAs. Rect is measured once on
 * enter; the spring writes a full transform string so it stays on the
 * compositor. Fine pointers only.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  function onEnter(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  }
  function onMove(e: React.PointerEvent) {
    const r = rect.current;
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    rect.current = null;
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ transform }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  );
}
