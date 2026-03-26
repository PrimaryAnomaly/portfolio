import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/mdx";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/resume`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/skills`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  const projectPages = getAllProjectSlugs().map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...projectPages];
}
