import { Art, Pulse } from "@/components/diagrams/kit";

/*
  The discovery cycle as one closed loop: propose, execute, observe,
  update, with the five agents working inside it and a single exit
  once the run has converged.
*/

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

const L = 132;
const R = 268;
const T = 94;
const B = 206;
const r = (B - T) / 2;
const CY = (T + B) / 2;
const loop = `M ${L} ${T} L ${R} ${T} A ${r} ${r} 0 0 1 ${R} ${B} L ${L} ${B} A ${r} ${r} 0 0 1 ${L} ${T} Z`;
const apex = R + r;
const exitX = apex + 30;

const stations = [
  { name: "Propose", x: 152, y: T, ly: T - 14 },
  { name: "Execute", x: 248, y: T, ly: T - 14 },
  { name: "Observe", x: 248, y: B, ly: B + 24 },
  { name: "Update", x: 152, y: B, ly: B + 24 },
];

export default function Cover() {
  return (
    <Art id="cover-daemon" label="The DAEMON discovery cycle: five agents inside a propose, execute, observe, update loop that exits when converged">
      <path
        className="dg-e"
        style={{ ...d(150), "--dur": "1300ms" } as React.CSSProperties}
        d={loop}
        pathLength={1}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* exit */}
      <g className="dg-n" style={d(1100)}>
        <line x1={apex} y1={CY} x2={exitX - 9} y2={CY} stroke="var(--signal)" strokeWidth={1.5} />
        <rect x={exitX - 7} y={CY - 7} width={14} height={14} transform={`rotate(45 ${exitX} ${CY})`} fill="var(--signal)" />
        <text x={exitX} y={CY + 30} fontSize={11} textAnchor="middle" fill="var(--signal-ink)">
          Converged
        </text>
      </g>

      {stations.map((s, i) => (
        <g key={s.name} className="dg-n" style={d(400 + i * 120)}>
          <circle cx={s.x} cy={s.y} r={6} fill="var(--plate)" stroke="var(--signal)" strokeWidth={1.5} />
          <circle cx={s.x} cy={s.y} r={2.2} fill="var(--signal)" />
          <text x={s.x} y={s.ly} fontSize={12} textAnchor="middle" fill="var(--ink)">
            {s.name}
          </text>
        </g>
      ))}

      {/* five agents, independent beliefs, one shared loop */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 152 + i * 24;
        return (
          <g key={i} className="dg-n" style={d(700 + i * 70)}>
            <circle cx={x} cy={CY} r={8} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
            <circle cx={x} cy={CY} r={2.4} fill="var(--ink-2)" />
          </g>
        );
      })}
      <text className="dg-n" style={{ ...d(1000), fontFamily: "var(--font-mono)" }} x={200} y={CY + 26} fontSize={9.5} textAnchor="middle" fill="var(--ink-3)">
        five agents
      </text>

      <Pulse path={loop} dur={9} r={3.2} />
    </Art>
  );
}
