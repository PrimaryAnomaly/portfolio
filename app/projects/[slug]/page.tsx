import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/Container";
import { ProjectMeta } from "@/components/mdx/ProjectMeta";
import { Gallery } from "@/components/mdx/Gallery";
import { TechDetails } from "@/components/mdx/TechDetails";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";

const mdxComponents = {
  Gallery,
  TechDetails,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-[2.5rem] font-bold leading-[1.1] tracking-[-0.02em] mt-swiss-8 mb-swiss-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-[1.5rem] font-bold leading-[1.1] tracking-[-0.02em] mt-swiss-6 mb-swiss-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[1rem] leading-[1.5] text-swiss-gray-600 mb-swiss-4 max-w-[65ch]" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none space-y-swiss-2 mb-swiss-4" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[1rem] leading-[1.5] text-swiss-gray-600 pl-swiss-4 border-l-2 border-swiss-gray-200" {...props} />
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
    <section className="py-swiss-9">
      <Container>
        <div className="grid grid-cols-12 gap-swiss-5">
          <div className="col-span-12 md:col-span-8">
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-3">{meta.title}</h1>
            <p className="text-[1.25rem] leading-[1.6] text-swiss-gray-600 mb-swiss-6">{meta.description}</p>

            <ProjectMeta tags={meta.tags} github={meta.github} publication={meta.publication} />

            <MDXRemote source={content} components={mdxComponents} />
          </div>
        </div>
      </Container>
    </section>
  );
}
