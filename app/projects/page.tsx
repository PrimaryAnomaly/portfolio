import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { ProjectGrid } from "@/components/ProjectGrid";
import { getAllProjects, getAllTags } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const tags = getAllTags();

  return (
    <section className="py-swiss-9">
      <Container>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-7">Projects</h1>
        <Suspense fallback={null}>
          <ProjectGrid projects={projects} tags={tags} />
        </Suspense>
      </Container>
    </section>
  );
}
