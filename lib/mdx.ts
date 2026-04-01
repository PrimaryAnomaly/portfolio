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
  poster?: string;
};

export type ProjectMeta = ProjectFrontmatter & {
  slug: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateOptionalString(value: unknown, field: string, slug: string): string | undefined {
  if (value === undefined) return undefined;
  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"${field}\" must be a non-empty string when provided.`);
  }
  return value.trim();
}

function validateHttpUrl(value: unknown, field: string, slug: string): string | undefined {
  const normalized = validateOptionalString(value, field, slug);
  if (normalized === undefined) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"${field}\" must be an absolute http/https URL.`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"${field}\" must use http or https.`);
  }

  return normalized;
}

function validateHero(value: unknown, slug: string): string | undefined {
  const normalized = validateOptionalString(value, "hero", slug);
  if (normalized === undefined) return undefined;

  if (normalized.startsWith("/")) {
    return normalized;
  }

  throw new Error(`Invalid frontmatter in project \"${slug}\": \"hero\" must be a site-relative path starting with '/'.`);
}

function validateDate(value: unknown, slug: string): string {
  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"date\" is required.`);
  }

  const normalized = value.trim();
  const match = normalized.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"date\" must use YYYY-MM or YYYY-MM-DD.`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);

  if (month < 1 || month > 12) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"date\" month must be between 01 and 12.`);
  }

  if (!dayText) {
    return normalized;
  }

  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"date\" must be a real calendar date.`);
  }

  return normalized;
}

function parseProjectFrontmatter(data: unknown, slug: string): ProjectFrontmatter {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": expected an object.`);
  }

  const frontmatter = data as Record<string, unknown>;

  if (!isNonEmptyString(frontmatter.title)) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"title\" is required.`);
  }

  if (!isNonEmptyString(frontmatter.description)) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"description\" is required.`);
  }

  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0 || !frontmatter.tags.every(isNonEmptyString)) {
    throw new Error(`Invalid frontmatter in project \"${slug}\": \"tags\" must be a non-empty string array.`);
  }

  return {
    title: frontmatter.title.trim(),
    description: frontmatter.description.trim(),
    date: validateDate(frontmatter.date, slug),
    tags: frontmatter.tags.map((tag) => tag.trim()),
    hero: validateHero(frontmatter.hero, slug),
    github: validateHttpUrl(frontmatter.github, "github", slug),
    publication: validateHttpUrl(frontmatter.publication, "publication", slug),
    poster: validateHero(frontmatter.poster, slug),
  };
}

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
    meta: { ...parseProjectFrontmatter(data, slug), slug },
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
