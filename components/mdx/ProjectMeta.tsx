import { Badge } from "@/components/Badge";

export function ProjectMeta({
  tags,
  github,
  publication,
}: {
  tags: string[];
  github?: string;
  publication?: string;
}) {
  return (
    <div className="mb-swiss-7 pb-swiss-5 border-b border-swiss-gray-200">
      <div className="flex flex-wrap gap-swiss-2 mb-swiss-4">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      {(github || publication) && (
        <div className="flex gap-swiss-5">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.875rem] font-semibold text-swiss-black hover:text-swiss-red transition-colors duration-100"
            >
              GitHub &rarr;
            </a>
          )}
          {publication && (
            <a
              href={publication}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.875rem] font-semibold text-swiss-black hover:text-swiss-red transition-colors duration-100"
            >
              Publication &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
