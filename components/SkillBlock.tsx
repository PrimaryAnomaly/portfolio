import type { SkillDomain } from "@/content/skills";

export function SkillBlock({ domain }: { domain: SkillDomain }) {
  return (
    <div className="mb-swiss-7">
      <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-600 pb-swiss-3 border-b border-swiss-gray-200 mb-swiss-4">
        {domain.name}
      </h3>
      <ul className="list-none space-y-swiss-3">
        {domain.skills.map((skill) => (
          <li key={skill.name} className="flex flex-col md:flex-row md:gap-swiss-4">
            <span className="font-semibold text-[1rem] min-w-[200px]">{skill.name}</span>
            {skill.context && (
              <span className="text-[0.875rem] text-swiss-gray-600">{skill.context}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
