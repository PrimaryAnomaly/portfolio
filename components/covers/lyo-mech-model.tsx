import { Art } from "@/components/diagrams/kit";

const stroke = { stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };

/* Freeze-drying cycle: shelf temperature and chamber pressure over three phases */
export default function Cover() {
  const x0 = 60;
  const x1 = 350;
  const phases = [60, 130, 270, 350];
  const temp = "M 60 110 L 80 110 L 100 200 L 130 200 L 150 150 L 270 150 L 290 96 L 350 96";
  const press = "M 60 80 L 130 80 L 138 230 L 270 230 L 278 238 L 350 238";
  return (
    <Art id="cover-lyo-mech-model" label="Freeze-drying cycle">
      <line x1={x0} y1="250" x2={x1} y2="250" {...stroke} stroke="var(--ink-2)" />
      <line x1={x0} y1="60" x2={x0} y2="250" {...stroke} stroke="var(--ink-2)" />
      {phases.slice(1, 3).map((x) => (
        <line key={x} x1={x} y1="60" x2={x} y2="250" {...stroke} strokeDasharray="2 4" />
      ))}
      <path d={press} {...stroke} strokeDasharray="4 3" />
      <path d={temp} {...stroke} stroke="var(--signal)" strokeWidth={1.5} />
      {["Freezing", "Primary drying", "Secondary"].map((label, i) => (
        <text
          key={label}
          x={(phases[i] + phases[i + 1]) / 2}
          y="268"
          textAnchor="middle"
          className="mono"
          fontSize="8"
          fill="currentColor"
        >
          {label}
        </text>
      ))}
    </Art>
  );
}
