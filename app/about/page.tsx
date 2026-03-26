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
              Electrical engineer. PhD from Korea University. I design sensor
              hardware, write the firmware that runs on it, and build the test
              systems that prove it works. Sometimes I also write software,
              usually because no one else will.
            </p>

            <p className="text-[1rem] leading-[1.5] mb-swiss-4">
              My PhD work was CubeSat payload hardware. Electrochemical and
              optical sensor arrays for small satellites. I did the full stack
              on that -- schematic capture, PCB layout, board bring-up,
              firmware, calibration, environmental testing. Managed a $220K
              research budget. Published in IEEE TIE, MDPI Sensors, and
              Bioelectrochemistry. Three first-author papers.
            </p>

            <p className="text-[1rem] leading-[1.5] mb-swiss-4">
              After that, Hanwha Systems. Systems Integration Engineer on
              military SAR satellite programs. Integration and test across EM,
              QM, and FM model builds. I designed EGSE setups, wrote IST
              procedures, and spent a lot of time debugging interface failures
              between subsystems that were each working fine on their own.
              That is where most satellite problems live.
            </p>

            <p className="text-[1rem] leading-[1.5] mb-swiss-7">
              Now I am a Postdoc at UMass Lowell. The work is pharmaceutical
              process modeling -- digital twins and real-time quality monitoring
              for manufacturing lines. I built a Python suite that replaced a
              commercial platform for mRNA-LNP vaccine process development. It
              is a different domain, but the core problem is the same: measure
              something, model it, control it.
            </p>

            <SectionHeader>Engineering Philosophy</SectionHeader>

            <p className="text-[1rem] leading-[1.5] mb-swiss-4">
              If it has not been tested, it does not work. A schematic is a
              hypothesis. A prototype is an experiment. The test report is what
              actually matters. I do not trust simulations I cannot validate,
              and I do not ship things I cannot debug at 2 AM.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
