import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-[1320px] content-center px-5 md:px-8">
      <p className="mono tnum text-[0.8125rem] text-signal-ink">404</p>
      <h1 className="mt-3 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] narrow">
        <span className="line-mask intro-rise">
          <span>Lost signal.</span>
        </span>
      </h1>
      <p className="intro-fade mt-6 max-w-[44ch] text-[1.0625rem] text-ink-2">This page doesn&rsquo;t exist. It may have moved, or the link is wrong.</p>
      <Link href="/" className="press group intro-fade mt-8 inline-flex h-12 w-fit items-center gap-2.5 rounded-full bg-ink px-6 font-medium text-paper">
        <span className="nudge rotate-180" aria-hidden>
          →
        </span>
        Back to the portfolio
      </Link>
    </main>
  );
}
