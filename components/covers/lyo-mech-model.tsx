import { Art } from "@/components/diagrams/kit";

/*
  One freeze-drying cycle across its four phases. Shelf temperature
  (signal) and chamber pressure (ink) are qualitative shapes, no scale.
  Ambient: a cursor sweeps the cycle at constant speed while a dot
  rides the temperature curve, then fades and starts over.
*/

type Pt = [number, number];

const X0 = 40;
const X1 = 360;
const TOP = 50;
const BASE = 214;

// Phase boundaries: freeze, anneal, primary drying, secondary drying
const bounds = [X0, 120, 170, 288, X1];
const phaseNames = ["Freeze", "Anneal", "Primary", "Secondary"];

const temp: Pt[] = [
  [40, 116],
  [58, 182],
  [120, 182],
  [128, 146],
  [152, 146],
  [164, 182],
  [180, 182],
  [200, 126],
  [288, 126],
  [304, 86],
  [360, 86],
];
const press: Pt[] = [
  [40, 62],
  [176, 62],
  [186, 202],
  [292, 202],
  [300, 208],
  [360, 208],
];

const line = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");

// Keep the dot under the cursor: motion is linear in x, so each vertex's
// time is its x fraction, and its point is its arc-length fraction.
const SWEEP = 0.86; // share of the cycle spent sweeping; the rest is a rest
const DUR = 12;
const lens = temp.map((p, i) => (i ? Math.hypot(p[0] - temp[i - 1][0], p[1] - temp[i - 1][1]) : 0));
const total = lens.reduce((a, b) => a + b, 0);
let run = 0;
const kp = lens.map((l) => (run += l) / total);
const kt = temp.map(([x]) => ((x - X0) / (X1 - X0)) * SWEEP);
const f = (n: number) => n.toFixed(4);
const keyPoints = [...kp, 1].map(f).join(";");
const keyTimes = [...kt, 1].map(f).join(";");

const del = (d: number, dur?: number) => ({ "--d": d, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" };

export default function Cover() {
  return (
    <Art id="cover-lyo-mech-model" label="Freeze-drying cycle: shelf temperature and chamber pressure across freeze, anneal, primary and secondary drying">
      {/* phase dividers */}
      {bounds.slice(1, -1).map((x, i) => (
        <line
          key={x}
          className="dg-n"
          style={del(100 + i * 60)}
          x1={x}
          y1={TOP}
          x2={x}
          y2={BASE + 18}
          stroke="var(--rule-strong)"
          strokeWidth={0.8}
          strokeDasharray="1 3"
        />
      ))}

      {/* chamber pressure */}
      <path
        className="dg-e"
        style={del(200, 1000)}
        d={line(press)}
        pathLength={1}
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <text className="dg-n" style={{ ...del(700), ...mono }} x={X0} y={54} fontSize={9.5} fill="var(--ink-3)">
        chamber pressure
      </text>

      {/* shelf temperature */}
      <path
        className="dg-e"
        style={del(350, 1150)}
        d={line(temp)}
        pathLength={1}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text className="dg-n" style={{ ...del(1100), ...mono }} x={X1} y={76} fontSize={9.5} textAnchor="end" fill="var(--signal-ink)">
        shelf temperature
      </text>

      {/* phase bar */}
      {phaseNames.map((name, i) => {
        const x = bounds[i] + (i ? 2 : 0);
        const w = bounds[i + 1] - bounds[i] - (i ? 2 : 0) - (i < 3 ? 2 : 0);
        return (
          <g key={name} className="dg-n" style={del(500 + i * 90)}>
            <rect x={x} y={BASE + 12} width={w} height={2} fill="var(--ink-3)" />
            <text x={x} y={BASE + 32} fontSize={9.5} fill="var(--ink-2)" style={mono}>
              {name}
            </text>
          </g>
        );
      })}

      {/* ambient: sweep cursor with a dot riding the temperature */}
      <g className="dg-pulse">
        <g>
          <animate
            attributeName="opacity"
            dur={`${DUR}s`}
            repeatCount="indefinite"
            values="0;1;1;0;0"
            keyTimes={`0;0.05;${SWEEP - 0.04};${SWEEP};1`}
          />
          <line x1={X0} y1={TOP} x2={X0} y2={BASE + 18} stroke="var(--ink-2)" strokeWidth={0.8}>
            <animateTransform
              attributeName="transform"
              type="translate"
              dur={`${DUR}s`}
              repeatCount="indefinite"
              values={`0 0;${X1 - X0} 0;${X1 - X0} 0`}
              keyTimes={`0;${SWEEP};1`}
            />
          </line>
          <circle r={7} fill="var(--signal)" opacity={0.16}>
            <animateMotion
              dur={`${DUR}s`}
              repeatCount="indefinite"
              path={line(temp)}
              keyPoints={keyPoints}
              keyTimes={keyTimes}
              calcMode="linear"
            />
          </circle>
          <circle r={3} fill="var(--signal)">
            <animateMotion
              dur={`${DUR}s`}
              repeatCount="indefinite"
              path={line(temp)}
              keyPoints={keyPoints}
              keyTimes={keyTimes}
              calcMode="linear"
            />
          </circle>
        </g>
      </g>
    </Art>
  );
}
