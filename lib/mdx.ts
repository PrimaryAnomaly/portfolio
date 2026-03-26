import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export type ProjectFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  hero?: string;
  github?: string;
  publication?: string;
};

export type ProjectMeta = ProjectFrontmatter & {
  slug: string;
};

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) return [];
  return fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjectBySlug(slug: string): { meta: ProjectMeta; content: string } {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    meta: { ...(data as ProjectFrontmatter), slug },
    content,
  };
}

export function getAllProjects(): ProjectMeta[] {
  const slugs = getAllProjectSlugs();
  return slugs
    .map((slug) => getProjectBySlug(slug).meta)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllTags(): string[] {
  const projects = getAllProjects();
  const tagSet = new Set<string>();
  projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
