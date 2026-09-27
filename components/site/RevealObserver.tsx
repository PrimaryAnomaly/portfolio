"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Each element reveals once and is then unobserved — re-animating on
 * every scroll-by is an interface fighting its reader.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])");
    if (!els.length) return;

    // A fully clipped element never intersects (Chrome honours the
    // target's own clip-path), so clip reveals are watched via their parent.
    const targets = new Map<Element, HTMLElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          targets.get(entry.target)?.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    els.forEach((el) => {
      const watch = el.dataset.reveal === "clip" && el.parentElement ? el.parentElement : el;
      targets.set(watch, el);
      io.observe(watch);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
