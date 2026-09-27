"use client";

import { useId, useState } from "react";

/**
 * Disclosure. Height animates via grid-template-rows 0fr → 1fr (the one
 * sanctioned layout animation: accordions); content fades with it. The
 * plus rotates into a minus-like cross using transform only.
 */
export function TechDetails({ title = "Technical details", children }: { title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="my-10 border-y border-rule">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-[1.0625rem] font-semibold tracking-[-0.01em]"
      >
        <span className="u-link">{title}</span>
        <span
          aria-hidden
          className="relative grid size-8 shrink-0 place-items-center rounded-full border border-rule-strong transition-transform duration-300 ease-[var(--ease-out)] group-active:scale-95"
        >
          <span className="absolute h-px w-3 bg-ink" />
          <span
            className="absolute h-3 w-px bg-ink transition-transform duration-300 ease-[var(--ease-out)]"
            style={{ transform: open ? "scaleY(0)" : "scaleY(1)" }}
          />
        </span>
      </button>
      <div
        id={contentId}
        className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        inert={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="pb-6 transition-[opacity,transform] duration-500 ease-[var(--ease-out)]"
            style={{ opacity: open ? 1 : 0, transform: open ? "none" : "translateY(-6px)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
