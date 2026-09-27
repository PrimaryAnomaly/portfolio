"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="press group inline-flex cursor-pointer items-center gap-2 text-ink-2 hover:text-ink"
    >
      Back to top
      <span className="nudge inline-block -rotate-90" aria-hidden>
        →
      </span>
    </button>
  );
}
