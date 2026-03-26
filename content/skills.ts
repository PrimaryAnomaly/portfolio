export type SkillDomain = {
  name: string;
  skills: {
    name: string;
    context?: string;
  }[];
};

export const skillDomains: SkillDomain[] = [
  {
    name: "Hardware Design",
    skills: [
      { name: "Circuit Design", context: "Analog front ends, power distribution, sensor interfaces" },
      { name: "PCB Layout", context: "4-layer boards, KiCad and Altium, JLCPCB fabrication" },
      { name: "Soldering", context: "SMD rework, through-hole, reflow" },
      { name: "System Integration", context: "Subsystem interface validation, cable harness design" },
    ],
  },
  {
    name: "Embedded / Firmware",
    skills: [
      { name: "C/C++", context: "STM32, ESP32 MCU firmware" },
      { name: "Real-time Systems", context: "Sub-millisecond timing, interrupt-driven architectures" },
      { name: "Sensor Integration", context: "Electrochemical, optical, temperature, pressure" },
      { name: "Communication Protocols", context: "SPI, I2C, UART, LoRa" },
    ],
  },
  {
    name: "Mechanical / CAD",
    skills: [
      { name: "SolidWorks", context: "Assemblies, GD&T, drawings for fabrication" },
      { name: "Fusion360", context: "Rapid prototyping, parametric design" },
      { name: "AutoCAD", context: "2D drafting, layout" },
      { name: "3D Printing", context: "FDM, SLA prototyping, design-for-print" },
      { name: "CNC / Laser Cutting", context: "Fixture and enclosure fabrication" },
    ],
  },
  {
    name: "Software",
    skills: [
      { name: "Python", context: "Data pipelines, GUI applications, process modeling, MSPC" },
      { name: "MATLAB", context: "Signal processing, simulation, data analysis" },
      { name: "Git", context: "Version control, branching workflows" },
      { name: "Docker", context: "Containerized development and deployment" },
      { name: "Linux", context: "Development environment, scripting, system administration" },
    ],
  },
  {
    name: "Systems Engineering",
    skills: [
      { name: "Requirements Management", context: "Decomposition, traceability, V&V planning" },
      { name: "Satellite AIT", context: "EM/QM/FM test campaigns, flight model integration" },
      { name: "EGSE Design", context: "Automated test infrastructure for hardware validation" },
      { name: "Test Planning", context: "IST, ETB procedures, anomaly resolution" },
    ],
  },
  {
    name: "Lab / Test Equipment",
    skills: [
      { name: "Oscilloscopes", context: "Rigol DS1054Z, signal characterization" },
      { name: "Multimeters & Power Supplies", context: "Bench-level debug and characterization" },
      { name: "Soldering Stations", context: "Hakko FX-888D, hot air rework" },
      { name: "Microfabrication", context: "Cleanroom processes, photolithography, thin-film deposition" },
    ],
  },
];
