"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "./Container";
import { siteConfig, navLinks } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="py-swiss-5 border-b border-swiss-gray-200">
      <Container>
        <div className="flex justify-between items-center">
          <Link href="/" className="text-[1.5rem] font-bold tracking-[-0.02em] text-swiss-black">
            {siteConfig.name}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-swiss-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.875rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-100 pb-swiss-1 ${
                  pathname === link.href
                    ? "text-swiss-black border-b-2 border-swiss-red"
                    : "text-swiss-gray-600 hover:text-swiss-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-swiss-black cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden mt-swiss-4 flex flex-col gap-swiss-3 border-t border-swiss-gray-200 pt-swiss-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[0.875rem] font-semibold uppercase tracking-[0.1em] ${
                  pathname === link.href
                    ? "text-swiss-black"
                    : "text-swiss-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
