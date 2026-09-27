import type { Metadata, Viewport } from "next";
import { Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/content/site";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { RevealObserver } from "@/components/site/RevealObserver";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-instrument",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.intro,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrument.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Reveal styles only apply once JS is known to run */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans min-h-dvh bg-paper text-ink">
        <SmoothScroll />
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
