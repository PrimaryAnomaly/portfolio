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
      "CubeSat embedded systems and sensor integration",
      "Secured and managed 300M KRW (~$220K) research grant for CubeSat biological payload R&D",
      "Designed multi-modal electrochemical and optical sensor suite for space applications",
      "Developed MCU firmware in C/C++ for real-time sensor data acquisition",
      "Built and validated embedded system prototypes end-to-end: circuit schematic, PCB layout, assembly, firmware, system validation",
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
      "Research at Smart Materials Nano Lab focusing on electrochemical sensor development",
      "CAD modeling, PCB prototyping, microfabrication, mechanical design",
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
      "Developed digital twin framework integrating physics-based modeling with MSPC for pharmaceutical manufacturing",
      "Led real-time quality monitoring system development for mRNA-LNP vaccine production, analyzing 100+ batches",
      "Architected Python software suite with GUI replacing commercial platforms for reproducible process development",
      "Designed end-to-end data pipeline for multi-day batch cycles with automated quality prediction",
      "Co-authoring high-impact journal manuscripts (IF 10+); leading deliverables for government-funded collaboration",
    ],
  },
  {
    title: "Systems Integration Engineer",
    company: "Hanwha Systems",
    location: "Seoul, South Korea",
    dates: "Feb 2024 — May 2025",
    bullets: [
      "Led systems engineering and integration for military SAR satellite programs across EM/QM/FM test campaigns",
      "Developed and executed Electric Test Bed procedures for embedded hardware performance and interface validation",
      "Designed EGSE architecture for automated hardware testing and integration test plans",
      "Developed electrical Integrated Systems Test plans for Flight Model Assembly, Integration, and Testing",
      "Diagnosed and resolved hardware-software interaction failures in networked subsystems",
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
  { category: "Programming", items: "Python, C/C++, MATLAB" },
  { category: "Embedded", items: "MCU Firmware, Real-time Systems, Sensor Integration" },
  { category: "Electronics", items: "Circuit Design, PCB Layout, System Validation, Soldering" },
  { category: "CAD/CAM", items: "Fusion360, AutoCAD, KiCad, SolidWorks" },
  { category: "Fabrication", items: "3D Printing, Laser Cutting, CNC, Microfabrication" },
  { category: "Tools", items: "Git, Docker, Linux" },
];
