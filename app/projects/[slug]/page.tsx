import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Gallery } from "@/components/mdx/Gallery";
import { TechDetails } from "@/components/mdx/TechDetails";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";
import { siteConfig } from "@/content/site";

const mdxComponents = {
  Gallery,
  TechDetails,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] mt-swiss-7 mb-swiss-3 pt-swiss-5 border-t-2 border-swiss-black" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-[1rem] font-bold tracking-[-0.02em] mt-swiss-5 mb-swiss-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[0.875rem] leading-[1.7] text-swiss-gray-700 mb-swiss-4 max-w-[65ch]" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none space-y-swiss-2 mb-swiss-4" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[0.875rem] leading-[1.7] text-swiss-gray-700 pl-swiss-4 border-l-2 border-swiss-gray-200" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-swiss-red hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
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
    <div className="max-w-[1200px] mx-auto px-swiss-5 py-swiss-5">
      {/* Top bar */}
      <header className="flex justify-between items-baseline pb-swiss-4 border-b-2 border-swiss-black mb-swiss-6">
        <Link href="/" className="text-[0.875rem] font-bold text-swiss-black hover:text-swiss-red">
          &larr; {siteConfig.name}
        </Link>
        <div className="flex gap-swiss-4 mono text-[0.75rem] text-swiss-gray-400">
          {meta.tags.map((tag) => (
            <span key={tag} className="uppercase">{tag}</span>
          ))}
        </div>
      </header>

      {/* Project header */}
      <div className="mb-swiss-6">
        <h1 className="text-[1.75rem] font-bold tracking-[-0.03em] mb-swiss-2">{meta.title}</h1>
        <p className="text-[0.9375rem] text-swiss-gray-600 leading-[1.5]">{meta.description}</p>
        {(meta.github || meta.publication) && (
          <div className="flex gap-swiss-4 mt-swiss-3">
            {meta.github && (
              <a href={meta.github} target="_blank" rel="noopener noreferrer"
                className="mono text-[0.75rem] text-swiss-black hover:text-swiss-red">
                GitHub &rarr;
              </a>
            )}
            {meta.publication && (
              <a href={meta.publication} target="_blank" rel="noopener noreferrer"
                className="mono text-[0.75rem] text-swiss-black hover:text-swiss-red">
                Publication &rarr;
              </a>
            )}
          </div>
        )}
      </div>

      {/* MDX content */}
      <div className="max-w-[720px]">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      {/* Back link */}
      <footer className="mt-swiss-8 pt-swiss-5 border-t border-swiss-gray-200">
        <Link href="/" className="mono text-[0.75rem] text-swiss-gray-600 hover:text-swiss-red">
          &larr; Back to all projects
        </Link>
      </footer>
    </div>
  );
}
