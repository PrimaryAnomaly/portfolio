import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="py-swiss-9">
      <Container>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-7">Contact</h1>
        <div className="grid grid-cols-12 gap-swiss-5">
          <div className="col-span-12 md:col-span-8">
            <ul className="list-none space-y-swiss-5">
              <li>
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-600 block mb-swiss-2">
                  Email
                </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[1rem] text-swiss-black hover:text-swiss-red transition-colors duration-100"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-600 block mb-swiss-2">
                  LinkedIn
                </span>
                <a
                  href={`https://linkedin.com/in/${siteConfig.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[1rem] text-swiss-black hover:text-swiss-red transition-colors duration-100"
                >
                  linkedin.com/in/{siteConfig.linkedin}
                </a>
              </li>
              <li>
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-600 block mb-swiss-2">
                  GitHub
                </span>
                <a
                  href={`https://github.com/${siteConfig.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[1rem] text-swiss-black hover:text-swiss-red transition-colors duration-100"
                >
                  github.com/{siteConfig.github}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
