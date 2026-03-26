import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { siteConfig } from "@/content/site";

export default function Home() {
  return (
    <section className="py-swiss-10 border-b border-swiss-gray-200">
      <Container>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-6">{siteConfig.name}</h1>
        <p className="text-[1.25rem] leading-[1.6] text-swiss-gray-600 mb-swiss-7">
          {siteConfig.title}
        </p>
        <div className="flex flex-wrap gap-swiss-3 mb-swiss-7">
          {siteConfig.stats.map((stat) => (
            <Badge key={stat}>{stat}</Badge>
          ))}
        </div>
        <div className="flex gap-swiss-4 flex-wrap">
          <Button href="/projects" variant="primary">Projects</Button>
          <Button href="/resume">Resume</Button>
        </div>
      </Container>
    </section>
  );
}
