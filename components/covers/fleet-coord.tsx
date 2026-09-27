import { Art } from "@/components/diagrams/kit";
import { G1Side } from "@/components/illustrations/fleet-coord";

/*
  Two G1s lifting one box together. The only link between them is
  what a person could also hear or feel: a spoken cue crossing over
  the load, and the load itself.
*/

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

const FLOOR = 246;
const S = 1.5;
const AX = 116;
const BX = 284;
const HY = FLOOR - 62 * S;
const HA = AX + 24 * S;
const HB = BX - 24 * S;
const MOUTH = FLOOR - 96 * S;
// from A's face to B's face (head half-width is 7·S)
const cue = `M ${AX + 11} ${MOUTH} Q 200 ${MOUTH - 78} ${BX - 11} ${MOUTH}`;

export default function Cover() {
  return (
    <Art id="cover-fleet-coord" label="Two humanoid robots lifting a shared box, coordinating by a spoken cue">
      {/* ground */}
      <g className="dg-n" style={d(0)}>
        <line x1={52} y1={FLOOR} x2={348} y2={FLOOR} stroke="var(--ink-3)" />
        {Array.from({ length: 25 }, (_, i) => (
          <line key={i} x1={56 + i * 12} y1={FLOOR + 1} x2={50 + i * 12} y2={FLOOR + 7} stroke="var(--rule-strong)" strokeWidth={0.8} />
        ))}
      </g>

      <g className="dg-n" style={d(150)}>
        <G1Side x={AX} floor={FLOOR} s={S} dir={1} />
        <G1Side x={BX} floor={FLOOR} s={S} dir={-1} />
      </g>

      {/* the shared load */}
      <g className="dg-n" style={d(450)}>
        <rect x={HA + 0.5} y={HY - 18.5} width={HB - HA - 1} height={37} rx={2} fill="var(--plate)" stroke="var(--ink-2)" />
        <line x1={HA + 6} y1={HY - 12} x2={HB - 6} y2={HY - 12} stroke="var(--rule-strong)" />
        {[HA, HB].map((x) => (
          <circle key={x} cx={x} cy={HY} r={2.6} fill="var(--plate)" stroke="var(--ink-2)" />
        ))}
      </g>

      {/* the cue: spoken by A, heard by B */}
      <path
        className="dg-e"
        style={{ ...d(700), "--dur": "900ms" } as React.CSSProperties}
        d={cue}
        pathLength={1}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1.25}
        strokeLinecap="round"
      />
      <g className="dg-n" style={d(600)}>
        {[7, 13, 19].map((k, i) => (
          <path
            key={k}
            d={`M ${AX + 10 + k * 0.35} ${MOUTH - k * 0.8} Q ${AX + 10 + k} ${MOUTH} ${AX + 10 + k * 0.35} ${MOUTH + k * 0.8}`}
            fill="none"
            stroke="var(--signal)"
            strokeLinecap="round"
            opacity={1 - i * 0.3}
          />
        ))}
      </g>
      <text
        className="dg-n"
        style={{ ...d(1100), fontFamily: "var(--font-mono)" }}
        x={200}
        y={MOUTH - 50}
        fontSize={12}
        textAnchor="middle"
        fill="var(--signal-ink)"
      >
        lift
      </text>

      {/* a wavefront crossing from speaker to listener */}
      <g className="dg-pulse">
        <g>
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path={cue}
            rotate="auto"
            calcMode="spline"
            keyPoints="0;1"
            keyTimes="0;1"
            keySplines="0.45 0 0.35 1"
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="6s" repeatCount="indefinite" />
          {[0, 5].map((o) => (
            <path
              key={o}
              d={`M ${o - 2} -6 Q ${o + 3} 0 ${o - 2} 6`}
              fill="none"
              stroke="var(--signal)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>
    </Art>
  );
}
