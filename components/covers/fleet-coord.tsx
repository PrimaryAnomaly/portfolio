import { Art } from "@/components/diagrams/kit";

const stroke = { stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };

/* Two agents sharing a load, cue waves between them */
export default function Cover() {
  return (
    <Art id="cover-fleet-coord" label="Two robots sharing a load">
      <line x1="120" y1="150" x2="280" y2="150" stroke="var(--ink-2)" strokeWidth="6" strokeLinecap="round" opacity="0.18" />
      <line x1="120" y1="150" x2="280" y2="150" {...stroke} stroke="var(--ink-2)" />
      {[120, 280].map((x) => (
        <g key={x}>
          <circle cx={x} cy="150" r="22" {...stroke} stroke="var(--ink-2)" />
          <circle cx={x} cy="150" r="3" fill="var(--ink-2)" />
          <line x1={x} y1="172" x2={x} y2="206" {...stroke} />
          <path d={`M ${x - 5} 200 L ${x} 208 L ${x + 5} 200`} {...stroke} />
        </g>
      ))}
      {[1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M ${150 - i * 8} ${126 - i * 4} Q 200 ${104 - i * 16} ${250 + i * 8} ${126 - i * 4}`}
          {...stroke}
          stroke={i === 1 ? "var(--signal)" : "currentColor"}
          opacity={1 - i * 0.18}
        />
      ))}
      <text x="200" y="236" textAnchor="middle" className="mono" fontSize="8" fill="currentColor">
        no central controller
      </text>
    </Art>
  );
}
