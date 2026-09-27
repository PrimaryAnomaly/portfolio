import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Gallery } from "@/components/mdx/Gallery";
import { TechDetails } from "@/components/mdx/TechDetails";
import { getAllProjects, getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";
import { siteConfig } from "@/content/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ProjectCover } from "@/components/site/ProjectCover";
import { diagrams } from "@/components/diagrams";
import { DiagramFrame } from "@/components/diagrams/DiagramFrame";

const mdxComponents = {
  Gallery,
  TechDetails,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mb-5 mt-16 border-t border-rule pt-8 text-[clamp(1.5rem,2.4vw,1.875rem)] font-semibold tracking-[-0.03em] first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-3 mt-10 text-[1.1875rem] font-semibold tracking-[-0.015em]" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-5 max-w-[68ch] text-[1.0625rem] leading-[1.75] text-ink-2 [&_strong]:font-semibold [&_strong]:text-ink" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="mb-6 max-w-[68ch] space-y-2.5" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-6 max-w-[68ch] list-decimal space-y-2.5 pl-5 marker:text-ink-3" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className="relative pl-5 text-[1.0625rem] leading-[1.7] text-ink-2 before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-2.5 before:bg-ink-3 [&_strong]:font-semibold [&_strong]:text-ink"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-ink underline decoration-signal decoration-1 underline-offset-[3px] transition-colors hover:text-signal-ink"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="mono rounded-[3px] bg-tint px-1.5 py-0.5 text-[0.875em]" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto border-y border-rule">
      <table className="w-full border-collapse text-[0.9375rem]" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-rule-strong px-4 py-3 text-left text-[0.8125rem] font-medium text-ink-3 first:pl-0" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="tnum border-b border-rule px-4 py-3 align-top leading-[1.5] text-ink-2 first:pl-0 first:text-ink" {...props} />
  ),
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function formatDate(d: string) {
  const [y, m] = d.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!getAllProjectSlugs().includes(slug)) {
    return {};
  }
  const { meta } = getProjectBySlug(slug);
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = getAllProjectSlugs();
  if (!slugs.includes(slug)) {
    notFound();
  }

  const { meta, content } = getProjectBySlug(slug);
  const Diagram = diagrams[slug];
  const all = getAllProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  const next = all[(idx + 1) % all.length];

  const links = [
    meta.github && { href: meta.github, label: "Source on GitHub" },
    meta.publication && { href: meta.publication, label: "Publication" },
    meta.poster && { href: meta.poster, label: "Conference poster (PDF)" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <>
      <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-50 h-[2px] bg-signal" />
      <SiteHeader name={siteConfig.name} links={[{ href: "/#work", label: "All work" }]} />

      <main className="mx-auto max-w-[1320px] px-5 pt-28 md:px-8 md:pt-36">
        {/* ── TITLE ── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <p className="intro-fade flex items-center gap-3 text-[0.875rem] text-ink-2" style={i(0)}>
              <Link href="/#work" className="u-link hover:text-ink">
                Selected work
              </Link>
              <span className="h-3 w-px bg-rule-strong" aria-hidden />
              <span className="mono tnum">
                {String(idx + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")}
              </span>
            </p>
            <h1 className="mt-6 text-[clamp(2.75rem,7.5vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em] narrow">
              <span className="line-mask intro-rise" style={i(0)}>
                <span>{meta.title}</span>
              </span>
            </h1>
            <p className="intro-fade mt-7 max-w-[58ch] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.6] text-ink-2" style={i(1)}>
              {meta.description}
            </p>
          </div>

          <dl className="intro-fade grid grid-cols-2 content-end gap-x-6 gap-y-6 self-end text-[0.9375rem] md:col-span-4 md:grid-cols-1" style={i(2)}>
            <div className="border-t border-rule pt-3">
              <dt className="text-[0.8125rem] text-ink-3">Date</dt>
              <dd className="mt-1">{formatDate(meta.date)}</dd>
            </div>
            <div className="border-t border-rule pt-3">
              <dt className="text-[0.8125rem] text-ink-3">Disciplines</dt>
              <dd className="mt-1">{meta.tags.join(", ")}</dd>
            </div>
            {links.length > 0 && (
              <div className="col-span-2 border-t border-rule pt-3 md:col-span-1">
                <dt className="text-[0.8125rem] text-ink-3">Links</dt>
                <dd className="mt-1 flex flex-col items-start gap-1">
                  {links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5">
                      <span className="u-link">{l.label}</span>
                      <span className="nudge nudge-up text-signal" aria-hidden>
                        ↗
                      </span>
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* ── HERO ── */}
        {Diagram ? (
          <figure className="mt-14 border border-rule bg-plate md:mt-20">
            <div className="overflow-x-auto px-5 py-8 md:px-12 md:py-14">
              <DiagramFrame className="min-w-[760px]">
                <Diagram />
              </DiagramFrame>
            </div>
          </figure>
        ) : (
          <div data-reveal="clip" className="relative mt-14 aspect-[16/10] overflow-hidden border border-rule bg-plate md:mt-20 md:aspect-[16/9]">
            <div className="clip-inner absolute inset-0">
              <ProjectCover slug={slug} src={meta.hero} alt={meta.title} sizes="(max-width: 1320px) 100vw, 1320px" priority />
            </div>
          </div>
        )}

        {/* ── BODY ── */}
        <article className="grid grid-cols-1 gap-8 pt-16 md:grid-cols-12 md:pt-24">
          <div className="md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
            <MDXRemote source={content} components={mdxComponents} options={{ blockJS: false, blockDangerousJS: true, mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </div>
        </article>

        {/* ── NEXT ── */}
        {next && next.slug !== slug && (
          <Link href={`/projects/${next.slug}`} className="group mt-28 block border-t border-rule pb-20 pt-10 md:mt-36">
            <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="text-[0.875rem] text-ink-3">Next project</p>
                <p className="mt-3 flex items-baseline gap-4 text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] narrow">
                  <span className="u-link">{next.title}</span>
                  <span className="nudge text-signal" aria-hidden>
                    →
                  </span>
                </p>
                <p className="mt-4 line-clamp-2 max-w-[52ch] text-ink-2">{next.description}</p>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden border border-rule bg-plate md:col-span-5">
                <div className="card-media absolute inset-0">
                  <ProjectCover slug={next.slug} src={next.hero} alt={next.title} sizes="(max-width: 768px) 100vw, 40vw" />
                </div>
              </div>
            </div>
          </Link>
        )}
      </main>
    </>
  );
}
