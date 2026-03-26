export type Education = {
  degree: string;
  field: string;
  institution: string;
  location: string;
  dates: string;
  details: string[];
};

export type Experience = {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
};

export type Publication = {
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  isFirstAuthor: boolean;
};

export type Certification = {
  name: string;
  issuer: string;
  date?: string;
};

export const education: Education[] = [
  {
    degree: "PhD",
    field: "Electrical Engineering",
    institution: "Korea University",
    location: "Seoul, South Korea",
    dates: "Mar 2017 — Feb 2024",
    details: [
      "CubeSat payload systems engineering: concept of operations through flight-ready hardware",
      "Secured and managed $220K research grant for CubeSat biological payload development",
      "Designed and built multi-sensor hardware systems through full cycle: CAD, circuit/PCB design, cleanroom fabrication, mechanical assembly, system-level qualification",
      "Developed MCU firmware in C/C++ for real-time data acquisition and autonomous operation",
      "Diagnosed cross-domain failures (mechanical, electrical, firmware) and drove fixes through multiple revision cycles",
      "Published 3 first-author SCI papers (cumulative IF: 17.4)",
    ],
  },
  {
    degree: "BSc",
    field: "Mechanical Engineering",
    institution: "Konkuk University",
    location: "Seoul, South Korea",
    dates: "Mar 2013 — Feb 2017",
    details: [
      "Coursework in mechanics, dynamics, thermodynamics, fluid mechanics, materials science, and machine design",
      "Hands-on research in sensor fabrication, hardware prototyping, and precision measurement",
    ],
  },
];

export const experience: Experience[] = [
  {
    title: "Postdoctoral Associate",
    company: "University of Massachusetts Lowell",
    location: "Lowell, MA",
    dates: "Jul 2025 — Present",
    bullets: [
      "Developed system-level digital twin framework integrating physics-based modeling with statistical process control",
      "Designed and executed test plans for pharmaceutical manufacturing systems, validating 100+ production batches",
      "Built Python-based test automation tools replacing commercial platforms for reproducible process development",
      "Led root cause analysis on process failures; developed corrective action protocols and revalidation procedures",
      "Defined system requirements and coordinated deliverables across engineering and research stakeholders",
    ],
  },
  {
    title: "Systems Integration Engineer",
    company: "Hanwha Systems",
    location: "Seoul, South Korea",
    dates: "Feb 2024 — May 2025",
    bullets: [
      "Led systems engineering and integration for military SAR satellite programs across EM/QM/FM test campaigns",
      "Worked across electrical, mechanical, and software interfaces; tracked requirements and interface dependencies",
      "Designed EGSE architecture and test fixtures for subsystem and system-level hardware validation",
      "Executed functional, environmental, and performance testing across multiple technical domains",
      "Led troubleshooting and root cause analysis on system-level anomalies during integration test campaigns",
      "Contributed to facility architecture planning for a high-throughput satellite production line",
    ],
  },
];

export const publications: Publication[] = [
  {
    authors: "Saeyoung Kim, Jaewon Lee, Kimia Babaei, Seonkgyu Yoon",
    title: "Digital Twins in Lyophilization: Advances in Pharmaceutical Process Development and Optimization",
    journal: "Biotechnology Advances",
    year: 2026,
    isFirstAuthor: true,
  },
  {
    authors: "Jinhwee Kil, Saeyoung Kim, James Jungho Pak",
    title: "Investigation of thermal management strategies for biological CubeSat payloads",
    journal: "Acta Astronautica",
    year: 2024,
    doi: "10.1016/j.actaastro.2024.11.059",
    isFirstAuthor: false,
  },
  {
    authors: "Kim, S.; Park, S.; Pak, J.J.",
    title: "Multi-Modal Multi-Array Electrochemical and Optical Sensor Suite for a Biological CubeSat Payload",
    journal: "MDPI Sensors",
    year: 2024,
    doi: "10.3390/s24010265",
    isFirstAuthor: true,
  },
  {
    authors: "Ji-Hoon Han, Sang Hyun Park, Saeyoung Kim, James Jungho Pak",
    title: "A Performance Improvement of Enzyme-Based Electrochemical Lactate Sensor Fabricated by Electroplating Novel PdCu Mediator on a Laser Induced Graphene Electrode",
    journal: "Bioelectrochemistry",
    year: 2022,
    doi: "10.1016/j.bioelechem.2022.108259",
    isFirstAuthor: false,
  },
  {
    authors: "Saeyoung Kim, Ji-Hoon Han, Beelee Chua, James Jungho Pak",
    title: "A pH Sensing Pipette for Cross-Contamination Prevention in Industrial Fermentation",
    journal: "IEEE Transactions on Industrial Electronics",
    year: 2022,
    doi: "10.1109/TIE.2021.3099251",
    isFirstAuthor: true,
  },
  {
    authors: "S.D. Raut, N.M. Shinde, B.G. Ghule, S. Kim, J.J. Pak, Q. Xia, R.S. Mane",
    title: "Room-Temperature Solution Processed Sharp-Edged Nanoshapes",
    journal: "Chemical Engineering Journal",
    year: 2022,
    doi: "10.1016/j.cej.2021.133627",
    isFirstAuthor: false,
  },
  {
    authors: "S.E. Jeong, S. Kim, J.H. Han, J. Jungho Pak",
    title: "Simple Laser-Induced Graphene Fiber Electrode Fabrication for High-Performance Heavy-Metal Sensing",
    journal: "Microchemical Journal",
    year: 2022,
    doi: "10.1016/j.microc.2021.106950",
    isFirstAuthor: false,
  },
  {
    authors: "Sanghoon Cho, Jungmo Jung, Saeyoung Kim, James Pak",
    title: "Conduction Mechanism and Synaptic Behaviour of Interfacial Switching AlO-based RRAM",
    journal: "Semiconductor Science and Technology",
    year: 2020,
    doi: "10.1088/1361-6641/ab8d0e",
    isFirstAuthor: false,
  },
  {
    authors: "Ji-Hoon Han, Saeyoung Kim, Jaesung Choi, Sora Kang, Youngmi Kim Pak, James Jungho Pak",
    title: "Development of Multi-Well-Based Electrochemical Dissolved Oxygen Sensor Array",
    journal: "Sensors and Actuators B: Chemical",
    year: 2020,
    doi: "10.1016/j.snb.2019.127465",
    isFirstAuthor: false,
  },
];

export const certifications: Certification[] = [];

export const technicalSkills = [
  { category: "Systems", items: "Requirements Management, V&V, AIT, Interface Management, Test Planning" },
  { category: "Testing", items: "Functional/Environmental Testing, Root Cause Analysis, SPC, Test Automation" },
  { category: "Electronics", items: "Circuit Design, PCB Layout, System Integration, Soldering" },
  { category: "Mechanical", items: "SolidWorks, Fusion360, AutoCAD, 3D Printing, CNC, DFM" },
  { category: "Software", items: "Python, C/C++, MATLAB, Git, Linux, Docker" },
  { category: "Instrumentation", items: "Oscilloscopes, DAQ Systems, Power Supplies, DMMs, Sensors" },
];
