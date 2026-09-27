import type { ComponentType, CSSProperties, ReactNode } from "react";
import { Art } from "@/components/diagrams/kit";

/*
  Fleet-Coord gallery illustrations: two simulated Unitree G1s, the
  reward components, the four layers, and the speech channel. Drawing-
  sheet line work; signal orange marks the one thing in each board.
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
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  tone?: Tone;
  anchor?: "start" | "middle" | "end";
  mono?: boolean;
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={TONE[tone]} textAnchor={anchor} style={mono ? MONO : undefined}>
      {children}
    </text>
  );
}

/**
 * A G1 humanoid in side elevation, feet on the floor at (x, floor),
 * facing +x (dir 1) or -x (dir -1), `s` = height / 100. Arms reach
 * forward to a hand at (x + 24·s·dir, floor - 62·s).
 */
export function G1Side({ x, floor, s = 1, dir = 1 }: { x: number; floor: number; s?: number; dir?: 1 | -1 }) {
  const ln = {
    fill: "none",
    stroke: "var(--ink-2)",
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
    strokeLinecap: "round" as const,
  };
  const part = { fill: "var(--plate)", stroke: "var(--ink-2)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  const joint = (cx: number, cy: number, r = 2) => <circle cx={cx} cy={cy} r={r} {...part} />;
  // a limb: an outlined capsule along a polyline (outer stroke, then plate core)
  const limb = (d: string, w: number, edge = "var(--ink-2)") => (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={edge} strokeWidth={w} />
      <path d={d} stroke="var(--plate)" strokeWidth={w - 1.5 / s} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${floor}) scale(${dir * s} ${s})`}>
      {/* far leg, set back */}
      {limb("M -3 -49 L -1 -27 L -3 -5", 5.5, "var(--ink-3)")}
      {/* near leg */}
      {limb("M 0 -49 L 5 -27 L 0 -5", 6)}
      <rect x={-6} y={-3.5} width={18} height={3.5} rx={1.5} {...part} />
      {joint(5, -27)}
      {joint(0, -5, 1.6)}
      {/* pelvis, torso, head */}
      <rect x={-9} y={-56} width={18} height={10} rx={3} {...part} />
      {joint(0, -49)}
      <rect x={-11} y={-87} width={22} height={32} rx={5} {...part} />
      <line x1={0} y1={-87} x2={0} y2={-90} {...ln} />
      <rect x={-7} y={-103} width={14} height={13} rx={5} {...part} />
      <path d="M 4 -100 Q 8 -96.5 4 -93" {...ln} />
      {/* arm, reaching forward to the load */}
      {limb("M 2 -80 L 11 -66 L 23 -62", 4.5)}
      {joint(2, -80)}
      {joint(11, -66, 1.6)}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 01 Scene: two G1s placed symmetrically about a shared object       */
/* ------------------------------------------------------------------ */

function Scene() {
  // elevation
  const floor = 160;
  const s = 1.02;
  const ax = 140;
  const bx = 260;
  const hy = floor - 62 * s;
  const hA = ax + 24 * s;
  const hB = bx - 24 * s;
  // plan
  const py = 226;
  const pr = (x: number, dir: 1 | -1) => (
    <g>
      <rect x={x - 7.5} y={py - 17.5} width={15} height={35} rx={7.5} fill="var(--plate)" stroke="var(--ink-2)" />
      <circle cx={x} cy={py} r={6} fill="var(--plate)" stroke="var(--ink-2)" />
      <path d={`M ${x + 3 * dir} ${py - 4} Q ${x + 8 * dir} ${py} ${x + 3 * dir} ${py + 4}`} fill="none" stroke="var(--ink-2)" />
      {[-1, 1].map((k) => (
        <path
          key={k}
          d={`M ${x + 2 * dir} ${py + 13 * k} L ${x + 12 * dir} ${py + 15 * k} L ${dir > 0 ? hA : hB} ${py + 12 * k}`}
          fill="none"
          stroke="var(--ink-2)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
  return (
    <Art id="fleet-scene" label="Two Unitree G1 robots placed symmetrically about a shared object, in elevation and plan">
      {/* ground */}
      <Draw d={`M 44 ${floor} L 356 ${floor}`} at={100} dur={700} stroke="var(--ink-3)" />
      <Fade d={200}>
        {Array.from({ length: 26 }, (_, i) => (
          <line key={i} x1={48 + i * 12} y1={floor + 1} x2={42 + i * 12} y2={floor + 7} stroke="var(--rule-strong)" strokeWidth={0.8} />
        ))}
      </Fade>

      {/* centre line through both views */}
      <Fade d={250}>
        <line x1={200} y1={48} x2={200} y2={262} stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="10 3 2 3" />
        {[ax, hA, hB, bx].map((x) => (
          <line
            key={x}
            x1={x}
            y1={floor + 12}
            x2={x}
            y2={py - 22}
            stroke="var(--rule-strong)"
            strokeDasharray="0.1 3"
            strokeLinecap="round"
          />
        ))}
      </Fade>

      {/* elevation */}
      <Fade d={350}>
        <G1Side x={ax} floor={floor} s={s} dir={1} />
        <G1Side x={bx} floor={floor} s={s} dir={-1} />
        <rect x={hA + 0.5} y={hy - 12.5} width={hB - hA - 1} height={25} rx={1.5} fill="var(--plate)" stroke="var(--ink)" />
        <line x1={hA + 4} y1={hy - 8} x2={hB - 4} y2={hy - 8} stroke="var(--rule)" />
      </Fade>

      {/* plan */}
      <Fade d={600}>
        {pr(ax, 1)}
        {pr(bx, -1)}
        <rect x={hA + 0.5} y={py - 17.5} width={hB - hA - 1} height={35} rx={1.5} fill="var(--plate)" stroke="var(--ink)" />
        <path d={`M ${hA} ${py - 17.5} L ${hB} ${py + 17.5} M ${hB} ${py - 17.5} L ${hA} ${py + 17.5}`} stroke="var(--rule)" />
      </Fade>

      {/* equal distances either side of the centre line */}
      <Fade d={900}>
        <path
          d={`M ${ax} 270 L ${bx} 270 M ${ax} 266 L ${ax} 274 M 200 266 L 200 274 M ${bx} 266 L ${bx} 274`}
          stroke="var(--ink-3)"
          strokeWidth={0.8}
        />
        <Txt x={(ax + 200) / 2} y={284} size={9.5} anchor="middle">
          d
        </Txt>
        <Txt x={(bx + 200) / 2} y={284} size={9.5} anchor="middle">
          d
        </Txt>
        <Txt x={360} y={66} size={9} anchor="end">
          elevation
        </Txt>
        <Txt x={360} y={206} size={9} anchor="end">
          plan
        </Txt>
        <Txt x={44} y={206} size={9}>
          Unitree G1
        </Txt>
      </Fade>

      {/* hand contacts: the only channel besides speech */}
      <Fade d={1100}>
        <g>
          <g className="dg-pulse">
            <g>
              <animate
                attributeName="opacity"
                values="1;0.35;1"
                keyTimes="0;0.5;1"
                dur="4s"
                calcMode="spline"
                keySplines={splines(2)}
                repeatCount="indefinite"
              />
              {[
                [hA, hy],
                [hB, hy],
                [hA, py - 12],
                [hA, py + 12],
                [hB, py - 12],
                [hB, py + 12],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={5.5} fill="var(--signal)" opacity={0.18} />
              ))}
            </g>
          </g>
          {[
            [hA, hy],
            [hB, hy],
            [hA, py - 12],
            [hA, py + 12],
            [hB, py - 12],
            [hB, py + 12],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2.6} fill="var(--signal)" />
          ))}
        </g>
      </Fade>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Stage 1 reward components, one panel each                       */
/* ------------------------------------------------------------------ */

/**
 * A generic logged trace: a slow wander plus per-step jitter, with no trend.
 * Stage 1 is still training, so the traces stop part-way along the axis.
 */
function trace(seed: number, n = 44) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const j = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    const noise = (j - Math.floor(j) - 0.5) * 0.14;
    const fit = 0.5 + 0.1 * Math.sin(t * 5.2 + seed * 1.7) + 0.05 * Math.sin(t * 11 + seed);
    return { t, raw: fit + noise, fit };
  });
}

function Rewards() {
  const PW = 162;
  const PH = 78;
  const LIVE = 0.72; // how far along the step axis the traces have got
  const panels = [
    { name: "distance decrease", x: 30, y: 62 },
    { name: "stable hand contact", x: 212, y: 62 },
    { name: "grip duration", x: 30, y: 180 },
    { name: "fall penalty", x: 212, y: 180 },
  ];
  return (
    <Art id="fleet-rewards" label="Four Stage 1 reward components, each logged to its own TensorBoard panel as training runs">
      {panels.map((p, i) => {
        const pts = trace(i + 1);
        const X = (t: number) => p.x + t * PW * LIVE;
        const Y = (v: number) => p.y + PH - v * PH;
        const raw = pts.map((q, k) => `${k ? "L" : "M"} ${X(q.t).toFixed(1)} ${Y(q.raw).toFixed(1)}`).join(" ");
        const fit = pts.map((q, k) => `${k ? "L" : "M"} ${X(q.t).toFixed(1)} ${Y(q.fit).toFixed(1)}`).join(" ");
        const end = pts[pts.length - 1];
        return (
          <g key={p.name}>
            <Fade d={100 + i * 90}>
              <Txt x={p.x} y={p.y - 12} size={9.5} tone="ink2">
                {p.name}
              </Txt>
              <path
                d={`M ${p.x} ${p.y - 2} L ${p.x} ${p.y + PH} L ${p.x + PW} ${p.y + PH}`}
                fill="none"
                stroke="var(--ink-3)"
                strokeWidth={0.8}
              />
              <path d={raw} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
            </Fade>
            <Draw d={fit} at={400 + i * 120} dur={1000} stroke="var(--ink-2)" w={1.1} />
            <Fade d={1300 + i * 60}>
              <circle cx={X(1)} cy={Y(end.fit)} r={2.6} fill="var(--signal)" />
            </Fade>
          </g>
        );
      })}
      <Fade d={900}>
        <Txt x={212 + PW} y={180 + PH + 16} size={9} anchor="end">
          training steps
        </Txt>
      </Fade>
      {/* a shared hover cursor, read across all four at once */}
      <g className="dg-pulse">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="12s"
            repeatCount="indefinite"
            values={`0 0;${PW * LIVE} 0;${PW * LIVE} 0;0 0`}
            keyTimes="0;0.6;0.72;1"
            calcMode="spline"
            keySplines={splines(3)}
          />
          {panels.map((p) => (
            <line key={p.name} x1={p.x} y1={p.y - 2} x2={p.x} y2={p.y + PH} stroke="var(--ink-2)" strokeWidth={0.8} strokeDasharray="2 2" />
          ))}
        </g>
      </g>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Four layers, stacked                                            */
/* ------------------------------------------------------------------ */

function Layers() {
  const X0 = 46;
  const W = 156;
  const DX = 52;
  const DY = 30;
  const T = 5;
  const P = (y: number, u: number, v: number) => [X0 + u * W + v * DX, y - v * DY] as const;
  const quad = (y: number, u0: number, u1: number, v0: number, v1: number) => {
    const a = P(y, u0, v0);
    const b = P(y, u1, v0);
    const c = P(y, u1, v1);
    const d = P(y, u0, v1);
    return `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]} L ${d[0]} ${d[1]} Z`;
  };
  const layers = [
    {
      name: "Environment",
      sub: "MuJoCo, 1000 Hz",
      y: 246,
      mods: [
        [0.06, 0.3],
        [0.38, 0.62],
        [0.7, 0.94],
      ],
    },
    {
      name: "Training",
      sub: "RSL-RL, PPO",
      y: 190,
      mods: [
        [0.06, 0.46],
        [0.54, 0.94],
      ],
    },
    {
      name: "Utilities",
      sub: "",
      y: 134,
      mods: [
        [0.06, 0.26],
        [0.32, 0.52],
        [0.58, 0.78],
      ],
    },
    {
      name: "Scripts",
      sub: "",
      y: 78,
      mods: [
        [0.06, 0.36],
        [0.44, 0.74],
      ],
    },
  ];
  // the riser: one vertical bus through the stack at the centre of each face
  const [rx] = P(0, 0.5, 0.5);
  const top = (y: number) => y - 0.5 * DY;
  return (
    <Art id="fleet-layers" label="Four-layer architecture: environment, training, utilities, scripts">
      {layers.map((l, i) => {
        const [sx, sy] = P(l.y, 1, 0.5);
        return (
          <g key={l.name}>
            {/* riser segment from this face up to the underside of the next */}
            {i < 3 && (
              <Draw
                d={`M ${rx} ${top(l.y)} L ${rx} ${top(layers[i + 1].y) + T}`}
                at={500 + i * 200}
                dur={300}
                stroke={i === 0 ? "var(--signal)" : "var(--ink-3)"}
                w={i === 0 ? 1.4 : 1}
              />
            )}
            <Fade d={100 + i * 150}>
              {/* thickness, then the face */}
              <path
                d={`M ${X0} ${l.y} L ${X0} ${l.y + T} L ${X0 + W} ${l.y + T} L ${X0 + W + DX} ${l.y - DY + T} L ${X0 + W + DX} ${l.y - DY} L ${X0 + W} ${l.y} Z`}
                fill="var(--rule)"
                stroke="var(--ink-3)"
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
              <path d={quad(l.y, 0, 1, 0, 1)} fill="var(--plate)" stroke="var(--ink-2)" strokeLinejoin="round" />
              {l.mods.map(([u0, u1], k) => (
                <path
                  key={k}
                  d={quad(l.y, u0, u1, 0.28, 0.72)}
                  fill="none"
                  stroke={i === 0 && k === 1 ? "var(--signal)" : "var(--rule-strong)"}
                  strokeLinejoin="round"
                />
              ))}
              {/* leader to the name */}
              <line x1={sx} y1={sy} x2={284} y2={sy} stroke="var(--ink-3)" strokeWidth={0.8} />
              <circle cx={sx} cy={sy} r={1.6} fill="var(--ink-3)" />
              <Txt x={290} y={sy + (l.sub ? -1 : 3.5)} size={10.5} tone="ink" mono={false}>
                {l.name}
              </Txt>
              {l.sub && (
                <Txt x={290} y={sy + 11} size={9}>
                  {l.sub}
                </Txt>
              )}
            </Fade>
          </g>
        );
      })}
      <Fade d={800}>
        <circle cx={rx} cy={top(layers[0].y)} r={2.2} fill="var(--signal)" />
      </Fade>
      {/* a call travels down the stack to the physics and back */}
      <g className="dg-pulse">
        <circle r={2.8} fill="var(--signal)" cx={rx}>
          <animate
            attributeName="cy"
            dur="9s"
            repeatCount="indefinite"
            values={`${top(layers[3].y)};${top(layers[0].y)};${top(layers[0].y)};${top(layers[3].y)}`}
            keyTimes="0;0.45;0.55;1"
            calcMode="spline"
            keySplines={splines(3)}
          />
          <animate attributeName="opacity" dur="9s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.08;0.92;1" />
        </circle>
      </g>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 04 Speech channel: 8 tokens, one-step delay, ten-step persistence  */
/* ------------------------------------------------------------------ */

function Speech() {
  const tokens = ["silence", "three", "two", "one", "lift", "down", "stop", "regrip"];
  const lift = tokens.indexOf("lift");
  const CX = 30;
  const CW = 60;
  const CH = 18;
  const cy = (i: number) => 64 + i * 26;
  const S0 = 166;
  const SW = 10;
  const N = 21;
  const sx = (k: number) => S0 + k * SW;
  const AY = 118;
  const BY = 202;
  const emit = 7;
  const hold = 10;
  const cell = (k: number, y: number) => ({ x: sx(k) + 1, y: y - 4.5, w: SW - 2, h: 9 });
  const aCell = cell(emit, AY);
  const liftY = cy(lift) + CH / 2;
  const path =
    `M ${CX + CW} ${liftY} L ${S0 - 14} ${liftY} L ${S0 - 14} ${AY + 12} L ${sx(emit) + SW / 2} ${AY + 12} L ${sx(emit) + SW / 2} ${AY + 4.5}` +
    ` L ${sx(emit) + SW / 2} ${AY + 4.5} L ${sx(emit + 1) + SW / 2} ${BY - 4.5} L ${sx(emit + hold) + SW / 2} ${BY - 4.5}`;
  return (
    <Art
      id="fleet-speech"
      label="Speech channel: robot A emits one of eight tokens; robot B hears it one step later and it persists for ten steps"
    >
      {/* vocabulary */}
      <Fade d={100}>
        <Txt x={CX} y={52} size={9}>
          vocabulary
        </Txt>
      </Fade>
      {tokens.map((t, i) => (
        <Fade key={t} d={150 + i * 45}>
          <rect
            x={CX + 0.5}
            y={cy(i) + 0.5}
            width={CW - 1}
            height={CH - 1}
            rx={CH / 2}
            fill="var(--plate)"
            stroke={i === lift ? "var(--signal)" : "var(--rule-strong)"}
          />
          <Txt x={CX + CW / 2} y={cy(i) + 12.5} size={9.5} anchor="middle" tone={i === lift ? "signal" : "ink2"}>
            {t}
          </Txt>
        </Fade>
      ))}

      {/* the two tapes, one cell per 20 ms policy step */}
      {[
        { y: AY, name: "robot A speaks" },
        { y: BY, name: "robot B hears" },
      ].map((row, r) => (
        <Fade key={row.name} d={450 + r * 120}>
          <Txt x={S0} y={row.y - 14} size={9.5} tone="ink2">
            {row.name}
          </Txt>
          {Array.from({ length: N }, (_, k) => {
            const c = cell(k, row.y);
            return (
              <rect key={k} x={c.x + 0.5} y={c.y + 0.5} width={c.w - 1} height={c.h - 1} rx={1} fill="none" stroke="var(--rule-strong)" />
            );
          })}
        </Fade>
      ))}

      {/* selection: the sampled token goes out on robot A's tape */}
      <Draw
        d={`M ${CX + CW} ${liftY} L ${S0 - 14} ${liftY} L ${S0 - 14} ${AY + 12} L ${sx(emit) + SW / 2} ${AY + 12} L ${sx(emit) + SW / 2} ${AY + 4.5}`}
        at={700}
        dur={500}
        stroke="var(--signal)"
      />
      <Fade d={1000}>
        <rect x={aCell.x} y={aCell.y} width={aCell.w} height={aCell.h} rx={1} fill="var(--signal)" />
      </Fade>
      {/* one-step delay across the channel */}
      <Draw d={`M ${sx(emit) + SW / 2} ${AY + 4.5} L ${sx(emit + 1) + SW / 2} ${BY - 4.5}`} at={1100} dur={400} stroke="var(--signal)" />
      <Fade d={1250}>
        {Array.from({ length: hold }, (_, j) => {
          const c = cell(emit + 1 + j, BY);
          return (
            <rect
              key={j}
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={1}
              fill="var(--signal)"
              opacity={j === 0 ? 1 : 0.28 + 0.5 * (1 - j / hold)}
            />
          );
        })}
        <Txt x={sx(emit + 1) + SW + 8} y={(AY + BY) / 2 + 3} size={9}>
          1-step delay
        </Txt>
        {/* persistence bracket */}
        <path
          d={`M ${sx(emit + 1) + 1} ${BY + 10} L ${sx(emit + 1) + 1} ${BY + 14} L ${sx(emit + 1 + hold) - 1} ${BY + 14} L ${sx(emit + 1 + hold) - 1} ${BY + 10}`}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth={0.8}
        />
        <Txt x={(sx(emit + 1) + sx(emit + 1 + hold)) / 2} y={BY + 28} size={9} anchor="middle">
          10-step persistence, about 200 ms
        </Txt>
      </Fade>
      <Fade d={1350}>
        <Txt x={sx(N) - 2} y={AY - 14} size={9} anchor="end">
          step = 20 ms
        </Txt>
      </Fade>

      {/* a token: sampled, sent, heard, held */}
      <g className="dg-pulse">
        <g>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.88;1" dur="9s" repeatCount="indefinite" />
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            path={path}
            calcMode="spline"
            keyPoints="0;1"
            keyTimes="0;1"
            keySplines="0.45 0 0.35 1"
          />
          <circle r={7} fill="var(--signal)" opacity={0.16} />
          <circle r={2.8} fill="var(--signal)" />
        </g>
      </g>
    </Art>
  );
}

/** Gallery illustrations for fleet-coord, keyed by the MDX `art` id. */
export const art: Record<string, ComponentType> = {
  "fleet-coord/scene": Scene,
  "fleet-coord/rewards": Rewards,
  "fleet-coord/architecture": Layers,
  "fleet-coord/speech": Speech,
};
