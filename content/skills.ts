export type SkillDomain = {
  name: string;
  skills: {
    name: string;
    context?: string;
  }[];
};

export const skillDomains: SkillDomain[] = [
  {
    name: "Systems Engineering",
    skills: [
      { name: "Requirements Management", context: "Decomposition, traceability, V&V planning" },
      { name: "System Integration", context: "Cross-discipline interface management, satellite AIT" },
      { name: "Test Planning", context: "IST, ETB procedures, acceptance criteria, anomaly resolution" },
      { name: "EGSE Design", context: "Automated test infrastructure for hardware validation" },
    ],
  },
  {
    name: "Test & Validation",
    skills: [
      { name: "Functional / Environmental Testing", context: "Electrical, thermal, mechanical domains" },
      { name: "Root Cause Analysis", context: "System-level anomaly diagnosis and corrective actions" },
      { name: "Test Automation", context: "Python-based DAQ pipelines, SPC, automated anomaly detection" },
      { name: "Test Fixture Development", context: "Custom jigs, EGSE stations, instrumentation setups" },
    ],
  },
  {
    name: "Electronics & Hardware",
    skills: [
      { name: "Circuit Design", context: "Analog front ends, power distribution, sensor interfaces" },
      { name: "PCB Layout", context: "4-layer boards, KiCad, schematic capture through fabrication" },
      { name: "Soldering & Assembly", context: "SMD rework, through-hole, reflow, PCB bring-up" },
      { name: "Embedded Sensors", context: "Electrochemical, optical, temperature, pressure" },
    ],
  },
  {
    name: "Mechanical Design & Fabrication",
    skills: [
      { name: "SolidWorks", context: "Assemblies, GD&T, drawings for fabrication" },
      { name: "Fusion360 / AutoCAD", context: "Rapid prototyping, parametric design, 2D drafting" },
      { name: "3D Printing / CNC", context: "FDM, SLA prototyping, fixture and enclosure fabrication" },
      { name: "Cleanroom Fabrication", context: "Thin-film deposition, photolithography, wet/dry etching" },
    ],
  },
  {
    name: "Software & Automation",
    skills: [
      { name: "Python", context: "Data pipelines, test automation, process modeling, GUI applications" },
      { name: "C/C++", context: "MCU firmware, STM32, ESP32, real-time data acquisition" },
      { name: "MATLAB", context: "Signal processing, simulation, data analysis" },
      { name: "Git / Linux / Docker", context: "Version control, scripting, containerized deployment" },
    ],
  },
  {
    name: "Instrumentation & Lab Equipment",
    skills: [
      { name: "Oscilloscopes & DMMs", context: "Signal characterization, bench-level debug" },
      { name: "Power Supplies & Electronic Loads", context: "Hardware validation, stress testing" },
      { name: "DAQ Systems", context: "Multi-channel data acquisition, sensor interfaces" },
      { name: "Communication Protocols", context: "SPI, I2C, UART, CAN, Ethernet" },
    ],
  },
];
