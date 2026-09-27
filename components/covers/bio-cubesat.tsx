import type { CSSProperties } from "react";
import { Art } from "@/components/diagrams/kit";

/*
  One well, magnified: the three electrodes (pH, pNa, reference) around
  the optical path, yeast cells in suspension, and the 27-well card it
  comes from. The cells drift slowly; that is the one ambient motion.
*/

const dd = (d: number, dur?: number) => ({ "--d": d, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as CSSProperties;
const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const EASE = "0.4 0 0.2 1";

const CX = 150,
  CY = 152,
  R = 100;

const pads = [
  { a: -90, name: "pH", dx: 8, dy: 4, anchor: "start" as const },
  { a: 150, name: "pNa", dx: -2, dy: 16, anchor: "start" as const },
  { a: 30, name: "Ref", dx: 2, dy: 16, anchor: "end" as const },
];

// yeast cells: [dx, dy, rotation, budding]
const cells: [number, number, number, boolean][] = [
  [-30, -18, 20, true],
  [-10, 6, -35, false],
  [12, -12, 60, false],
  [30, 12, 10, true],
  [-4, 32, 80, false],
  [32, -30, -20, false],
  [-44, 2, 45, false],
  [18, 40, -60, true],
  [-24, -42, 0, false],
  [-26, 24, -15, false],
];

export default function Cover() {
  const rad = (d: number) => (d * Math.PI) / 180;
  const live = { x: 270, y: 150 };
  const tan = [-38, 38].map((a) => [CX + R * Math.cos(rad(a)), CY + R * Math.sin(rad(a))]);
  return (
    <Art id="cover-bio-cubesat" label="One well of the 27-well sensor card, magnified: pH, pNa and reference electrodes around the optical path, with yeast cells in suspension">
      {/* the well */}
      <g className="dg-n" style={dd(0)}>
        <circle cx={CX} cy={CY} r={R} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        <circle cx={CX} cy={CY} r={R - 7} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
      </g>

      {/* electrodes and their leads */}
      {pads.map((p, i) => {
        const c = Math.cos(rad(p.a)),
          s = Math.sin(rad(p.a));
        const px = CX + 58 * c,
          py = CY + 58 * s;
        const ex = CX + 114 * c,
          ey = CY + 114 * s;
        return (
          <g key={p.name}>
            <path
              className="dg-e"
              style={dd(250 + i * 90, 600)}
              d={`M ${px + 13 * c} ${py + 13 * s} L ${ex} ${ey}`}
              pathLength={1}
              stroke="var(--ink-2)"
              strokeWidth={1.4}
              fill="none"
            />
            <g className="dg-n" style={dd(200 + i * 90)}>
              <circle cx={px} cy={py} r={13} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
              <circle cx={px} cy={py} r={8} fill="var(--ink-3)" opacity={0.55} />
              <rect x={ex - 3} y={ey - 3} width={6} height={6} fill="var(--ink-2)" />
            </g>
            <text
              className="dg-n"
              style={{ ...dd(700 + i * 60), ...mono }}
              x={p.anchor === "start" ? ex + p.dx : ex + p.dx}
              y={ey + p.dy}
              fontSize={10}
              fill="var(--ink-2)"
              textAnchor={p.anchor}
            >
              {p.name}
            </text>
          </g>
        );
      })}

      {/* optical path through the well */}
      <g className="dg-n" style={dd(500)}>
        <circle cx={CX} cy={CY} r={24} fill="var(--signal)" opacity={0.08} />
        <circle cx={CX} cy={CY} r={24} fill="none" stroke="var(--signal)" strokeWidth={1.3} />
        <path d={`M ${CX - 30} ${CY} H ${CX - 26} M ${CX + 26} ${CY} H ${CX + 30} M ${CX} ${CY - 30} V ${CY - 26} M ${CX} ${CY + 26} V ${CY + 30}`} stroke="var(--signal)" strokeWidth={1} />
      </g>

      {/* yeast in suspension, drifting */}
      <g className="dg-n" style={dd(650)}>
        <g>
          {cells.map(([dx, dy, rot, bud], i) => (
            <g key={i} transform={`translate(${CX + dx} ${CY + dy}) rotate(${rot})`}>
              {bud && <circle cx={7.6} cy={0} r={2.8} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.8} />}
              <ellipse rx={6} ry={4.6} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
              <circle cx={-1.4} cy={0.6} r={1.2} fill="var(--ink-3)" />
            </g>
          ))}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;3 -2;1 3;-2 1;0 0"
            keyTimes="0;0.25;0.5;0.75;1"
            calcMode="spline"
            keySplines={`${EASE};${EASE};${EASE};${EASE}`}
            dur="14s"
            repeatCount="indefinite"
          />
        </g>
      </g>

      {/* the 27-well card, one well live */}
      <g className="dg-n" style={dd(750)}>
        <rect x={256.5} y={108.5} width={119} height={83} rx={3} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        {Array.from({ length: 3 }, (_, r) =>
          Array.from({ length: 9 }, (_, c) => {
            const on = r === 1 && c === 0;
            return (
              <circle
                key={`${r}-${c}`}
                cx={live.x + c * 12}
                cy={128 + r * 22}
                r={4}
                fill={on ? "var(--signal)" : "var(--plate)"}
                stroke={on ? "var(--signal)" : "var(--ink-3)"}
                strokeWidth={0.8}
              />
            );
          }),
        )}
      </g>
      {/* magnifier lines from the live well on the card to the big well */}
      <g className="dg-n" style={dd(900)}>
        {tan.map(([x, y]) => {
          const th = Math.atan2(y - live.y, x - live.x);
          return (
            <line
              key={y}
              x1={live.x + 4.6 * Math.cos(th)}
              y1={live.y + 4.6 * Math.sin(th)}
              x2={x}
              y2={y}
              stroke="var(--ink-3)"
              strokeWidth={0.7}
              strokeDasharray="1.5 2.5"
            />
          );
        })}
      </g>

      <text className="dg-n" style={{ ...dd(1000), ...mono }} x={256} y={98} fontSize={10} fill="var(--ink-3)">
        27 wells
      </text>
      <text className="dg-n" style={{ ...dd(1050), ...mono }} x={376} y={210} fontSize={10} fill="var(--ink-3)" textAnchor="end">
        81 electrodes
      </text>
    </Art>
  );
}
