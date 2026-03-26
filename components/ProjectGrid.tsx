"use client";

import { useSearchParams } from "next/navigation";
import { ProjectCard } from "./ProjectCard";
import { TagFilter } from "./TagFilter";
import type { ProjectMeta } from "@/lib/mdx";

export function ProjectGrid({ projects, tags }: { projects: ProjectMeta[]; tags: string[] }) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  return (
    <>
      <TagFilter tags={tags} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-swiss-5">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-[1rem] text-swiss-gray-600">No projects match this filter.</p>
      )}
    </>
  );
}
