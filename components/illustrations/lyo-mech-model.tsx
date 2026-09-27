import type { ComponentType, CSSProperties, ReactNode } from "react";
import { Art, Pulse } from "@/components/diagrams/kit";

/*
  Gallery illustrations for the lyophilization mechanistic model.
  Drawn stand-ins for future plots: qualitative shapes only, no axis values.
  One family: hairline axes, dotted phase dividers, direct labels, one
  orange series per figure and one slow ambient loop each.
*/

/* ---------- shared helpers ---------- */

const MONO: CSSProperties = { fontFamily: "var(--font-mono)" };
const dl = (d: number, dur?: number) =>
  ({ "--d": d, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as CSSProperties;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ss = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const f1 = (n: number) => Math.round(n * 10) / 10;
const EASE = "0.4 0 0.2 1";

/* Phase boundaries on a normalised time axis: freeze, anneal, primary dry, secondary dry */
const P = [0, 0.2, 0.34, 0.76, 1];
const PHASES = ["freeze", "anneal", "primary dry", "secondary dry"];
const within = (t: number, i: number) => clamp((t - P[i]) / (P[i + 1] - P[i]));

/** Seeded PRNG so the jitter is stable between renders. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Fn = (t: number) => number;

/** Sample f over [0,1] into a polyline; value 1 sits `amp` above `base`. */
function trace(f: Fn, x0: number, x1: number, base: number, amp: number, n = 90) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    d += `${i ? " L" : "M"} ${f1(x0 + (x1 - x0) * t)} ${f1(base - f(t) * amp)}`;
  }
  return d;
}
const ys = (f: Fn, base: number, amp: number, n = 48) =>
  Array.from({ length: n + 1 }, (_, i) => f1(base - f(i / n) * amp)).join(";");

/** Product temperature: cools in freeze, bumps in anneal, held low by sublimation, rises in secondary. */
function tp(t: number, c = P[3], plateau = 0.88) {
  if (t < P[1]) return 0.15 + 0.72 * Math.exp(-(t / P[1]) * 5);
  if (t < P[2]) {
    const u = within(t, 1);
    return 0.15 + 0.22 * Math.pow(Math.sin(Math.PI * u), 2);
  }
  if (t < c) {
    const u = clamp((t - P[2]) / (c - P[2]));
    return 0.15 + 0.1 * u + 0.43 * ss(0.78, 1, u);
  }
  const u = clamp((t - c) / (1 - c));
  return 0.68 + (plateau - 0.68) * ss(0, 0.55, u);
}

/** Step keyTimes/values: element k is "on" during slot k of n, crossfading at the edges. */
function steps(k: number, n: number, on: number, off: number, f = 0.03) {
  const times = [0];
  const vals = [k === 0 ? on : off];
  for (let j = 0; j < n; j++) {
    const end = (j + 1) / n;
    times.push(end - f, end);
    vals.push(j === k ? on : off, (j + 1) % n === k ? on : off);
  }
  return { keyTimes: times.map((x) => f1(x * 1000) / 1000).join(";"), values: vals.join(";") };
}

/** Hold at each point, then ease to the next (wrapping). Returns per-axis value strings. */
function holdMove(pts: [number, number][], move = 0.1) {
  const n = pts.length;
  const times = [0];
  const seq: [number, number][] = [pts[0]];
  for (let j = 0; j < n; j++) {
    const end = (j + 1) / n;
    times.push(end - move, end);
    seq.push(pts[j], pts[(j + 1) % n]);
  }
  return {
    keyTimes: times.map((x) => f1(x * 1000) / 1000).join(";"),
    keySplines: Array(times.length - 1).fill(EASE).join(";"),
    x: seq.map((p) => f1(p[0])).join(";"),
    y: seq.map((p) => f1(p[1])).join(";"),
  };
}

function T({
  x,
  y,
  children,
  anchor = "start",
  tone = "muted",
  size = 9,
  mono = true,
  d = 0,
  transform,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  tone?: "muted" | "ink" | "ink2" | "signal";
  size?: number;
  mono?: boolean;
  d?: number;
  transform?: string;
}) {
  const fill =
    tone === "ink" ? "var(--ink)" : tone === "ink2" ? "var(--ink-2)" : tone === "signal" ? "var(--signal-ink)" : "var(--ink-3)";
  return (
    <text
      className="dg-n"
      style={{ ...dl(d), ...(mono ? MONO : {}) }}
      x={x}
      y={y}
      fontSize={size}
      fill={fill}
      textAnchor={anchor}
      transform={transform}
    >
      {children}
    </text>
  );
}

/** Left + bottom hairline axes. */
function Axes({ x0, x1, y0, y1, d = 0 }: { x0: number; x1: number; y0: number; y1: number; d?: number }) {
  return (
    <path
      className="dg-e"
      style={dl(d, 600)}
      pathLength={1}
      d={`M ${x0} ${y0} L ${x0} ${y1} L ${x1} ${y1}`}
      fill="none"
      stroke="var(--ink-3)"
      strokeWidth={0.7}
    />
  );
}

/** Dotted phase dividers at the three internal boundaries. */
function Dividers({ x0, x1, y0, y1, d = 0 }: { x0: number; x1: number; y0: number; y1: number; d?: number }) {
  return (
    <g className="dg-n" style={dl(d)} stroke="var(--rule-strong)" strokeWidth={0.8} strokeDasharray="1 2.5">
      {P.slice(1, 4).map((p) => {
        const x = f1(x0 + (x1 - x0) * p);
        return <line key={p} x1={x} y1={y0} x2={x} y2={y1} />;
      })}
    </g>
  );
}

function PhaseLabels({ x0, x1, y, d = 0 }: { x0: number; x1: number; y: number; d?: number }) {
  return (
    <>
      {PHASES.map((name, i) => (
        <T key={name} x={f1(x0 + (x1 - x0) * P[i] + (i ? 4 : 0))} y={y} mono={false} d={d + i * 60}>
          {name}
        </T>
      ))}
    </>
  );
}

function Curve({ d, tone = "ink", w, delay, dur = 1000 }: { d: string; tone?: "ink" | "signal" | "faint"; w?: number; delay: number; dur?: number }) {
  return (
    <path
      className="dg-e"
      style={dl(delay, dur)}
      pathLength={1}
      d={d}
      fill="none"
      stroke={tone === "signal" ? "var(--signal)" : tone === "faint" ? "var(--ink-3)" : "var(--ink-2)"}
      strokeWidth={w ?? (tone === "signal" ? 1.3 : 0.9)}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

/* ---------- 1. nine state trajectories ---------- */

const zFront = (t: number) => (t < P[2] ? 0 : t < P[3] ? Math.pow(within(t, 2), 0.75) : 1);
const STATES: { name: string; f: Fn }[] = [
  { name: "Tp", f: (t) => tp(t) },
  { name: "z", f: (t) => 0.05 + 0.85 * zFront(t) },
  { name: "Pc", f: (t) => (t < P[2] ? 0.88 : t < P[3] ? 0.14 + 0.74 * Math.exp(-within(t, 2) * 22) : 0.14 - 0.06 * ss(0, 0.3, within(t, 3))) },
  { name: "X", f: (t) => (t < P[2] ? 0.88 : t < P[3] ? 0.88 - 0.52 * zFront(t) : 0.08 + 0.28 * Math.exp(-within(t, 3) * 4)) },
  { name: "N", f: (t) => 0.82 - 0.1 * Math.pow(t, 1.6) },
  { name: "Rp", f: (t) => 0.08 + 0.78 * zFront(t) },
  { name: "EE", f: (t) => 0.84 - 0.06 * t - 0.26 * ss(0.62, 1, t) },
  { name: "RIN", f: (t) => 0.84 - 0.1 * t - 0.2 * ss(0.5, 1, t) },
  { name: "Dh", f: (t) => 0.14 + 0.08 * t + 0.3 * ss(0.66, 1, t) },
];

function Trajectories() {
  const x0 = 74;
  const x1 = 378;
  const top = 58;
  const pitch = 23;
  const amp = 16;
  const base = (i: number) => top + i * pitch + 16;
  const cursorTop = 52;
  const cursorBot = base(8) + 4;
  return (
    <Art id="lyo-trajectories" label="Nine state variables traced through freeze, anneal, primary dry and secondary dry">
      <PhaseLabels x0={x0} x1={x1} y={45} d={80} />
      <Dividers x0={x0} x1={x1} y0={50} y1={cursorBot + 4} d={60} />
      <line className="dg-n" style={dl(40)} x1={x0} y1={cursorBot + 4} x2={x1} y2={cursorBot + 4} stroke="var(--ink-3)" strokeWidth={0.7} />
      <T x={x1} y={cursorBot + 18} anchor="end" d={200}>
        time
      </T>
      {STATES.map((s, i) => (
        <g key={s.name}>
          <line
            className="dg-n"
            style={dl(100 + i * 40)}
            x1={x0}
            y1={base(i)}
            x2={x1}
            y2={base(i)}
            stroke="var(--rule)"
            strokeWidth={0.6}
          />
          <T x={x0 - 12} y={base(i) - 4} anchor="end" tone={i === 0 ? "signal" : "ink2"} d={120 + i * 40}>
            {s.name}
          </T>
          <Curve d={trace(s.f, x0, x1, base(i), amp)} tone={i === 0 ? "signal" : "ink"} w={i === 0 ? 1.3 : 0.8} delay={260 + i * 60} dur={900} />
        </g>
      ))}
      <g className="dg-pulse">
        <g>
          <animateTransform attributeName="transform" type="translate" values={`0 0;${x1 - x0} 0`} dur="11s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.04;0.9;0.96;1" dur="11s" repeatCount="indefinite" />
          <line x1={x0} y1={cursorTop} x2={x0} y2={cursorBot} stroke="var(--signal)" strokeWidth={0.7} opacity={0.55} />
          <circle cx={x0} r={2.6} fill="var(--signal)">
            <animate attributeName="cy" values={ys((t) => tp(t), base(0), amp)} dur="11s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
    </Art>
  );
}

/* ---------- 2. automatic phase-transition detection ---------- */

function Transitions() {
  const x0 = 52;
  const x1 = 372;
  const tpBase = 176;
  const tpAmp = 108;
  const pcBase = 218;
  const pcAmp = 26;
  const pc = STATES[2].f;
  const xs = P.map((p) => f1(x0 + (x1 - x0) * p));
  const marks: [number, number][] = [1, 2, 3].map((i) => [xs[i], f1(tpBase - tp(P[i]) * tpAmp)]);
  const stripY = 238;
  return (
    <Art id="lyo-transitions" label="Automatic detection of transitions between the four process phases">
      <Axes x0={x0} x1={x1} y0={60} y1={tpBase + 4} d={0} />
      <line className="dg-n" style={dl(40)} x1={x0} y1={pcBase + 4} x2={x1} y2={pcBase + 4} stroke="var(--ink-3)" strokeWidth={0.7} />
      <line className="dg-n" style={dl(40)} x1={x0} y1={pcBase - pcAmp - 2} x2={x0} y2={pcBase + 4} stroke="var(--ink-3)" strokeWidth={0.7} />
      <g className="dg-n" style={dl(80)} stroke="var(--rule-strong)" strokeWidth={0.8} strokeDasharray="1 2.5">
        {marks.map(([x, y]) => (
          <line key={x} x1={x} y1={y + 6} x2={x} y2={stripY} />
        ))}
      </g>
      <Curve d={trace(tp, x0, x1, tpBase, tpAmp)} delay={200} dur={1000} w={1} />
      <Curve d={trace(pc, x0, x1, pcBase, pcAmp)} tone="faint" delay={320} dur={900} w={0.8} />
      <T x={x1 + 6} y={f1(tpBase - tp(1) * tpAmp) + 3} tone="ink2" d={900}>
        Tp
      </T>
      <T x={x1 + 6} y={f1(pcBase - pc(1) * pcAmp) + 3} d={900}>
        Pc
      </T>
      {/* phase strip */}
      <g className="dg-n" style={dl(120)}>
        <line x1={x0} y1={stripY} x2={x1} y2={stripY} stroke="var(--rule-strong)" strokeWidth={0.8} />
        <line x1={x0} y1={stripY + 22} x2={x1} y2={stripY + 22} stroke="var(--rule-strong)" strokeWidth={0.8} />
        {xs.map((x) => (
          <line key={x} x1={x} y1={stripY} x2={x} y2={stripY + 22} stroke="var(--rule-strong)" strokeWidth={0.8} />
        ))}
      </g>
      {PHASES.map((name, i) => (
        <T key={name} x={f1((xs[i] + xs[i + 1]) / 2)} y={stripY + 14.5} anchor="middle" mono={false} tone="ink2" d={200 + i * 70}>
          {name}
        </T>
      ))}
      {marks.map(([x, y], i) => (
        <g key={x} className="dg-n" style={dl(1000 + i * 140)}>
          <circle cx={x} cy={y} r={2.6} fill="var(--signal)" />
          <line x1={x} y1={stripY - 3} x2={x} y2={stripY + 25} stroke="var(--signal)" strokeWidth={1.2} />
        </g>
      ))}
      <g className="dg-pulse">
        {marks.map(([x, y], k) => {
          const s = steps(k, marks.length, 1, 0, 0.06);
          return (
            <circle key={x} r={7} fill="none" stroke="var(--signal)" strokeWidth={0.8} cx={x} cy={y} opacity={k === 0 ? 1 : 0}>
              <animate attributeName="opacity" values={s.values} keyTimes={s.keyTimes} dur="9s" repeatCount="indefinite" />
            </circle>
          );
        })}
      </g>
    </Art>
  );
}

/* ---------- 3. LNP state evolution ---------- */

const LNP: { name: string; note: string; f: Fn }[] = [
  { name: "EE", note: "leakage", f: (t) => 0.86 - 0.12 * t - 0.4 * ss(0.55, 1, t) },
  { name: "RIN", note: "degradation", f: (t) => 0.86 - 0.5 * Math.pow(t, 1.7) },
  { name: "Dh", note: "aggregation", f: (t) => 0.12 + 0.12 * t + 0.46 * ss(0.5, 1, t) },
];

function LnpEvolution() {
  const w = 94;
  const gap = 20;
  const left = 54;
  const top = 78;
  const base = 232;
  const amp = 142;
  return (
    <Art id="lyo-lnp" label="Encapsulation efficiency leakage, RNA integrity degradation and particle aggregation over the cycle">
      {LNP.map((s, i) => {
        const x0 = left + i * (w + gap);
        const x1 = x0 + w;
        const lead = i === 0;
        return (
          <g key={s.name}>
            <T x={x0} y={top - 10} tone={lead ? "signal" : "ink"} size={10} d={60 + i * 80}>
              {s.name}
            </T>
            <Dividers x0={x0} x1={x1} y0={top} y1={base + 4} d={80 + i * 80} />
            <Axes x0={x0} x1={x1} y0={top} y1={base + 4} d={40 + i * 80} />
            <Curve d={trace(s.f, x0, x1, base, amp, 60)} tone={lead ? "signal" : "ink"} delay={300 + i * 140} dur={900} />
            <T x={x0} y={base + 20} mono={false} d={200 + i * 80}>
              {s.note}
            </T>
          </g>
        );
      })}
      <g className="dg-pulse">
        {LNP.map((s, i) => {
          const x0 = left + i * (w + gap);
          const vals = ys(s.f, base, amp);
          const lead = i === 0;
          const col = lead ? "var(--signal)" : "var(--ink-2)";
          return (
            <g key={s.name}>
              <line x1={x0 - 5} x2={x0} y1={0} y2={0} stroke={col} strokeWidth={1}>
                <animateTransform attributeName="transform" type="translate" values={vals.split(";").map((y) => `0 ${y}`).join(";")} dur="10s" repeatCount="indefinite" />
              </line>
              <circle r={lead ? 2.6 : 2} fill={col}>
                <animate attributeName="cx" values={`${x0};${x0 + w}`} dur="10s" repeatCount="indefinite" />
                <animate attributeName="cy" values={vals} dur="10s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </g>
    </Art>
  );
}

/* ---------- 4. phase-dependent physics ---------- */

const sublimation: Fn = (t) => {
  if (t < P[2] || t > P[3]) return 0;
  const u = within(t, 2);
  return ss(0, 0.08, u) * (0.86 - 0.22 * u) * (1 - ss(0.88, 1, u));
};
const desorption: Fn = (t) => {
  if (t < P[3]) return 0;
  const u = within(t, 3);
  return 0.84 * ss(0, 0.07, u) * Math.exp(-u * 2.4);
};

function PhasePhysics() {
  const x0 = 40;
  const x1 = 376;
  const X = (p: number) => f1(x0 + (x1 - x0) * p);
  const r1 = 158;
  const r2 = 258;
  const amp = 60;
  const full = trace(sublimation, x0, x1, r1, amp, 120);
  const active = trace((t) => sublimation(P[2] + t * (P[3] - P[2])), X(P[2]), X(P[3]), r1, amp, 80);
  const dActive = trace((t) => desorption(P[3] + t * (1 - P[3])), X(P[3]), x1, r2, amp, 60);
  return (
    <Art id="lyo-physics" label="Sublimation suppressed during freeze and active in primary dry; desorption active in secondary dry">
      <PhaseLabels x0={x0} x1={x1} y={58} d={60} />
      <Dividers x0={x0} x1={x1} y0={64} y1={r2 + 6} d={40} />
      {/* rows */}
      <T x={x0} y={88} mono={false} tone="ink" size={10} d={120}>
        sublimation
      </T>
      <T x={x0} y={188} mono={false} tone="ink" size={10} d={180}>
        desorption
      </T>
      <g className="dg-n" style={dl(100)} stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="1 2.5">
        <line x1={x0} y1={r1} x2={X(P[2])} y2={r1} />
        <line x1={X(P[3])} y1={r1} x2={x1} y2={r1} />
        <line x1={x0} y1={r2} x2={X(P[3])} y2={r2} />
      </g>
      <Curve d={active} tone="signal" delay={380} dur={900} />
      <Curve d={dActive} delay={700} dur={800} />
      <T x={f1((X(0) + X(P[1])) / 2)} y={r1 - 8} anchor="middle" d={500}>
        suppressed
      </T>
      <T x={f1((X(P[3]) + x1) / 2) + 8} y={r2 - amp * 0.55} d={900}>
        active
      </T>
      <Pulse path={full} dur={10} r={2.4} />
    </Art>
  );
}

/* ---------- 5. multi-batch synthetic dataset ---------- */

type Vial = { d: string; batch: number };
const BATCHES = [
  { c: 0.72, plateau: 0.6 },
  { c: 0.76, plateau: 0.72 },
  { c: 0.8, plateau: 0.86 },
];
const LEAD_BATCH = 2;
const VIALS_PER = 6;

function vials(x0: number, x1: number, base: number, amp: number): Vial[] {
  const r = rng(7);
  const out: Vial[] = [];
  BATCHES.forEach((b, bi) => {
    for (let v = 0; v < VIALS_PER; v++) {
      const c = b.c + (r() - 0.5) * 0.05;
      const pl = b.plateau + (r() - 0.5) * 0.06;
      const off = (r() - 0.5) * 0.02;
      const noise = Array.from({ length: 101 }, () => (r() - 0.5) * 0.014);
      const f: Fn = (t) => tp(t, c, pl) + off * ss(0, 0.2, t) + noise[Math.round(t * 100)];
      out.push({ d: trace(f, x0, x1, base, amp, 100), batch: bi });
    }
  });
  return out;
}

function Batches() {
  const x0 = 52;
  const x1 = 326;
  const base = 236;
  const amp = 170;
  const all = vials(x0, x1, base, amp);
  const ends = BATCHES.map((b) => f1(base - b.plateau * amp));
  const lead = all.filter((v) => v.batch === LEAD_BATCH);
  const tipX = f1(x0 + (x1 - x0) * 0.93);
  return (
    <Art id="lyo-batches" label="Synthetic product-temperature traces for several batches, with vial-to-vial variation">
      <Axes x0={x0} x1={x1 + 6} y0={56} y1={base + 6} />
      <T x={x0 + 6} y={62} tone="ink2" d={100}>
        Tp
      </T>
      <T x={x1 + 6} y={base + 20} anchor="end" d={200}>
        time
      </T>
      <Dividers x0={x0} x1={x1} y0={56} y1={base + 6} d={60} />
      {all
        .filter((v) => v.batch !== LEAD_BATCH)
        .map((v, i) => (
          <Curve key={i} d={v.d} tone="faint" w={0.55} delay={240 + i * 25} dur={900} />
        ))}
      {lead.map((v, i) => (
        <path
          key={i}
          className="dg-e"
          style={dl(520 + i * 40, 900)}
          pathLength={1}
          d={v.d}
          fill="none"
          stroke="var(--signal)"
          strokeWidth={0.7}
          strokeLinejoin="round"
          opacity={0.45}
        />
      ))}
      {/* batches bracket */}
      <g className="dg-n" style={dl(1100)} fill="none" stroke="var(--ink-3)" strokeWidth={0.7}>
        <path d={`M ${x1 + 6} ${ends[2] - 4} h 4 V ${ends[0] + 4} h -4`} />
      </g>
      <T x={x1 + 15} y={f1((ends[0] + ends[2]) / 2) + 3} d={1150}>
        batches
      </T>
      <T x={tipX} y={ends[2] - 12} anchor="middle" tone="signal" d={1200}>
        vials
      </T>
      <g className="dg-pulse">
        {lead.map((v, i) => {
          const s = steps(i, VIALS_PER, 1, 0, 0.05);
          return (
            <path key={i} d={v.d} fill="none" stroke="var(--signal)" strokeWidth={1.1} strokeLinejoin="round" opacity={0}>
              <animate attributeName="opacity" values={s.values} keyTimes={s.keyTimes} dur="9s" repeatCount="indefinite" />
            </path>
          );
        })}
      </g>
    </Art>
  );
}

/* ---------- 6. predicted vs target CQAs ---------- */

const CQA_PANELS = ["moisture", "EE", "RIN", "Z50"];
const N_BATCH = 7;

function Parity() {
  const w = 128;
  const h = 90;
  const xs = [92, 248];
  const ysTop = [56, 170];
  const r = rng(21);
  const targets = Array.from({ length: N_BATCH }, (_, i) => 0.14 + (0.72 * (i + 0.5)) / N_BATCH);
  const panels = CQA_PANELS.map((name, pi) => {
    const x0 = xs[pi % 2];
    const y0 = ysTop[Math.floor(pi / 2)];
    const order = [...targets].sort(() => r() - 0.5);
    const pts: [number, number][] = order.map((t) => {
      const p = clamp(t + (r() - 0.5) * 0.12);
      return [f1(x0 + t * w), f1(y0 + h - p * h)];
    });
    return { name, x0, y0, pts };
  });
  return (
    <Art id="lyo-parity" label="Predicted against target quality attributes for each batch run">
      {panels.map((p, i) => (
        <g key={p.name}>
          <Axes x0={p.x0} x1={p.x0 + w} y0={p.y0} y1={p.y0 + h} d={i * 70} />
          <line
            className="dg-n"
            style={dl(160 + i * 70)}
            x1={p.x0}
            y1={p.y0 + h}
            x2={p.x0 + w}
            y2={p.y0}
            stroke="var(--rule-strong)"
            strokeWidth={0.8}
            strokeDasharray="1 2.5"
          />
          <T x={p.x0 + 6} y={p.y0 + 10} tone="ink2" mono={p.name !== "moisture"} d={120 + i * 70}>
            {p.name}
          </T>
          <g className="dg-n" style={dl(420 + i * 90)} fill="var(--ink-2)">
            {p.pts.map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r={2} />
            ))}
          </g>
        </g>
      ))}
      <T x={xs[0] - 12} y={ysTop[0] + h + 57} anchor="middle" mono={false} transform={`rotate(-90 ${xs[0] - 12} ${ysTop[0] + h + 57})`} d={200}>
        predicted
      </T>
      <T x={(xs[0] + xs[1] + w) / 2} y={ysTop[1] + h + 22} anchor="middle" mono={false} d={200}>
        target
      </T>
      <g className="dg-pulse">
        {panels.map((p) => {
          const m = holdMove(p.pts, 0.12);
          return (
            <circle key={p.name} r={5.5} fill="none" stroke="var(--signal)" strokeWidth={1} cx={p.pts[0][0]} cy={p.pts[0][1]}>
              <animate attributeName="cx" values={m.x} keyTimes={m.keyTimes} keySplines={m.keySplines} calcMode="spline" dur="12s" repeatCount="indefinite" />
              <animate attributeName="cy" values={m.y} keyTimes={m.keyTimes} keySplines={m.keySplines} calcMode="spline" dur="12s" repeatCount="indefinite" />
            </circle>
          );
        })}
      </g>
    </Art>
  );
}

/* ---------- 7. parameter-to-CQA dependency map ---------- */

const PARAMS = ["thermal exposure", "moisture", "pH", "ionic strength", "lipid ratio"];
const CQAS = ["X", "EE", "RIN", "Z50", "PDI"];
/* Only the dependencies the write-up states the model encodes (1 = modelled). No signs or strengths. */
const DEPS = [
  [0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0],
  [0, 1, 0, 1, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
];
const FOCUS: [number, number][] = [
  [0, 1],
  [1, 2],
  [3, 3],
  [4, 3],
];

function Heatmap() {
  const gx = 146;
  const gy = 72;
  const cw = 44;
  const ch = 34;
  const cx = (c: number) => gx + c * cw + cw / 2;
  const cy = (r: number) => gy + r * ch + ch / 2;
  const m = holdMove(
    FOCUS.map(([r, c]) => [cx(c), cy(r)]),
    0.12,
  );
  const keyY = gy + 5 * ch + 20;
  return (
    <Art id="lyo-heatmap" label="Which process parameters each quality attribute depends on in the model" grid={false}>
      {CQAS.map((c, i) => (
        <T key={c} x={cx(i)} y={gy - 9} anchor="middle" tone="ink2" d={60 + i * 40}>
          {c}
        </T>
      ))}
      {PARAMS.map((p, i) => (
        <T key={p} x={gx - 10} y={cy(i) + 3} anchor="end" mono={false} tone="ink2" size={9.5} d={80 + i * 40}>
          {p}
        </T>
      ))}
      <g className="dg-n" style={dl(40)} stroke="var(--rule)" strokeWidth={0.7}>
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={gx} y1={gy + i * ch} x2={gx + 5 * cw} y2={gy + i * ch} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`v${i}`} x1={gx + i * cw} y1={gy} x2={gx + i * cw} y2={gy + 5 * ch} />
        ))}
      </g>
      {DEPS.map((row, r) =>
        row.map((v, c) =>
          v ? (
            <circle key={`${r}-${c}`} className="dg-n" style={dl(260 + (r + c) * 70)} cx={cx(c)} cy={cy(r)} r={4.5} fill="var(--ink-2)" />
          ) : (
            <circle key={`${r}-${c}`} className="dg-n" style={dl(300)} cx={cx(c)} cy={cy(r)} r={1.6} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
          ),
        ),
      )}
      <circle className="dg-n" style={dl(1000)} cx={gx + 4.5} cy={keyY - 3} r={4.5} fill="var(--ink-2)" />
      <T x={gx + 14} y={keyY} d={1000}>
        modelled dependency
      </T>
      <g className="dg-pulse">
        <rect x={-cw / 2 + 2} y={-ch / 2 + 2} width={cw - 4} height={ch - 4} fill="none" stroke="var(--signal)" strokeWidth={1.2}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={m.x.split(";").map((x, i) => `${x} ${m.y.split(";")[i]}`).join(";")}
            keyTimes={m.keyTimes}
            keySplines={m.keySplines}
            calcMode="spline"
            dur="11s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </Art>
  );
}

/* ---------- 8. per-phase contribution to final CQAs ---------- */

/* Conceptual decomposition only: each final CQA attributed across the four phases. Equal segments, no magnitudes. */
const CQA_ROWS = ["moisture", "EE", "RIN", "Z50", "PDI"];

function PhaseContribution() {
  const lx = 44;
  const gx = 104;
  const x1 = 372;
  const gap = 3;
  const segW = (x1 - gx - gap * 3) / 4;
  const sx = (k: number) => f1(gx + k * (segW + gap));
  const top = 96;
  const pitch = 32;
  const barH = 10;
  const bottom = top + (CQA_ROWS.length - 1) * pitch + barH / 2;
  return (
    <Art id="lyo-contribution" label="Each final quality attribute attributed across the four process phases">
      {PHASES.map((name, k) => (
        <T key={name} x={sx(k)} y={top - 20} mono={false} d={60 + k * 60}>
          {name}
        </T>
      ))}
      {CQA_ROWS.map((name, r) => {
        const y = top + r * pitch;
        return (
          <g key={name}>
            <T x={lx} y={y + 3.5} mono={name !== "moisture"} tone="ink2" size={9.5} d={120 + r * 50}>
              {name}
            </T>
            {PHASES.map((_, k) => (
              <rect
                key={k}
                className="dg-n"
                style={dl(300 + r * 60 + k * 70)}
                x={sx(k)}
                y={y - barH / 2}
                width={f1(segW)}
                height={barH}
                fill="none"
                stroke="var(--ink-3)"
                strokeWidth={0.8}
              />
            ))}
          </g>
        );
      })}
      <T x={gx} y={bottom + 24} d={900}>
        final value, attributed by phase
      </T>
      <g className="dg-pulse">
        {PHASES.map((name, k) => {
          const s = steps(k, PHASES.length, 1, 0, 0.035);
          return (
            <g key={name} opacity={k === 0 ? 1 : 0}>
              <animate attributeName="opacity" values={s.values} keyTimes={s.keyTimes} dur="10s" repeatCount="indefinite" />
              <line x1={sx(k)} y1={top - 14} x2={f1(sx(k) + segW)} y2={top - 14} stroke="var(--signal)" strokeWidth={1.2} />
              {CQA_ROWS.map((row, r) => (
                <rect key={row} x={sx(k)} y={top + r * pitch - barH / 2} width={f1(segW)} height={barH} fill="var(--signal)" />
              ))}
            </g>
          );
        })}
      </g>
    </Art>
  );
}

/** Gallery illustrations for lyo-mech-model, keyed by the MDX `art` id. */
export const art: Record<string, ComponentType> = {
  "lyo-mech-model/trajectories": Trajectories,
  "lyo-mech-model/transitions": Transitions,
  "lyo-mech-model/lnp": LnpEvolution,
  "lyo-mech-model/physics": PhasePhysics,
  "lyo-mech-model/batches": Batches,
  "lyo-mech-model/parity": Parity,
  "lyo-mech-model/heatmap": Heatmap,
  "lyo-mech-model/contribution": PhaseContribution,
};
