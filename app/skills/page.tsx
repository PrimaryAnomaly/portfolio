import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SkillBlock } from "@/components/SkillBlock";
import { skillDomains } from "@/content/skills";

export const metadata: Metadata = {
  title: "Skills",
};

export default function SkillsPage() {
  return (
    <section className="py-swiss-9">
      <Container>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-7">Skills</h1>
        <div className="grid grid-cols-12 gap-swiss-5">
          <div className="col-span-12 md:col-span-8">
            {skillDomains.map((domain) => (
              <SkillBlock key={domain.name} domain={domain} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
