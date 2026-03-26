"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  function handleClick(tag: string | null) {
    if (tag) {
      router.push(`/projects?tag=${encodeURIComponent(tag)}`);
    } else {
      router.push("/projects");
    }
  }

  return (
    <div className="flex flex-wrap gap-swiss-3 mb-swiss-7">
      <button
        onClick={() => handleClick(null)}
        aria-pressed={!activeTag}
        className={`inline-flex items-center px-swiss-3 py-swiss-1 text-[0.75rem] font-semibold uppercase tracking-[0.05em] border transition-all duration-100 cursor-pointer ${
          !activeTag
            ? "bg-swiss-black text-swiss-white border-swiss-black"
            : "border-current text-swiss-gray-600 hover:text-swiss-black"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleClick(tag)}
          aria-pressed={activeTag === tag}
          className={`inline-flex items-center px-swiss-3 py-swiss-1 text-[0.75rem] font-semibold uppercase tracking-[0.05em] border transition-all duration-100 cursor-pointer ${
            activeTag === tag
              ? "bg-swiss-black text-swiss-white border-swiss-black"
              : "border-current text-swiss-gray-600 hover:text-swiss-black"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
