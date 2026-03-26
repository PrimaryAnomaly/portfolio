import Link from "next/link";
import Image from "next/image";
import { Badge } from "./Badge";
import type { ProjectMeta } from "@/lib/mdx";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group">
      <article className="border border-swiss-gray-200 p-swiss-6 transition-all duration-200 hover:border-swiss-black h-full">
        {project.hero && (
          <div className="relative w-full aspect-video mb-swiss-4 bg-swiss-gray-50">
            <Image
              src={project.hero}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <h3 className="text-[1.5rem] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-2 group-hover:text-swiss-red transition-colors duration-100">
          {project.title}
        </h3>
        <p className="text-[0.875rem] text-swiss-gray-600 mb-swiss-4">{project.description}</p>
        <div className="flex flex-wrap gap-swiss-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </article>
    </Link>
  );
}
