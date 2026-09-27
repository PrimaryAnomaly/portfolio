"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Big email link with a copy affordance. The label swap is a
 * crossfade with a 2px blur so the two states read as one change.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <a
        href={`mailto:${email}`}
        className="group relative block min-w-0 text-[clamp(1.75rem,6.4vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] narrow break-all sm:break-normal"
      >
        <span className="u-link">{email}</span>
        <span className="nudge nudge-up ml-3 inline-block text-signal" aria-hidden>
          ↗
        </span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="press relative inline-grid h-11 shrink-0 cursor-pointer place-items-center self-start rounded-full border border-rule-strong px-5 text-[0.875rem] sm:self-auto"
        aria-live="polite"
      >
        <span
          className="col-start-1 row-start-1 transition-[opacity,filter,transform] duration-300 ease-[var(--ease-out)]"
          style={{
            opacity: copied ? 0 : 1,
            filter: copied ? "blur(2px)" : "blur(0)",
            transform: copied ? "translateY(-4px)" : "none",
          }}
        >
          Copy address
        </span>
        <span
          className="col-start-1 row-start-1 flex items-center gap-2 transition-[opacity,filter,transform] duration-300 ease-[var(--ease-out)]"
          style={{
            opacity: copied ? 1 : 0,
            filter: copied ? "blur(0)" : "blur(2px)",
            transform: copied ? "none" : "translateY(4px)",
          }}
          aria-hidden={!copied}
        >
          <span className="size-1.5 rounded-full bg-signal" />
          Copied
        </span>
      </button>
    </div>
  );
}
