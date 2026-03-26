import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="py-swiss-9">
      <Container>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-7">About</h1>

        <div className="grid grid-cols-12 gap-swiss-5">
          <div className="col-span-12 md:col-span-8">
            <p className="text-[1.25rem] leading-[1.6] text-swiss-gray-600 mb-swiss-6">
              Hardware engineer and systems integrator with a PhD in Electrical Engineering.
              Background spans embedded sensor systems, satellite integration and testing,
              and pharmaceutical process modeling.
            </p>

            <p className="text-[1rem] leading-[1.5] mb-swiss-4">
              Earned a PhD at Korea University designing multi-modal electrochemical and optical
              sensor suites for CubeSat payloads. Built embedded systems end-to-end: circuit
              schematic, PCB layout, assembly, firmware, and system validation. Secured and managed
              a $220K research grant. Published three first-author papers in IEEE Transactions on
              Industrial Electronics, MDPI Sensors, and Bioelectrochemistry.
            </p>

            <p className="text-[1rem] leading-[1.5] mb-swiss-4">
              Worked as a Systems Integration Engineer at Hanwha Systems on military SAR satellite
              programs. Led integration and test campaigns across EM, QM, and FM builds. Designed
              EGSE architecture, developed IST procedures, and resolved hardware-software interface
              failures across networked subsystems.
            </p>

            <p className="text-[1rem] leading-[1.5] mb-swiss-7">
              Currently a Postdoctoral Associate at UMass Lowell developing digital twin frameworks
              and real-time quality monitoring systems for pharmaceutical manufacturing. Architected
              a Python software suite replacing commercial platforms for mRNA-LNP vaccine production
              process development.
            </p>

            <SectionHeader>Engineering Philosophy</SectionHeader>

            <p className="text-[1rem] leading-[1.5] mb-swiss-4">
              Build it. Test it. Ship it. Document what matters. Every system is a prototype until
              it survives integration testing. Design for the failure mode you haven't thought of yet.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
