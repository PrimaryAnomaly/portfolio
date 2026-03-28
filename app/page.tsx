import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/content/site";
import { experience, education, publications, certifications } from "@/content/resume";
import { skillDomains } from "@/content/skills";
import { getAllProjects } from "@/lib/mdx";

export default function Home() {
  const projects = getAllProjects();

  return (
    <div className="max-w-[1200px] mx-auto px-swiss-5 py-swiss-5">

      {/* ── TOP BAR ── */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-swiss-2 pb-swiss-4 border-b-2 border-swiss-black mb-swiss-6">
        <div>
          <h1 className="text-[2rem] font-bold tracking-[-0.03em] leading-none">{siteConfig.name}</h1>
          <p className="text-[0.8125rem] text-swiss-gray-600 mt-swiss-1">{siteConfig.title}</p>
        </div>
        <div className="flex gap-swiss-5 items-center text-[0.75rem]">
          <a href={`mailto:${siteConfig.email}`} className="mono text-swiss-gray-600 hover:text-swiss-red">{siteConfig.email}</a>
          <a href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer" className="mono text-swiss-gray-600 hover:text-swiss-red">GitHub</a>
          <a href={`https://linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer" className="mono text-swiss-gray-600 hover:text-swiss-red">LinkedIn</a>
          <a href="/resume.pdf" className="mono px-swiss-3 py-swiss-1 border border-swiss-black text-swiss-black hover:bg-swiss-black hover:text-swiss-white transition-colors duration-100">PDF Resume</a>
        </div>
      </header>

      {/* ── INTRO ── */}
      <p className="text-[0.9375rem] leading-[1.7] text-swiss-gray-600 max-w-[65ch] mb-swiss-7">
        {siteConfig.intro}
      </p>

      {/* ── 01 SKILLS ── */}
      <section className="mb-swiss-7">
        <div className="flex items-baseline gap-swiss-3 mb-swiss-4">
          <span className="section-num">01</span>
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em]">Skills & Certifications</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-swiss-6 gap-y-swiss-1">
          {skillDomains.map((domain) => (
            <div key={domain.name} className="py-swiss-3 border-b border-swiss-gray-200">
              <h3 className="mono text-[0.6875rem] font-semibold uppercase text-swiss-gray-400 mb-swiss-2">
                {domain.name}
              </h3>
              <p className="text-[0.8125rem] leading-[1.6]">
                {domain.skills.map((s) => s.name).join(" · ")}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-swiss-5 pt-swiss-4 border-t border-swiss-gray-200">
          <h3 className="mono text-[0.6875rem] font-semibold uppercase text-swiss-gray-400 mb-swiss-3">Certifications</h3>
          {certifications.length > 0 ? (
            <div className="flex flex-wrap gap-x-swiss-6 gap-y-swiss-2">
              {certifications.map((cert) => (
                <div key={cert.name} className="text-[0.8125rem]">
                  <span className="font-semibold">{cert.name}</span>
                  <span className="text-swiss-gray-400"> — {cert.issuer}</span>
                  {cert.date && <span className="mono text-[0.75rem] text-swiss-gray-400 ml-swiss-2">{cert.date}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[0.8125rem] text-swiss-gray-400 italic">Coming soon</p>
          )}
        </div>
      </section>

      {/* ── 02 EXPERIENCE ── */}
      <section className="mb-swiss-7">
        <div className="flex items-baseline gap-swiss-3 mb-swiss-4">
          <span className="section-num">02</span>
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em]">Experience</h2>
        </div>
        <div>
          {experience.map((job) => (
            <div key={`${job.company}-${job.dates}`} className="py-swiss-4 border-b border-swiss-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-swiss-2">
                <div>
                  <span className="font-semibold text-[0.875rem]">{job.title}</span>
                  <span className="text-[0.8125rem] text-swiss-gray-600"> — {job.company}, {job.location}</span>
                </div>
                <span className="mono text-[0.75rem] text-swiss-gray-400 shrink-0">{job.dates}</span>
              </div>
              <ul className="list-none space-y-swiss-1 ml-swiss-3">
                {job.bullets.map((bullet, i) => (
                  <li key={i} className="text-[0.8125rem] leading-[1.5] text-swiss-gray-600 pl-swiss-3 border-l border-swiss-gray-200">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 PROJECTS ── */}
      <section id="projects" className="mb-swiss-7">
        <div className="flex items-baseline gap-swiss-3 mb-swiss-4">
          <span className="section-num">03</span>
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em]">Projects</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-swiss-gray-200">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="bg-white hover:bg-swiss-gray-50 transition-colors duration-100 group"
            >
              {project.hero && (
                <div className="relative w-full aspect-[16/10] bg-swiss-gray-50 overflow-hidden">
                  <Image
                    src={project.hero}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-swiss-4">
                <h3 className="text-[0.875rem] font-bold mb-swiss-1 group-hover:text-swiss-red transition-colors duration-100">
                  {project.title}
                </h3>
                <p className="text-[0.75rem] text-swiss-gray-600 mb-swiss-3 leading-[1.4]">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-swiss-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="mono text-[0.625rem] text-swiss-gray-400 uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 04 EDUCATION ── */}
      <section className="mb-swiss-7">
        <div className="flex items-baseline gap-swiss-3 mb-swiss-4">
          <span className="section-num">04</span>
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em]">Education</h2>
        </div>
        <div>
          {education.map((edu) => (
            <div key={`${edu.institution}-${edu.dates}`} className="py-swiss-4 border-b border-swiss-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-swiss-2">
                <div>
                  <span className="font-semibold text-[0.875rem]">{edu.degree} {edu.field}</span>
                  <span className="text-[0.8125rem] text-swiss-gray-600"> — {edu.institution}, {edu.location}</span>
                </div>
                <span className="mono text-[0.75rem] text-swiss-gray-400 shrink-0">{edu.dates}</span>
              </div>
              <ul className="list-none space-y-swiss-1 ml-swiss-3">
                {edu.details.map((detail, i) => (
                  <li key={i} className="text-[0.8125rem] leading-[1.5] text-swiss-gray-600 pl-swiss-3 border-l border-swiss-gray-200">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 PUBLICATIONS ── */}
      <section className="mb-swiss-7">
        <div className="flex items-baseline gap-swiss-3 mb-swiss-4">
          <span className="section-num">05</span>
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em]">Publications</h2>
          <span className="mono text-[0.6875rem] text-swiss-gray-400 ml-auto">{publications.length} total · {publications.filter(p => p.isFirstAuthor).length} first-author</span>
        </div>
        <div>
          {publications.map((pub, i) => (
            <div key={i} className="flex gap-swiss-3 py-swiss-2 border-b border-swiss-gray-200 items-baseline">
              <span className="mono text-[0.625rem] text-swiss-gray-400 w-[28px] shrink-0">{pub.year}</span>
              {pub.isFirstAuthor && <span className="text-swiss-red text-[0.625rem] font-bold shrink-0">1st</span>}
              {!pub.isFirstAuthor && <span className="text-[0.625rem] text-swiss-gray-300 shrink-0">&nbsp;&nbsp;&nbsp;</span>}
              <span className="text-[0.8125rem] leading-[1.4]">
                {pub.title}
                <span className="text-swiss-gray-400"> — <em>{pub.journal}</em></span>
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono text-[0.625rem] text-swiss-red ml-swiss-2 hover:underline"
                  >
                    DOI
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pt-swiss-5 border-t border-swiss-gray-200 pb-swiss-7">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-swiss-2 text-[0.75rem] text-swiss-gray-400">
          <span>&copy; {new Date().getFullYear()} {siteConfig.name}</span>
          <div className="flex gap-swiss-5">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-swiss-red">{siteConfig.email}</a>
            <a href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-swiss-red">GitHub</a>
            <a href={`https://linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-swiss-red">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
