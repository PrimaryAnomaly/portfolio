import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Gallery } from "@/components/mdx/Gallery";
import { TechDetails } from "@/components/mdx/TechDetails";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";
import { siteConfig } from "@/content/site";

const mdxComponents = {
  Gallery,
  TechDetails,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-[1.125rem] font-bold uppercase tracking-[0.06em] mt-swiss-8 mb-swiss-4 pt-swiss-5 border-t border-swiss-gray-200"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-[0.9375rem] font-bold tracking-[-0.01em] mt-swiss-5 mb-swiss-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[0.875rem] leading-[1.8] text-swiss-gray-600 mb-swiss-4 max-w-[60ch]" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none space-y-swiss-2 mb-swiss-5" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[0.875rem] leading-[1.7] text-swiss-gray-600 pl-swiss-4 border-l-2 border-swiss-gray-200" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-swiss-red hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-swiss-5 border border-swiss-gray-200 overflow-x-auto">
      <table className="w-full border-collapse mono text-[0.8125rem]" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-swiss-gray-50" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="text-left text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-500 px-swiss-4 py-swiss-3 border-b border-swiss-gray-200"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-swiss-4 py-swiss-3 border-b border-swiss-gray-100 text-swiss-gray-700 leading-[1.5]"
      {...props}
    />
  ),
};

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

  return (
    <div className="min-h-screen">
      {/* ── NAV BAR ── */}
      <nav className="max-w-[1200px] mx-auto px-swiss-5 py-swiss-4 flex justify-between items-baseline">
        <Link
          href="/"
          className="mono text-[0.75rem] text-swiss-gray-400 hover:text-swiss-black transition-colors duration-100"
        >
          &larr; {siteConfig.name}
        </Link>
        <div className="flex gap-swiss-4 mono text-[0.6875rem] text-swiss-gray-300 uppercase tracking-[0.08em]">
          {meta.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </nav>

      {/* ── HERO IMAGE ── */}
      {meta.hero && (
        <div className="w-full max-w-[1200px] mx-auto px-swiss-5 mb-swiss-6">
          <div className="relative w-full aspect-[16/9] bg-swiss-gray-50 border border-swiss-gray-200 overflow-hidden">
            <Image
              src={meta.hero}
              alt={meta.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}

      {/* ── TITLE BLOCK ── */}
      <div className="max-w-[1200px] mx-auto px-swiss-5 mb-swiss-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-swiss-6 items-start">
          <div>
            <h1 className="text-[2rem] font-bold tracking-[-0.03em] leading-[1.1] mb-swiss-3">
              {meta.title}
            </h1>
            <p className="text-[0.9375rem] text-swiss-gray-500 leading-[1.6] max-w-[55ch]">
              {meta.description}
            </p>
          </div>

          {/* ── META SIDEBAR ── */}
          <div className="border-t border-swiss-gray-200 pt-swiss-4 lg:border-t-0 lg:border-l lg:pl-swiss-6 lg:pt-0">
            <div className="space-y-swiss-3">
              <div>
                <span className="mono text-[0.625rem] text-swiss-gray-400 uppercase tracking-[0.1em] block mb-swiss-1">
                  Date
                </span>
                <span className="text-[0.8125rem] text-swiss-gray-700">{meta.date}</span>
              </div>
              <div>
                <span className="mono text-[0.625rem] text-swiss-gray-400 uppercase tracking-[0.1em] block mb-swiss-1">
                  Tags
                </span>
                <div className="flex flex-wrap gap-swiss-2">
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="mono text-[0.6875rem] px-swiss-2 py-[2px] border border-swiss-gray-200 text-swiss-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {(meta.github || meta.publication) && (
                <div>
                  <span className="mono text-[0.625rem] text-swiss-gray-400 uppercase tracking-[0.1em] block mb-swiss-1">
                    Links
                  </span>
                  <div className="flex flex-col gap-swiss-1">
                    {meta.github && (
                      <a
                        href={meta.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-[0.75rem] text-swiss-black hover:text-swiss-red transition-colors duration-100"
                      >
                        GitHub &rarr;
                      </a>
                    )}
                    {meta.publication && (
                      <a
                        href={meta.publication}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-[0.75rem] text-swiss-black hover:text-swiss-red transition-colors duration-100"
                      >
                        Publication &rarr;
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MDX CONTENT ── */}
      <div className="max-w-[1200px] mx-auto px-swiss-5">
        <MDXRemote source={content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      {/* ── FOOTER NAV ── */}
      <footer className="max-w-[1200px] mx-auto px-swiss-5 mt-swiss-8 pb-swiss-7">
        <div className="border-t border-swiss-gray-200 pt-swiss-5 flex justify-between items-center">
          <Link
            href="/projects"
            className="mono text-[0.75rem] text-swiss-gray-400 hover:text-swiss-red transition-colors duration-100"
          >
            &larr; All projects
          </Link>
          <span className="mono text-[0.625rem] text-swiss-gray-300">
            {siteConfig.name}
          </span>
        </div>
      </footer>
    </div>
  );
}
