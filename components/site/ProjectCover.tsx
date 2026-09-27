import Image from "next/image";
import { covers } from "@/components/covers";
import { DiagramFrame } from "@/components/diagrams/DiagramFrame";

/*
  Project artwork for cards. Every project has a drawn 400×300 cover
  (components/covers) in the site's own line language; a real hero image
  is only used when a project has no cover.
*/

export function isPlaceholder(src?: string) {
  return !src || src.includes("placeholder");
}

export function ProjectCover({
  slug,
  src,
  alt,
  sizes,
  priority = false,
}: {
  slug: string;
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const Cover = covers[slug];
  if (Cover) {
    return (
      <DiagramFrame className="absolute inset-0 bg-plate text-ink-3">
        <Cover />
      </DiagramFrame>
    );
  }
  if (!isPlaceholder(src)) {
    return (
      <div className="absolute inset-0 bg-white">
        <Image src={src!} alt={alt} fill sizes={sizes} priority={priority} className="object-contain p-[4%]" />
      </div>
    );
  }
  return <div className="absolute inset-0 bg-plate" role="img" aria-label={alt} />;
}
