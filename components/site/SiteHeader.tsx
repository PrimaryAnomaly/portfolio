"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type NavLink = { href: string; label: string };

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fixed header. Hides on scroll down, returns on scroll up (a class
 * toggle, not per-frame styling). On the home page an indicator bar
 * slides between section links; link rects are measured once per resize
 * and the bar moves with transform only.
 */
export function SiteHeader({ name, links, home = false }: { name: string; links: NavLink[]; home?: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const rects = useRef<Record<string, { x: number; w: number }>>({});

  // Direction-aware hide/show
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 240);
          last = y;
        }
        setScrolled(y > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy
  useEffect(() => {
    if (!home) return;
    const ids = links.map((l) => l.href.replace("#", ""));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const top = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
      rootMargin: "0px 0px -90% 0px",
    });
    const hero = document.getElementById("top");
    if (hero) top.observe(hero);
    return () => {
      io.disconnect();
      top.disconnect();
    };
  }, [home, links]);

  // Measure link positions once per resize
  useIsoLayoutEffect(() => {
    if (!home) return;
    const measure = () => {
      const nav = navRef.current;
      if (!nav) return;
      const base = nav.getBoundingClientRect().left;
      nav.querySelectorAll<HTMLAnchorElement>("a[data-id]").forEach((a) => {
        const r = a.getBoundingClientRect();
        rects.current[a.dataset.id!] = { x: r.left - base, w: r.width };
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [home]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const r = active ? rects.current[active] : null;
    if (!r) {
      bar.style.opacity = "0";
      return;
    }
    bar.style.opacity = "1";
    bar.style.transform = `translate3d(${r.x}px, 0, 0) scaleX(${r.w})`;
  }, [active]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[var(--ease-drawer)]"
      style={{ transform: hidden ? "translate3d(0,-100%,0)" : "none" }}
    >
      <div
        className="absolute inset-0 bg-paper/80 backdrop-blur-md transition-opacity duration-300"
        style={{ opacity: scrolled ? 1 : 0 }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-rule transition-opacity duration-300"
        style={{ opacity: scrolled ? 1 : 0 }}
      />
      <div className="relative mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5 text-[0.9375rem] font-semibold tracking-[-0.01em]">
          <span className="relative block size-2.5 rounded-full bg-signal transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-125" />
          {name}
        </Link>

        <nav className="flex items-center gap-1 text-[0.875rem]">
          <div ref={navRef} className="relative hidden items-center md:flex">
            {links.map((l) => {
              const id = l.href.replace(/^\/?#/, "");
              const isActive = active === id;
              // Same-page hashes stay plain anchors so Lenis can glide to them
              const Anchor = l.href.startsWith("#") ? "a" : Link;
              return (
                <Anchor
                  key={l.href}
                  href={l.href}
                  data-id={id}
                  className={`relative px-3 py-2 transition-colors duration-200 ${isActive ? "text-ink" : "text-ink-2 hover:text-ink"}`}
                >
                  {l.label}
                </Anchor>
              );
            })}
            {home && (
              <span
                ref={barRef}
                aria-hidden
                className="pointer-events-none absolute bottom-0.5 left-0 h-px w-px origin-left bg-signal opacity-0 transition-[transform,opacity] duration-500 ease-[var(--ease-in-out)]"
              />
            )}
          </div>
          <a
            href="/resume.pdf"
            className="press ml-2 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[0.8125rem] font-medium text-paper hover:opacity-85"
          >
            Résumé
          </a>
        </nav>
      </div>
    </header>
  );
}
