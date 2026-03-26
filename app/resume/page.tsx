import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { ResumeSection } from "@/components/ResumeSection";
import { education, experience, publications, certifications, technicalSkills } from "@/content/resume";

export const metadata: Metadata = {
  title: "Resume",
};

export default function ResumePage() {
  return (
    <section className="py-swiss-9">
      <Container>
        <div className="flex justify-between items-start mb-swiss-7 flex-wrap gap-swiss-4">
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em]">Resume</h1>
          <Button href="/resume.pdf" variant="default" size="sm">
            Download PDF
          </Button>
        </div>

        <ResumeSection title="Experience">
          {experience.map((job) => (
            <div key={`${job.company}-${job.dates}`} className="mb-swiss-7">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-swiss-2">
                <h3 className="text-[1.5rem] font-bold leading-[1.1] tracking-[-0.02em]">{job.title}</h3>
                <span className="text-[0.875rem] text-swiss-gray-600">{job.dates}</span>
              </div>
              <p className="text-[0.875rem] text-swiss-gray-600 mb-swiss-3">
                {job.company} · {job.location}
              </p>
              <ul className="list-none space-y-swiss-2">
                {job.bullets.map((bullet, i) => (
                  <li key={i} className="text-[1rem] leading-[1.5] text-swiss-gray-600 pl-swiss-4 border-l-2 border-swiss-gray-200">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Education">
          {education.map((edu) => (
            <div key={`${edu.institution}-${edu.dates}`} className="mb-swiss-7">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-swiss-2">
                <h3 className="text-[1.5rem] font-bold leading-[1.1] tracking-[-0.02em]">
                  {edu.degree}, {edu.field}
                </h3>
                <span className="text-[0.875rem] text-swiss-gray-600">{edu.dates}</span>
              </div>
              <p className="text-[0.875rem] text-swiss-gray-600 mb-swiss-3">
                {edu.institution} · {edu.location}
              </p>
              <ul className="list-none space-y-swiss-2">
                {edu.details.map((detail, i) => (
                  <li key={i} className="text-[1rem] leading-[1.5] text-swiss-gray-600 pl-swiss-4 border-l-2 border-swiss-gray-200">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Technical Skills">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-600 py-swiss-4 border-b border-swiss-gray-200 w-1/4">
                    Domain
                  </th>
                  <th className="text-left text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-600 py-swiss-4 border-b border-swiss-gray-200">
                    Tools &amp; Technologies
                  </th>
                </tr>
              </thead>
              <tbody>
                {technicalSkills.map((skill) => (
                  <tr key={skill.category} className="hover:bg-swiss-gray-50">
                    <td className="py-swiss-4 border-b border-swiss-gray-200 font-semibold text-[0.875rem] pr-swiss-4 align-top">
                      {skill.category}
                    </td>
                    <td className="py-swiss-4 border-b border-swiss-gray-200 text-[1rem] leading-[1.5] text-swiss-gray-600">
                      {skill.items}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResumeSection>

        <ResumeSection title="Publications">
          <ol className="list-none space-y-swiss-4">
            {publications.map((pub, i) => (
              <li key={i} className="pb-swiss-4 border-b border-swiss-gray-200">
                <p className="text-[1rem] leading-[1.5] mb-swiss-1">
                  {pub.isFirstAuthor && <span className="text-swiss-red font-semibold">&#9733; </span>}
                  {pub.authors}
                </p>
                <p className="text-[1rem] leading-[1.5] font-semibold mb-swiss-1">
                  &ldquo;{pub.title}&rdquo;
                </p>
                <p className="text-[0.875rem] text-swiss-gray-600">
                  <em>{pub.journal}</em>, {pub.year}
                  {pub.doi && (
                    <>
                      {" · "}
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-swiss-red hover:underline"
                      >
                        DOI
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </ResumeSection>

        {certifications.length > 0 && (
          <ResumeSection title="Certifications">
            <ul className="list-none space-y-swiss-3">
              {certifications.map((cert) => (
                <li key={cert.name} className="pb-swiss-3 border-b border-swiss-gray-200">
                  <span className="font-semibold">{cert.name}</span>
                  <span className="text-swiss-gray-600"> · {cert.issuer}</span>
                  {cert.date && <span className="text-swiss-gray-400"> · {cert.date}</span>}
                </li>
              ))}
            </ul>
          </ResumeSection>
        )}
      </Container>
    </section>
  );
}
