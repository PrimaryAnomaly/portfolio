/**
 * Editorial two-column section: a sticky index column on the left,
 * content on the right. Collapses to one column on small screens.
 */
export function Section({
  id,
  index,
  title,
  aside,
  children,
}: {
  id: string;
  index: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-rule py-16 md:py-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-8">
        <header className="md:col-span-4 lg:col-span-3">
          <div className="md:sticky md:top-24">
            <span className="mono tnum text-[0.75rem] text-signal-ink">{index}</span>
            <h2 data-reveal="mask" className="mt-2 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.03em]">
              <span className="line-mask">
                <span>{title}</span>
              </span>
            </h2>
            {aside && <div className="mt-3 max-w-[32ch] text-[0.875rem] leading-relaxed text-ink-3">{aside}</div>}
          </div>
        </header>
        <div className="min-w-0 md:col-span-8 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
