import type { ComponentType, CSSProperties, ReactNode } from "react";
import { Art } from "@/components/diagrams/kit";

/*
  DAEMON gallery illustrations. Drawn stand-ins for future screenshots,
  in the kit's line language: hairlines in ink greys, one signal-orange
  subject per board, one slow ambient loop each.
*/

type Tone = "ink" | "ink2" | "muted" | "signal";

const dl = (d: number, dur?: number) => ({ "--d": d, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as CSSProperties;
const MONO: CSSProperties = { fontFamily: "var(--font-mono)" };
const EASE = "0.4 0 0.2 1";
const splines = (n: number) => Array.from({ length: n }, () => EASE).join(";");
const TONE: Record<Tone, string> = {
  ink: "var(--ink)",
  ink2: "var(--ink-2)",
  muted: "var(--ink-3)",
  signal: "var(--signal-ink)",
};

function Fade({ d, children }: { d: number; children: ReactNode }) {
  return (
    <g className="dg-n" style={dl(d)}>
      {children}
    </g>
  );
}

function Draw({ d, at, dur = 900, stroke = "var(--ink-3)", w = 1 }: { d: string; at: number; dur?: number; stroke?: string; w?: number }) {
  return (
    <path
      className="dg-e"
      style={dl(at, dur)}
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Txt({
  x,
  y,
  children,
  size = 10,
  tone = "muted",
  anchor = "start",
  mono = true,
  weight,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  tone?: Tone;
  anchor?: "start" | "middle" | "end";
  mono?: boolean;
  weight?: number;
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={TONE[tone]} textAnchor={anchor} fontWeight={weight} style={mono ? MONO : undefined}>
      {children}
    </text>
  );
}

/** Smooth curve through points (Catmull-Rom as cubic Béziers). */
function smooth(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** A dot that travels an open path, fading at both ends so the restart never jumps. */
function Travel({ path, dur = 10, r = 3.2 }: { path: string; dur?: number; r?: number }) {
  const fade = {
    attributeName: "opacity",
    values: "0;1;1;0",
    keyTimes: "0;0.06;0.9;1",
    dur: `${dur}s`,
    repeatCount: "indefinite",
  };
  return (
    <g className="dg-pulse">
      <g>
        <animate {...fade} />
        <animateMotion
          dur={`${dur}s`}
          repeatCount="indefinite"
          path={path}
          calcMode="spline"
          keyPoints="0;1"
          keyTimes="0;1"
          keySplines="0.45 0 0.35 1"
        />
        <circle r={r * 2.6} fill="var(--signal)" opacity={0.14} />
        <circle r={r} fill="var(--signal)" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 01 Architecture: five agents orbiting a shared knowledge base      */
/* ------------------------------------------------------------------ */

function Architecture() {
  const cx = 200;
  const cy = 146;
  const rx = 142;
  const ry = 48;
  const at = (deg: number): [number, number] => [cx + rx * Math.cos((deg * Math.PI) / 180), cy + ry * Math.sin((deg * Math.PI) / 180)];

  // knowledge base cylinder
  const kx = 152;
  const kw = 96;
  const top = 116;
  const bot = 170;

  const agents: { name: string; a: number; lx: number; ly: number; to: [number, number] }[] = [
    { name: "Scout", a: 216, lx: 0, ly: -14, to: [kx, 128] },
    { name: "Refiner", a: 270, lx: 0, ly: -14, to: [cx, top - 10] },
    { name: "Auditor", a: 324, lx: 0, ly: -14, to: [kx + kw, 128] },
    { name: "Conservative", a: 18, lx: 0, ly: 22, to: [kx + kw, 160] },
    { name: "Monitor", a: 162, lx: 0, ly: 22, to: [kx, 160] },
  ];
  const back = `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
  const front = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
  const ringY = cy + ry;
  const simTop = 234;
  // results travel from the digital twin, through the agents' ring, into the shared store
  const result = `M ${cx} ${simTop} L ${cx} ${bot + 10}`;

  return (
    <Art id="daemon-architecture" label="Five agents around a shared knowledge base; simulation results flow up into the store">
      <Draw d={back} at={100} dur={900} stroke="var(--rule-strong)" />
      <Draw d={front} at={500} dur={900} stroke="var(--ink-3)" />

      {/* spokes: every agent reads and writes the same store */}
      <Fade d={700}>
        {agents.map(({ name, a, to }) => (
          <line
            key={name}
            x1={at(a)[0]}
            y1={at(a)[1]}
            x2={to[0]}
            y2={to[1]}
            stroke="var(--ink-3)"
            strokeWidth={1}
            strokeDasharray="0.1 3.5"
            strokeLinecap="round"
          />
        ))}
      </Fade>

      {/* knowledge base */}
      <Fade d={250}>
        <path
          d={`M ${kx} ${top} L ${kx} ${bot} A ${kw / 2} 10 0 0 0 ${kx + kw} ${bot} L ${kx + kw} ${top}`}
          fill="var(--plate)"
          stroke="var(--ink-2)"
          strokeWidth={1}
        />
        <ellipse cx={kx + kw / 2} cy={top} rx={kw / 2} ry={10} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        <Txt x={cx} y={146} size={10} tone="ink" mono={false} anchor="middle">
          Knowledge base
        </Txt>
        <Txt x={cx} y={159} size={9} anchor="middle">
          SQLite
        </Txt>
      </Fade>

      {/* agents */}
      {agents.map(({ name, a, lx, ly }, i) => {
        const [x, y] = at(a);
        return (
          <Fade key={name} d={600 + i * 90}>
            <circle cx={x} cy={y} r={7} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
            <circle cx={x} cy={y} r={2} fill="var(--ink-2)" />
            <Txt x={x + lx} y={y + ly} size={10} tone="ink" mono={false} anchor="middle">
              {name}
            </Txt>
          </Fade>
        );
      })}

      {/* simulation backend: results land in the knowledge base */}
      <Draw d={result} at={1000} dur={500} stroke="var(--signal)" w={1.25} />
      <Fade d={1300}>
        <circle cx={cx} cy={ringY} r={2.6} fill="var(--signal)" />
        <path d={`M ${cx - 4} ${bot + 16} L ${cx} ${bot + 10} L ${cx + 4} ${bot + 16}`} fill="none" stroke="var(--signal)" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
      </Fade>
      <Fade d={900}>
        <rect x={140.5} y={simTop + 0.5} width={119} height={39} rx={3} fill="var(--plate)" stroke="var(--rule-strong)" />
        <path d="M 150 244 C 176 244, 196 264, 250 264" fill="none" stroke="var(--ink-3)" />
        <path d="M 150 262 C 180 262, 200 248, 250 246" fill="none" stroke="var(--rule-strong)" />
        <Txt x={272} y={250} size={10} tone="ink2" mono={false}>
          Simulation
        </Txt>
        <Txt x={272} y={262} size={9}>
          9-state ODE
        </Txt>
      </Fade>

      <Travel path={result} dur={7} r={3} />
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Discovery cycle: one loop per cycle, tightening to convergence  */
/* ------------------------------------------------------------------ */

const SP = (() => {
  const cx = 200;
  const cy = 156;
  const R0 = 94;
  const turns = 3;
  const Rend = 13;
  const T = turns * 2 * Math.PI;
  const k = Math.log(R0 / Rend) / T;
  const start = -Math.PI / 2; // top, then clockwise
  const r = (t: number) => R0 * Math.exp(-k * t);
  const pt = (t: number): [number, number] => [cx + r(t) * Math.cos(start + t), cy + r(t) * Math.sin(start + t)];
  const n = 300;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const [x, y] = pt((T * i) / n);
    d += `${i ? " L" : "M"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  const [ex, ey] = pt(T);
  d += ` L ${cx} ${cy}`;
  // station ticks where each turn crosses the four station spokes
  const ticks: { x: number; y: number; outer: boolean }[] = [];
  for (let q = 0; q < turns * 4; q++) {
    const [x, y] = pt((q * Math.PI) / 2);
    ticks.push({ x, y, outer: q < 4 });
  }
  return { cx, cy, R0, d, ticks, end: [ex, ey] as [number, number], r };
})();

function DiscoveryCycle() {
  const { cx, cy, d, ticks } = SP;
  const stations = [
    { name: "Propose", x: cx, y: cy - SP.r(0) - 12, anchor: "middle" as const },
    {
      name: "Execute",
      x: cx + SP.r(Math.PI / 2) + 12,
      y: cy + 4,
      anchor: "start" as const,
    },
    {
      name: "Observe",
      x: cx,
      y: cy + SP.r(Math.PI) + 20,
      anchor: "middle" as const,
    },
    {
      name: "Update",
      x: cx - SP.r((3 * Math.PI) / 2) - 12,
      y: cy + 4,
      anchor: "end" as const,
    },
  ];
  return (
    <Art id="daemon-cycle" label="The discovery cycle as a tightening spiral: propose, execute, observe, update, until converged">
      {/* station spokes */}
      <Fade d={100}>
        <line
          x1={cx}
          y1={cy - SP.R0 - 4}
          x2={cx}
          y2={cy + SP.R0 - 18}
          stroke="var(--rule-strong)"
          strokeDasharray="0.1 3.5"
          strokeLinecap="round"
        />
        <line
          x1={cx - SP.R0 + 30}
          y1={cy}
          x2={cx + SP.R0 - 8}
          y2={cy}
          stroke="var(--rule-strong)"
          strokeDasharray="0.1 3.5"
          strokeLinecap="round"
        />
      </Fade>
      <Draw d={d} at={200} dur={1400} stroke="var(--signal)" w={1.25} />
      {ticks.map((t, i) => (
        <Fade key={i} d={300 + i * 70}>
          <circle
            cx={t.x}
            cy={t.y}
            r={t.outer ? 4.5 : 2.6}
            fill="var(--plate)"
            stroke={t.outer ? "var(--ink-2)" : "var(--ink-3)"}
            strokeWidth={1}
          />
        </Fade>
      ))}
      {stations.map((s, i) => (
        <Fade key={s.name} d={400 + i * 100}>
          <Txt x={s.x} y={s.y} size={10.5} tone="ink" mono={false} anchor={s.anchor}>
            {s.name}
          </Txt>
        </Fade>
      ))}
      <Fade d={1400}>
        <rect x={cx - 6} y={cy - 6} width={12} height={12} transform={`rotate(45 ${cx} ${cy})`} fill="var(--signal)" />
        <line x1={cx + 7} y1={cy + 7} x2={268} y2={224} stroke="var(--ink-3)" strokeWidth={0.8} />
        <circle cx={268} cy={224} r={1.6} fill="var(--ink-3)" />
        <Txt x={274} y={234} size={10} tone="signal" mono={false}>
          Converged
        </Txt>
        <Txt x={cx} y={274} size={9} anchor="middle">
          one turn per cycle
        </Txt>
      </Fade>
      <Travel path={d} dur={12} />
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Agent collaboration: review each other, refine one hypothesis   */
/* ------------------------------------------------------------------ */

function Collaboration() {
  const names = ["Scout", "Refiner", "Auditor", "Conservative", "Monitor"];
  const ax = (i: number) => 72 + i * 64;
  const AY = 86;
  const lands = [150, 175, 200, 225, 250];
  const CT = 164; // hypothesis card top
  const link = (i: number) => `M ${ax(i)} ${AY + 8} C ${ax(i)} ${AY + 42}, ${lands[i]} ${CT - 34}, ${lands[i]} ${CT}`;
  // each agent reviews its neighbour: a shallow swag between the two
  const swag = (i: number) => ` Q ${(ax(i) + ax(i + 1)) / 2} ${AY + 16} ${ax(i + 1) - 8} ${AY}`;
  const swags = names.slice(0, -1).map((_, i) => `M ${ax(i) + 8} ${AY}` + swag(i));

  return (
    <Art id="daemon-collab" label="Five agents review each other's conclusions and refine a shared hypothesis">
      {swags.map((a, i) => (
        <Draw key={i} d={a} at={450 + i * 90} dur={450} stroke="var(--ink-3)" />
      ))}
      {names.map((_, i) => (
        <Draw key={i} d={link(i)} at={700 + i * 70} dur={600} stroke="var(--ink-3)" />
      ))}

      {names.map((n, i) => (
        <Fade key={n} d={150 + i * 80}>
          <circle cx={ax(i)} cy={AY} r={8} fill="var(--plate)" stroke="var(--ink-2)" />
          <circle cx={ax(i)} cy={AY} r={2.2} fill="var(--ink-2)" />
          <Txt x={ax(i)} y={AY - 16} size={10} tone="ink" mono={false} anchor="middle">
            {n}
          </Txt>
        </Fade>
      ))}

      {/* refinement stack: earlier versions behind, current in front */}
      <Fade d={900}>
        {[2, 1].map((k) => (
          <rect
            key={k}
            x={120.5 + k * 8}
            y={CT + 0.5 + k * 8}
            width={159}
            height={92}
            rx={3}
            fill="var(--plate)"
            stroke="var(--rule-strong)"
            strokeDasharray="2 3"
          />
        ))}
        <Txt x={304} y={CT + 104} size={9}>
          earlier versions
        </Txt>
      </Fade>
      <Fade d={1050}>
        <rect x={120.5} y={CT + 0.5} width={159} height={92} rx={3} fill="var(--plate)" stroke="var(--ink-2)" />
        <rect x={120} y={CT} width={3} height={93} fill="var(--signal)" />
        <Txt x={134} y={CT + 20} size={10.5} tone="ink" mono={false} weight={600}>
          Hypothesis
        </Txt>
        {[0, 1, 2].map((j) => (
          <rect key={j} x={134} y={CT + 32 + j * 10} width={[128, 112, 84][j]} height={3} rx={1.5} fill="var(--rule-strong)" />
        ))}
        <rect x={134} y={CT + 70} width={132} height={3} rx={1.5} fill="var(--rule)" />
        <Txt x={134} y={CT + 84} size={9}>
          confidence
        </Txt>
      </Fade>
      {/* confidence settles as the agents review the hypothesis */}
      <Fade d={1300}>
        <rect x={134} y={CT + 70} width={78} height={3} rx={1.5} fill="var(--signal)" />
      </Fade>
      <g className="dg-pulse">
        <rect x={134} y={CT + 70} height={3} rx={1.5} fill="var(--signal)" width={78}>
          <animate
            attributeName="width"
            dur="10s"
            repeatCount="indefinite"
            values="78;96;88;104;104;78"
            keyTimes="0;0.25;0.45;0.7;0.9;1"
            calcMode="spline"
            keySplines={splines(5)}
          />
        </rect>
      </g>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 04 Knowledge base: tables around the hypothesis store              */
/* ------------------------------------------------------------------ */

function KnowledgeBase() {
  const tables = ["agents", "experiments", "evidence"];
  const TX = 162;
  const TW = 210;
  const TY = 60;
  const trackX = 252;
  const trackW = 104;
  const px = (p: number) => trackX + trackW * p;
  const rows = [0.94, 0.56, 0.12, 0.72, 0.34, -1];
  const RY = (i: number) => TY + 44 + i * 26;
  const live = RY(5);
  return (
    <Art id="daemon-kb" label="SQLite knowledge base: hypotheses tracked with Bayesian confidence, auto-accept at 0.9 and retire below 0.2">
      {/* related tables */}
      {tables.map((t, i) => {
        const y = 96 + i * 48;
        return (
          <Fade key={t} d={100 + i * 80}>
            <rect x={28.5} y={y + 0.5} width={99} height={34} rx={2} fill="var(--plate)" stroke="var(--rule-strong)" />
            <Txt x={38} y={y + 14} size={9.5} tone="ink2">
              {t}
            </Txt>
            <rect x={38} y={y + 22} width={56} height={2.5} rx={1.25} fill="var(--rule)" />
            <line x1={128} y1={y + 17} x2={144} y2={y + 17} stroke="var(--ink-3)" strokeWidth={0.8} />
          </Fade>
        );
      })}
      <Draw d={`M 144 113 L 144 209 M 144 161 L ${TX} 161`} at={400} dur={600} stroke="var(--ink-3)" w={0.8} />

      {/* hypotheses table */}
      <Fade d={450}>
        <rect x={TX + 0.5} y={TY + 0.5} width={TW - 1} height={200} rx={2} fill="var(--plate)" stroke="var(--ink-2)" />
        <line x1={TX} y1={TY + 24} x2={TX + TW} y2={TY + 24} stroke="var(--rule-strong)" />
        <Txt x={TX + 12} y={TY + 16} size={10} tone="ink">
          hypotheses
        </Txt>
        <Txt x={TX + TW - 12} y={TY + 16} size={9} anchor="end">
          confidence
        </Txt>
      </Fade>
      <Fade d={600}>
        {/* thresholds */}
        <line x1={px(0.2)} y1={TY + 32} x2={px(0.2)} y2={TY + 192} stroke="var(--ink-3)" strokeDasharray="0.1 3" strokeLinecap="round" />
        <line x1={px(0.9)} y1={TY + 32} x2={px(0.9)} y2={TY + 192} stroke="var(--signal)" strokeDasharray="0.1 3" strokeLinecap="round" />
        <Txt x={px(0.2)} y={TY + 216} size={9} anchor="middle">
          {"retire < 0.2"}
        </Txt>
        <Txt x={px(0.9)} y={TY + 216} size={9} tone="signal" anchor="middle">
          {"accept ≥ 0.9"}
        </Txt>
      </Fade>
      {rows.map((p, i) => {
        const y = RY(i);
        const retired = p >= 0 && p < 0.2;
        const accepted = p >= 0.9;
        return (
          <Fade key={i} d={650 + i * 70}>
            <g opacity={retired ? 0.45 : 1}>
              <rect x={TX + 12} y={y - 1.5} width={[62, 48, 56, 40, 60, 52][i]} height={3} rx={1.5} fill="var(--rule-strong)" />
              <line x1={trackX} y1={y} x2={trackX + trackW} y2={y} stroke="var(--rule)" strokeWidth={1} />
              {p >= 0 && (
                <circle
                  cx={px(p)}
                  cy={y}
                  r={3.5}
                  fill={accepted ? "var(--signal)" : "var(--plate)"}
                  stroke={accepted ? "var(--signal)" : "var(--ink-3)"}
                />
              )}
            </g>
          </Fade>
        );
      })}
      {/* a live belief, updating as evidence arrives */}
      <g className="dg-pulse">
        <circle cy={live} r={4} fill="var(--plate)" stroke="var(--signal)" strokeWidth={1.4}>
          <animate
            attributeName="cx"
            dur="10s"
            repeatCount="indefinite"
            values={`${px(0.45)};${px(0.66)};${px(0.58)};${px(0.93)};${px(0.93)};${px(0.45)}`}
            keyTimes="0;0.28;0.44;0.72;0.9;1"
            calcMode="spline"
            keySplines={splines(5)}
          />
        </circle>
      </g>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* UI wireframes (these sit three-up, so no small text at all)        */
/* ------------------------------------------------------------------ */

function Window({ children, d = 0 }: { children?: ReactNode; d?: number }) {
  return (
    <Fade d={d}>
      <rect x={28.5} y={44.5} width={343} height={223} rx={4} fill="var(--plate)" stroke="var(--rule-strong)" />
      <line x1={28} y1={66} x2={372} y2={66} stroke="var(--rule)" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={42 + i * 10} cy={55.5} r={2.6} fill="none" stroke="var(--rule-strong)" />
      ))}
      <rect x={128} y={51} width={144} height={9} rx={4.5} fill="var(--paper)" stroke="var(--rule)" />
      {children}
    </Fade>
  );
}

const bar = (x: number, y: number, w: number, fill = "var(--rule-strong)", h = 4) => (
  <rect x={x} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} />
);

/* 05 Session dashboard */
function Dashboard() {
  const lanes = [
    [12, 30, 70, 88, 140, 196],
    [44, 60, 118, 174, 206],
    [22, 96, 110, 160, 226],
    [6, 74, 132, 150, 188],
    [36, 102, 168, 214],
  ];
  return (
    <Art id="daemon-dashboard" label="Wireframe of the real-time session dashboard: agent activity, hypotheses and convergence">
      <g transform="translate(0 12)">
        <Window>
          {/* sidebar */}
          <line x1={92} y1={66} x2={92} y2={267} stroke="var(--rule)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>{bar(42, 86 + i * 18, i === 0 ? 38 : 30)}</g>
          ))}
        </Window>
        {/* live agent activity */}
        <Fade d={300}>
          <Txt x={106} y={86} size={9.5} tone="ink2" mono={false}>
            Agent activity
          </Txt>
          {["Scout", "Refiner", "Auditor", "Conservative", "Monitor"].map((n, r) => (
            <g key={n}>
              <Txt x={106} y={105 + r * 12} size={9}>
                {n}
              </Txt>
              <line x1={176} y1={102 + r * 12} x2={358} y2={102 + r * 12} stroke="var(--rule)" />
              {lanes[r].map((t) => (
                <rect key={t} x={176 + t * 0.74} y={99 + r * 12} width={9} height={6} rx={1} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
              ))}
            </g>
          ))}
        </Fade>
        {/* hypotheses */}
        <Fade d={500}>
          <rect x={106.5} y={168.5} width={116} height={86} rx={2} fill="none" stroke="var(--rule)" />
          <Txt x={116} y={185} size={9.5} tone="ink2" mono={false}>
            Hypotheses
          </Txt>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              {bar(116, 200 + i * 15, [50, 38, 46, 30][i])}
              <rect x={176} y={198.5 + i * 15} width={36} height={3} rx={1.5} fill="var(--rule)" />
              <rect x={176} y={198.5 + i * 15} width={[32, 20, 26, 10][i]} height={3} rx={1.5} fill="var(--rule-strong)" />
            </g>
          ))}
        </Fade>
        {/* convergence */}
        <Fade d={650}>
          <rect x={234.5} y={168.5} width={124} height={86} rx={2} fill="none" stroke="var(--rule)" />
          <Txt x={244} y={185} size={9.5} tone="ink2" mono={false}>
            Convergence
          </Txt>
          <path d="M 246 244 L 348 244 M 246 196 L 246 244" fill="none" stroke="var(--rule-strong)" />
        </Fade>
        <Draw
          d={smooth([
            [248, 202],
            [268, 215],
            [288, 223],
            [308, 230],
            [328, 234],
            [346, 238],
          ])}
          at={800}
          dur={800}
          stroke="var(--ink-2)"
        />
        {/* the stream is live */}
        <Fade d={900}>
          <circle cx={355} cy={55.5} r={6.5} fill="none" stroke="var(--rule)" />
          <Txt x={343} y={58.5} size={9} anchor="end">
            live
          </Txt>
        </Fade>
        <g className="dg-pulse">
          <circle cx={355} cy={55.5} r={3} fill="var(--signal)">
            <animate
              attributeName="opacity"
              values="1;0.25;1"
              keyTimes="0;0.5;1"
              dur="6s"
              calcMode="spline"
              keySplines={splines(2)}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </Art>
  );
}

/* 06 Hypothesis panel: list, detail, evidence chain */
function HypothesisPanel() {
  const chain = [128, 164, 200, 236];
  const CHAIN_TOP = 111; // under the selected hypothesis' confidence bar
  const path = `M 216 ${CHAIN_TOP} L 216 ${chain[3] - 4}`;
  return (
    <Art id="daemon-hypotheses" label="Wireframe of the hypothesis panel: a selected hypothesis with its confidence and evidence chain">
      <g transform="translate(0 12)">
        <Window>
          <line x1={170} y1={66} x2={170} y2={267} stroke="var(--rule)" />
        </Window>
        {/* list */}
        <Fade d={250}>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 76 + i * 36;
            const sel = i === 1;
            return (
              <g key={i}>
                {sel && <rect x={29} y={y - 4} width={141} height={32} fill="var(--paper)" />}
                {sel && <rect x={29} y={y - 4} width={3} height={32} fill="var(--signal)" />}
                {bar(42, y + 6, [84, 96, 70, 90, 60][i], sel ? "var(--ink-3)" : "var(--rule-strong)")}
                <rect x={42} y={y + 15} width={60} height={3} rx={1.5} fill="none" stroke="var(--rule)" strokeWidth={0.8} />
                <rect
                  x={42}
                  y={y + 15}
                  width={[50, 44, 18, 30, 8][i]}
                  height={3}
                  rx={1.5}
                  fill="var(--rule-strong)"
                />
              </g>
            );
          })}
        </Fade>
        {/* detail */}
        <Fade d={450}>
          {bar(186, 84, 120, "var(--ink-3)", 5)}
          {bar(186, 98, 150)}
          <rect x={186} y={106} width={170} height={5} rx={2.5} fill="var(--rule)" />
          <rect x={186} y={106} width={126} height={5} rx={2.5} fill="var(--rule-strong)" />
        </Fade>
        {/* evidence chain: hypothesis back to the simulation runs that support it */}
        <Draw d={`M 216 ${CHAIN_TOP} L 216 ${chain[3] - 4}`} at={650} dur={700} stroke="var(--signal)" w={1.25} />
        {chain.map((y, i) => (
          <Fade key={y} d={700 + i * 110}>
            <circle cx={216} cy={y} r={4} fill="var(--plate)" stroke="var(--signal)" strokeWidth={1.25} />
            <line x1={220} y1={y} x2={244} y2={y} stroke="var(--rule-strong)" />
            <rect x={244.5} y={y - 11.5} width={112} height={23} rx={2} fill="var(--plate)" stroke="var(--rule-strong)" />
            <path
              d={smooth([
                [252, y + 5],
                [272, y + 3 - (i % 2) * 3],
                [292, y - 2],
                [316, y - 5 + (i % 3)],
                [348, y - 6],
              ])}
              fill="none"
              stroke="var(--ink-3)"
            />
            {bar(186, y, 18)}
          </Fade>
        ))}
        <Travel path={path} dur={8} r={3} />
      </g>
    </Art>
  );
}

/* 07 Experiment log: parameter sets and simulation results */
function ExperimentLog() {
  const rows = 7;
  const RY = (i: number) => 104 + i * 22;
  const trend = [
    [6, 4, 2, 1],
    [1, 3, 5, 6],
    [4, 4, 3, 4],
    [2, 5, 3, 2],
    [6, 5, 2, 2],
    [2, 2, 4, 6],
    [5, 3, 4, 3],
  ];
  const widths = [
    [30, 22, 36],
    [24, 34, 18],
    [36, 16, 28],
    [20, 30, 34],
    [34, 26, 14],
    [26, 18, 30],
    [18, 36, 24],
  ];
  return (
    <Art id="daemon-log" label="Wireframe of the experiment log: one row per simulation run, parameters and result">
      <g transform="translate(0 12)">
        <Window>
          {/* header */}
          <rect x={29} y={67} width={342} height={22} fill="var(--paper)" />
          <line x1={28} y1={89} x2={372} y2={89} stroke="var(--rule-strong)" />
          {bar(44, 78, 14, "var(--ink-3)")}
          {[84, 136, 188].map((x) => (
            <g key={x}>{bar(x, 78, 30, "var(--ink-3)")}</g>
          ))}
          {bar(262, 78, 44, "var(--ink-3)")}
        </Window>
        <Fade d={300}>
          {Array.from({ length: rows }, (_, i) => {
            const y = RY(i);
            const t = trend[i];
            return (
              <g key={i}>
                <line x1={36} y1={y + 11} x2={364} y2={y + 11} stroke="var(--rule)" />
                {bar(44, y, 12)}
                {widths[i].map((w, j) => (
                  <rect key={j} x={84 + j * 52} y={y - 2} width={w} height={4} rx={2} fill="var(--rule-strong)" />
                ))}
                <path d={smooth(t.map((v, k) => [262 + k * 22, y + 4 - v] as [number, number]))} fill="none" stroke="var(--ink-2)" />
                <circle cx={352} cy={y} r={2.6} fill="none" stroke="var(--ink-3)" />
              </g>
            );
          })}
        </Fade>
        {/* a cursor reading down the runs */}
        <g className="dg-pulse">
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              dur="12s"
              repeatCount="indefinite"
              values={Array.from({ length: rows }, (_, i) => `0 ${i * 22}`)
                .flatMap((v) => [v, v])
                .concat("0 0")
                .join(";")}
              keyTimes={Array.from({ length: rows }, (_, i) => [(i / rows) * 0.92, (i / rows) * 0.92 + 0.09])
                .flat()
                .concat(1)
                .map((k) => +k.toFixed(3))
                .join(";")}
              calcMode="spline"
              keySplines={splines(rows * 2)}
            />
            <rect x={29} y={RY(0) - 11} width={342} height={22} fill="var(--signal)" opacity={0.07} />
            <rect x={29} y={RY(0) - 11} width={2.5} height={22} fill="var(--signal)" />
          </g>
        </g>
      </g>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 08 Session results: each hypothesis' confidence over the session   */
/* ------------------------------------------------------------------ */

function SessionResults() {
  const X0 = 58;
  const X1 = 350;
  const y = (v: number) => 252 - v * 184;
  const cx = (u: number) => X0 + (X1 - X0) * u;
  const P = (pts: [number, number][]) => pts.map(([u, v]) => [cx(u), y(v)] as [number, number]);
  const winner = P([
    [0, 0.5],
    [0.12, 0.56],
    [0.24, 0.51],
    [0.37, 0.63],
    [0.5, 0.7],
    [0.63, 0.77],
    [0.76, 0.84],
    [0.9, 0.93],
  ]);
  const others: { pts: [number, number][]; retired: boolean }[] = [
    {
      pts: P([
        [0, 0.5],
        [0.14, 0.43],
        [0.28, 0.36],
        [0.42, 0.27],
        [0.54, 0.18],
      ]),
      retired: true,
    },
    {
      pts: P([
        [0.14, 0.5],
        [0.28, 0.58],
        [0.42, 0.62],
        [0.56, 0.55],
        [0.7, 0.6],
        [0.84, 0.54],
        [0.95, 0.57],
      ]),
      retired: false,
    },
  ];
  const wPath = smooth(winner);
  const last = winner[winner.length - 1];
  return (
    <Art id="daemon-session" label="How hypothesis confidence is tracked over a session: accepted above 0.9, retired below 0.2">
      <Fade d={100}>
        <path d={`M ${X0} ${y(1)} L ${X0} ${y(0)} L ${X1 + 14} ${y(0)}`} fill="none" stroke="var(--ink-3)" />
        {[0.12, 0.24, 0.37, 0.5, 0.63, 0.76, 0.9].map((u) => (
          <line key={u} x1={cx(u)} y1={y(0)} x2={cx(u)} y2={y(0) + 4} stroke="var(--ink-3)" />
        ))}
        <Txt x={X0} y={y(1) - 10} size={9.5}>
          confidence
        </Txt>
        <Txt x={X1 + 14} y={y(0) + 18} size={9.5} anchor="end">
          cycles
        </Txt>
      </Fade>
      <Fade d={250}>
        <line x1={X0} y1={y(0.9)} x2={X1 + 14} y2={y(0.9)} stroke="var(--signal)" strokeDasharray="0.1 3" strokeLinecap="round" />
        <line x1={X0} y1={y(0.2)} x2={X1 + 14} y2={y(0.2)} stroke="var(--ink-3)" strokeDasharray="0.1 3" strokeLinecap="round" />
        <Txt x={X0 + 6} y={y(0.9) - 6} size={9} tone="signal">
          {"accept ≥ 0.9"}
        </Txt>
        <Txt x={X0 + 6} y={y(0.2) + 13} size={9}>
          {"retire < 0.2"}
        </Txt>
      </Fade>
      {others.map((o, i) => {
        const e = o.pts[o.pts.length - 1];
        return (
          <g key={i}>
            <Draw d={smooth(o.pts)} at={400 + i * 120} dur={900} stroke="var(--ink-3)" />
            <Fade d={1200 + i * 60}>
              {/* a hypothesis proposed mid-session enters where it was proposed */}
              {o.pts[0][0] > X0 && <circle cx={o.pts[0][0]} cy={o.pts[0][1]} r={2.2} fill="var(--plate)" stroke="var(--ink-3)" />}
              {o.retired ? (
                <path
                  d={`M ${e[0] - 3} ${e[1] - 3} L ${e[0] + 3} ${e[1] + 3} M ${e[0] + 3} ${e[1] - 3} L ${e[0] - 3} ${e[1] + 3}`}
                  stroke="var(--ink-2)"
                />
              ) : (
                <circle cx={e[0]} cy={e[1]} r={2.2} fill="var(--ink-3)" />
              )}
            </Fade>
          </g>
        );
      })}
      <Draw d={wPath} at={500} dur={1100} stroke="var(--signal)" w={1.5} />
      {winner.slice(0, -1).map(([x, yy], i) => (
        <Fade key={i} d={700 + i * 90}>
          <circle cx={x} cy={yy} r={2.4} fill="var(--plate)" stroke="var(--signal)" strokeWidth={1.2} />
        </Fade>
      ))}
      <Fade d={1500}>
        <circle cx={last[0]} cy={last[1]} r={4} fill="var(--signal)" />
      </Fade>
      <Travel path={wPath} dur={9} r={3} />
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 09 Convergence: a per-cycle metric settling until the loop stops   */
/* ------------------------------------------------------------------ */

function Convergence() {
  const n = 12;
  const B = 222;
  const H = 150;
  const X0 = 58;
  const cx = (i: number) => X0 + 16 + i * 24;
  const v = (i: number) => 0.14 + 0.78 * Math.exp(-i / 3.6);
  const pts = Array.from({ length: n }, (_, i) => [cx(i), B - v(i) * H] as [number, number]);
  const curve = smooth(pts);
  const QY = B + 22;
  const last = n - 1;
  const sweep = cx(last) - cx(0);
  const diamond = (x: number, r: number) => `M ${x} ${QY - r} L ${x + r} ${QY} L ${x} ${QY + r} L ${x - r} ${QY} Z`;
  return (
    <Art id="daemon-convergence" label="Convergence metrics per discovery cycle, with the converged check run at the end of every cycle">
      <Fade d={100}>
        <path d={`M ${X0} ${B - H - 10} L ${X0} ${B} L ${cx(last) + 14} ${B}`} fill="none" stroke="var(--ink-3)" />
        {pts.map(([x], i) => (
          <line key={i} x1={x} y1={B} x2={x} y2={B + 4} stroke="var(--ink-3)" />
        ))}
        <Txt x={X0} y={B - H - 20} size={9.5}>
          convergence metrics
        </Txt>
      </Fade>
      <Draw d={curve} at={300} dur={1100} stroke="var(--ink-2)" w={1.2} />
      {pts.map(([x, y], i) => (
        <Fade key={i} d={350 + i * 70}>
          <circle cx={x} cy={y} r={2.3} fill="var(--plate)" stroke="var(--ink-2)" />
        </Fade>
      ))}
      {/* the converged? check closes every cycle; the loop ends on the first yes */}
      {pts.map(([x], i) => (
        <Fade key={"q" + i} d={500 + i * 70}>
          <path
            d={diamond(x, i === last ? 5.5 : 3.6)}
            fill={i === last ? "var(--signal)" : "var(--plate)"}
            stroke={i === last ? "var(--signal)" : "var(--ink-3)"}
          />
        </Fade>
      ))}
      <Fade d={1400}>
        <Txt x={cx(0) - 12} y={QY + 22} size={9}>
          converged? checked every cycle
        </Txt>
        <Txt x={cx(last) + 12} y={QY + 4} size={10} tone="signal" mono={false}>
          Yes
        </Txt>
        <Txt x={cx(last) + 20} y={B + 3.5} size={9.5}>
          cycles
        </Txt>
      </Fade>
      {/* a cursor reading across the cycles, resting at convergence */}
      <g className="dg-pulse">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="11s"
            repeatCount="indefinite"
            values={`0 0;${sweep} 0;${sweep} 0;0 0`}
            keyTimes="0;0.62;0.86;1"
            calcMode="spline"
            keySplines={splines(3)}
          />
          <line x1={cx(0)} y1={B - H - 10} x2={cx(0)} y2={QY - 6} stroke="var(--signal)" strokeWidth={0.9} />
        </g>
      </g>
    </Art>
  );
}

/** Gallery illustrations for daemon, keyed by the MDX `art` id. */
export const art: Record<string, ComponentType> = {
  "daemon/architecture": Architecture,
  "daemon/cycle": DiscoveryCycle,
  "daemon/collaboration": Collaboration,
  "daemon/knowledge-base": KnowledgeBase,
  "daemon/dashboard": Dashboard,
  "daemon/hypotheses": HypothesisPanel,
  "daemon/experiment-log": ExperimentLog,
  "daemon/session": SessionResults,
  "daemon/convergence": Convergence,
};
