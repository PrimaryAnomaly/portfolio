import Link from "next/link";
import { siteConfig } from "@/content/site";
import { experience, education, publications, certifications } from "@/content/resume";
import { skillDomains } from "@/content/skills";
import { getAllProjects } from "@/lib/mdx";
import { SiteHeader } from "@/components/site/SiteHeader";
import { OrbitDiagram } from "@/components/site/OrbitDiagram";
import { Magnetic } from "@/components/site/Magnetic";
import { CountUp } from "@/components/site/CountUp";
import { Section } from "@/components/site/Section";
import { ProjectCover } from "@/components/site/ProjectCover";
import { CopyEmail } from "@/components/site/CopyEmail";
import { BackToTop } from "@/components/site/BackToTop";

const navLinks = [
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#education", label: "Education" },
  { href: "#publications", label: "Publications" },
];

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export default function Home() {
  const projects = getAllProjects();
  const current = experience[0];
  const firstAuthor = publications.filter((p) => p.isFirstAuthor).length;
  const [firstName, ...rest] = siteConfig.name.split(" ");
  const lastName = rest.join(" ");
  const roles = siteConfig.title.split(" · ");

  return (
    <>
      <SiteHeader name={siteConfig.name} links={navLinks} home />

      <main className="mx-auto max-w-[1320px] px-5 md:px-8">
        {/* ── HERO ── */}
        <section id="top" className="relative pb-16 pt-28 md:pb-24 md:pt-36">
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="intro-fade flex items-center gap-2.5 text-[0.875rem] text-ink-2" style={i(0)}>
                <span className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-signal" />
                </span>
                {current.title}, {current.company.replace("University of Massachusetts", "UMass")}
              </p>

              <h1 className="mt-6 text-[clamp(4.5rem,24vw,12.5rem)] lg:text-[clamp(4.25rem,15.5vw,12.5rem)] font-semibold leading-[0.84] tracking-[-0.045em] narrow">
                <span className="line-mask intro-rise" style={i(0)}>
                  <span>{firstName}</span>
                </span>
                <span className="line-mask intro-rise" style={i(1)}>
                  <span>{lastName}</span>
                </span>
              </h1>

              <ul className="intro-fade mt-10 grid max-w-[640px] grid-cols-1 gap-x-6 sm:grid-cols-3" style={i(1)}>
                {roles.map((r) => (
                  <li key={r} className="border-t border-ink py-3 text-[1rem] font-medium leading-snug tracking-[-0.01em] max-sm:border-rule max-sm:py-2.5 max-sm:first:border-ink">
                    {r}
                  </li>
                ))}
              </ul>

              <p className="intro-fade mt-6 max-w-[58ch] text-[1.0625rem] leading-[1.65] text-ink-2" style={i(2)}>
                {siteConfig.intro}
              </p>

              <div className="intro-fade mt-9 flex flex-wrap items-center gap-3" style={i(3)}>
                <Magnetic>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="press group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-paper hover:opacity-90"
                  >
                    Email me
                    <span className="nudge" aria-hidden>
                      →
                    </span>
                  </a>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a
                    href="/resume.pdf"
                    className="press inline-flex h-12 items-center rounded-full border border-rule-strong px-6 text-[0.9375rem] font-medium hover:bg-tint"
                  >
                    Download résumé
                  </a>
                </Magnetic>
                <div className="ml-2 flex items-center gap-5 text-[0.9375rem] text-ink-2">
                  <a className="u-link hover:text-ink" href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  <a className="u-link hover:text-ink" href={`https://linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[520px] lg:col-span-5 lg:max-w-none">
              <OrbitDiagram />
            </div>
          </div>

          {/* datasheet row */}
          <dl className="intro-fade mt-16 grid grid-cols-2 border-t border-rule md:mt-24 md:grid-cols-4" style={i(5)}>
            {[
              { v: 9, s: "+", label: "Years across electrical, mechanical and software" },
              { v: publications.length, label: "Peer-reviewed publications" },
              { v: firstAuthor, label: "First-author papers" },
              { v: 220, p: "$", s: "K", label: "Research grant secured for a CubeSat payload" },
            ].map((stat, n) => (
              <div
                key={stat.label}
                className={`border-rule py-6 pr-4 ${n % 2 === 1 ? "border-l pl-4 md:pl-6" : ""} ${n >= 2 ? "border-t md:border-t-0" : ""} ${n === 2 ? "md:border-l md:pl-6" : ""}`}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-[clamp(2.25rem,4.4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] narrow">
                  <CountUp value={stat.v} prefix={stat.p} suffix={stat.s} />
                </dd>
                <dd className="mt-2 max-w-[24ch] text-[0.8125rem] leading-snug text-ink-3" aria-hidden>
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 01 SKILLS ── */}
        <Section
          id="skills"
          index="01"
          title={certifications.length ? "Skills & certifications" : "Skills"}
          aside="Six domains, from requirements through the bench to the build."
        >
          <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2">
            {skillDomains.map((domain, n) => (
              <div key={domain.name} data-reveal style={i(n % 2)}>
                <h3 className="text-[1.125rem] font-semibold tracking-[-0.015em]">{domain.name}</h3>
                <ul className="mt-4 border-t border-rule">
                  {domain.skills.map((s) => (
                    <li key={s.name} className="grid grid-cols-1 gap-x-6 gap-y-0.5 border-b border-rule py-3 sm:grid-cols-[minmax(0,11rem)_1fr]">
                      <span className="text-[0.9375rem] font-medium">{s.name}</span>
                      {s.context && <span className="text-[0.875rem] leading-snug text-ink-3">{s.context}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {certifications.length > 0 && (
            <div className="mt-14" data-reveal>
              <h3 className="text-[1.125rem] font-semibold tracking-[-0.015em]">Certifications</h3>
              <ul className="mt-4 border-t border-rule">
                {certifications.map((cert) => (
                  <li key={cert.name} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule py-3">
                    <span className="font-medium">
                      {cert.name} <span className="font-normal text-ink-3">{cert.issuer}</span>
                    </span>
                    {cert.date && <span className="mono tnum text-[0.8125rem] text-ink-3">{cert.date}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* ── 02 EXPERIENCE ── */}
        <Section id="experience" index="02" title="Experience" aside="Satellite integration and test, then process systems for pharmaceutical manufacturing.">
          <ol className="relative">
            <span aria-hidden className="absolute bottom-0 left-[5px] top-2 w-px bg-rule md:left-[calc(12rem+5px)]" />
            <span aria-hidden className="rail-fill absolute bottom-0 left-[5px] top-2 w-px bg-signal md:left-[calc(12rem+5px)]" />
            {experience.map((job, n) => (
              <li
                key={`${job.company}-${job.dates}`}
                data-reveal
                className="relative grid grid-cols-1 gap-3 pb-14 pl-8 last:pb-0 md:grid-cols-[12rem_1fr] md:gap-0 md:pl-0"
                style={i(0)}
              >
                <div className="md:pr-8">
                  <p className="mono tnum text-[0.8125rem] text-ink-2">{job.dates}</p>
                  <p className="mt-1 text-[0.8125rem] text-ink-3">{job.location}</p>
                </div>
                <span
                  aria-hidden
                  className={`absolute left-0 top-1.5 size-[11px] rounded-full border md:left-[12rem] ${n === 0 ? "border-signal bg-signal" : "border-rule-strong bg-paper"}`}
                />
                <div className="md:pl-10">
                  <h3 className="text-[clamp(1.375rem,2.2vw,1.75rem)] font-semibold tracking-[-0.025em]">{job.title}</h3>
                  <p className="mt-1 text-[1rem] text-ink-2">{job.company}</p>
                  <ul className="mt-5 space-y-2.5">
                    {job.bullets.map((b, k) => (
                      <li key={k} className="relative max-w-[68ch] pl-5 text-[0.9375rem] leading-[1.6] text-ink-2">
                        <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-ink-3" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── 03 PROJECTS ── */}
        <Section id="work" index="03" title="Selected work" aside={`${projects.length} projects across flight hardware, process modelling and autonomous systems.`}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
            {projects.map((project, n) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
                <div data-reveal="clip" style={i(n % 2)} className="relative aspect-[4/3] overflow-hidden border border-rule bg-plate">
                  <div className="clip-inner absolute inset-0">
                    <div className="card-media absolute inset-0">
                      <ProjectCover
                        slug={project.slug}
                        src={project.hero}
                        alt={project.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      />
                    </div>
                  </div>
                  <span className="press absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink text-paper opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="nudge nudge-up" aria-hidden>
                      ↗
                    </span>
                  </span>
                </div>
                <div data-reveal style={i(n % 2)} className="mt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.375rem] font-semibold tracking-[-0.025em]">
                      <span className="u-link">{project.title}</span>
                    </h3>
                    <span className="mono tnum shrink-0 text-[0.8125rem] text-ink-3">{project.date.slice(0, 4)}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 max-w-[56ch] text-[0.9375rem] leading-[1.55] text-ink-2">{project.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-rule px-2.5 py-0.5 text-[0.75rem] text-ink-2">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ── 04 EDUCATION ── */}
        <Section id="education" index="04" title="Education">
          <div className="border-t border-rule">
            {education.map((edu) => (
              <div key={`${edu.institution}-${edu.dates}`} data-reveal className="grid grid-cols-1 gap-3 border-b border-rule py-8 md:grid-cols-[12rem_1fr] md:gap-0">
                <div className="md:pr-8">
                  <p className="mono tnum text-[0.8125rem] text-ink-2">{edu.dates}</p>
                  <p className="mt-1 text-[0.8125rem] text-ink-3">{edu.location}</p>
                </div>
                <div className="md:pl-10">
                  <h3 className="text-[clamp(1.375rem,2.2vw,1.75rem)] font-semibold tracking-[-0.025em]">
                    {edu.degree}, {edu.field}
                  </h3>
                  <p className="mt-1 text-ink-2">{edu.institution}</p>
                  <ul className="mt-5 space-y-2.5">
                    {edu.details.map((d, k) => (
                      <li key={k} className="relative max-w-[68ch] pl-5 text-[0.9375rem] leading-[1.6] text-ink-2">
                        <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-ink-3" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 05 PUBLICATIONS ── */}
        <Section
          id="publications"
          index="05"
          title="Publications"
          aside={
            <>
              {publications.length} papers, {firstAuthor} as first author.{" "}
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="size-1.5 rounded-full bg-signal" /> marks first author.
              </span>
            </>
          }
        >
          <ol className="border-t border-rule">
            {publications.map((pub, n) => {
              const href = pub.doi ? `https://doi.org/${pub.doi}` : undefined;
              const Row = href ? "a" : "div";
              return (
                <li key={n} data-reveal style={i(0)}>
                  <Row
                    {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative grid grid-cols-[3.25rem_1fr_auto] items-baseline gap-x-4 border-b border-rule py-5 md:grid-cols-[4rem_1fr_auto]"
                  >
                    <span aria-hidden className="absolute inset-0 -mx-3 bg-tint opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="mono tnum relative text-[0.8125rem] text-ink-3">{pub.year}</span>
                    <span className="relative min-w-0">
                      <span className="flex items-baseline gap-2.5">
                        {pub.isFirstAuthor && (
                          <>
                            <span aria-hidden className="relative top-[-0.1em] size-1.5 shrink-0 rounded-full bg-signal" />
                            <span className="sr-only">First author:</span>
                          </>
                        )}
                        <span className="text-[1rem] font-medium leading-snug tracking-[-0.01em]">{pub.title}</span>
                      </span>
                      <span className="mt-1 block text-[0.875rem] italic text-ink-3">{pub.journal}</span>
                    </span>
                    <span className="relative text-[0.8125rem] text-ink-3 transition-colors group-hover:text-ink">
                      {href ? (
                        <span className="inline-flex items-center gap-1.5">
                          DOI
                          <span className="nudge nudge-up" aria-hidden>
                            ↗
                          </span>
                        </span>
                      ) : (
                        <span>In press</span>
                      )}
                    </span>
                  </Row>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* ── CONTACT ── */}
        <section id="contact" className="border-t border-rule pb-10 pt-20 md:pt-32">
          <div data-reveal="mask">
            <p className="text-[0.9375rem] text-ink-2">Open to hardware integration, test and systems engineering roles.</p>
            <h2 className="mt-3 text-[clamp(2.25rem,6vw,4.5rem)] font-semibold tracking-[-0.04em] narrow">
              <span className="line-mask">
                <span>Let&rsquo;s talk.</span>
              </span>
            </h2>
          </div>
          <div className="mt-10" data-reveal>
            <CopyEmail email={siteConfig.email} />
          </div>

          <footer className="mt-24 flex flex-col gap-4 border-t border-rule pt-6 text-[0.875rem] text-ink-3 md:flex-row md:items-center md:justify-between">
            <span>
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </span>
            <div className="flex flex-wrap items-center gap-6">
              <a className="u-link hover:text-ink" href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="u-link hover:text-ink" href={`https://linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a className="u-link hover:text-ink" href="/resume.pdf">
                Résumé
              </a>
              <BackToTop />
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
