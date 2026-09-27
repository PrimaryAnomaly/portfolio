/*
  Diagram kit. Pure SVG drawn in site tokens, so every diagram follows
  light/dark mode and uses the page's own typefaces.

  Grammar
  - Band: a horizontal layer. Hairline rule on top, name + stack in the
    left gutter (x < GUTTER), components to the right.
  - Node: a component. Plate fill, hairline stroke; `tone` raises it.
  - Edge: orthogonal polyline with rounded corners. Arrowheads are drawn
    as separate shapes so they can land after the line finishes drawing.
  - Signal orange marks the one path that matters in each diagram.

  Motion: nodes fade in and edges draw (stroke-dashoffset on pathLength=1)
  once, when the figure's [data-reveal="diagram"] receives data-in.
  `d` is the delay in ms. Small SVG, one-shot, so paint cost is trivial.
*/

export const W = 1200;
export const GUTTER = 190;
export const X0 = 220; // content left edge
export const CW = W - X0; // content width

type Tone = "default" | "ink" | "signal" | "ghost";

const delay = (d = 0) => ({ "--d": d }) as React.CSSProperties;

export function Diagram({
  h,
  title,
  children,
}: {
  h: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${h}`}
      role="img"
      aria-label={title}
      className="dg block h-auto w-full"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function Band({
  y,
  h,
  name,
  meta,
  note,
  d = 0,
}: {
  y: number;
  h: number;
  name: string;
  meta?: string;
  note?: string;
  d?: number;
}) {
  return (
    <g className="dg-n" style={delay(d)}>
      <rect x={0} y={y} width={W} height={h} fill="transparent" />
      <line x1={0} y1={y} x2={W} y2={y} stroke="var(--rule)" strokeWidth={1} />
      <text x={0} y={y + 30} fontSize={15} fontWeight={600} fill="var(--ink)" letterSpacing="-0.01em">
        {name}
      </text>
      {meta && (
        <text x={0} y={y + 50} fontSize={11.5} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          {meta}
        </text>
      )}
      {note && (
        <text x={0} y={y + h - 18} fontSize={12} fill="var(--ink-3)">
          {note}
        </text>
      )}
    </g>
  );
}

export function Node({
  x,
  y,
  w,
  h,
  title,
  sub,
  code = false,
  tone = "default",
  pill = false,
  align = "left",
  d = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string | string[];
  code?: boolean;
  tone?: Tone;
  pill?: boolean;
  align?: "left" | "center";
  d?: number;
}) {
  const fill = tone === "ink" ? "var(--ink)" : tone === "ghost" ? "transparent" : "var(--plate)";
  const stroke = tone === "signal" ? "var(--signal)" : tone === "ink" ? "var(--ink)" : "var(--rule-strong)";
  const titleFill = tone === "ink" ? "var(--paper)" : "var(--ink)";
  const subFill = tone === "ink" ? "var(--paper)" : "var(--ink-3)";
  const subs = sub === undefined ? [] : Array.isArray(sub) ? sub : [sub];
  const lines = 1 + subs.length;
  const lh = 17;
  const top = y + h / 2 - ((lines - 1) * lh) / 2 + 5;
  const tx = align === "center" ? x + w / 2 : x + 16;
  const anchor = align === "center" ? "middle" : "start";

  return (
    <g className="dg-n" style={delay(d)}>
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={w - 1}
        height={h - 1}
        rx={pill ? h / 2 : 3}
        fill={fill}
        stroke={stroke}
        strokeWidth={tone === "signal" ? 1.25 : 1}
        strokeDasharray={tone === "ghost" ? "3 4" : undefined}
      />
      {tone === "signal" && !pill && <rect x={x} y={y} width={3} height={h} fill="var(--signal)" />}
      <text x={tx} y={top} fontSize={14} fontWeight={600} fill={titleFill} textAnchor={anchor} letterSpacing="-0.01em">
        {title}
      </text>
      {subs.map((s, i) => (
        <text
          key={i}
          x={tx}
          y={top + lh * (i + 1)}
          fontSize={code ? 11 : 12}
          fill={subFill}
          opacity={tone === "ink" ? 0.7 : 1}
          textAnchor={anchor}
          style={code ? { fontFamily: "var(--font-mono)" } : undefined}
        >
          {s}
        </text>
      ))}
    </g>
  );
}

export function Chip({
  x,
  y,
  w,
  label,
  tone = "default",
  d = 0,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  tone?: "default" | "signal" | "ink";
  d?: number;
}) {
  const h = 24;
  return (
    <g className="dg-n" style={delay(d)}>
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={w - 1}
        height={h - 1}
        rx={h / 2}
        fill={tone === "ink" ? "var(--ink)" : "var(--paper)"}
        stroke={tone === "signal" ? "var(--signal)" : tone === "ink" ? "var(--ink)" : "var(--rule-strong)"}
      />
      <text
        x={x + w / 2}
        y={y + 16}
        fontSize={11}
        textAnchor="middle"
        style={{ fontFamily: "var(--font-mono)" }}
        fill={tone === "ink" ? "var(--paper)" : tone === "signal" ? "var(--signal-ink)" : "var(--ink-2)"}
      >
        {label}
      </text>
    </g>
  );
}

export function Label({
  x,
  y,
  children,
  anchor = "start",
  tone = "muted",
  mono = false,
  size = 12,
  d = 0,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  tone?: "muted" | "ink" | "signal";
  mono?: boolean;
  size?: number;
  d?: number;
}) {
  const fill = tone === "ink" ? "var(--ink)" : tone === "signal" ? "var(--signal-ink)" : "var(--ink-3)";
  return (
    <text
      className="dg-n"
      style={{ ...delay(d), ...(mono ? { fontFamily: "var(--font-mono)" } : {}) }}
      x={x}
      y={y}
      fontSize={size}
      fill={fill}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}

type Pt = [number, number];

/** Orthogonal polyline with rounded corners. */
function roundedPath(pts: Pt[], r = 10) {
  if (pts.length < 3) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py);
    const l2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * rr;
    const ay = cy - ((cy - py) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr;
    const by = cy + ((ny - cy) / l2) * rr;
    d += ` L ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}

export function Edge({
  pts,
  tone = "default",
  head = true,
  tail = false,
  dashed = false,
  d = 0,
  dur = 700,
}: {
  pts: Pt[];
  tone?: "default" | "signal";
  head?: boolean;
  tail?: boolean;
  dashed?: boolean;
  d?: number;
  dur?: number;
}) {
  const color = tone === "signal" ? "var(--signal)" : "var(--ink-3)";
  const arrow = (a: Pt, b: Pt) => {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const s = 7;
    const p1: Pt = [b[0] - s * Math.cos(ang - 0.45), b[1] - s * Math.sin(ang - 0.45)];
    const p2: Pt = [b[0] - s * Math.cos(ang + 0.45), b[1] - s * Math.sin(ang + 0.45)];
    return `M ${p1[0]} ${p1[1]} L ${b[0]} ${b[1]} L ${p2[0]} ${p2[1]}`;
  };
  const n = pts.length;
  return (
    <g>
      <path
        className={dashed ? "dg-n" : "dg-e"}
        style={{ ...delay(d), "--dur": `${dur}ms` } as React.CSSProperties}
        d={roundedPath(pts)}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={tone === "signal" ? 1.5 : 1}
        strokeDasharray={dashed ? "0.004 0.008" : undefined}
        strokeLinecap="round"
      />
      {head && (
        <path
          className="dg-h"
          style={delay(d + dur - 120)}
          d={arrow(pts[n - 2], pts[n - 1])}
          fill="none"
          stroke={color}
          strokeWidth={tone === "signal" ? 1.5 : 1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {tail && (
        <path
          className="dg-h"
          style={delay(d)}
          d={arrow(pts[1], pts[0])}
          fill="none"
          stroke={color}
          strokeWidth={tone === "signal" ? 1.5 : 1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

/** Evenly split `total` width into `n` columns with `gap`, from x. */
export function cols(n: number, gap = 16, x = X0, total = CW) {
  const w = (total - gap * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => ({ x: x + i * (w + gap), w, cx: x + i * (w + gap) + w / 2 }));
}

/**
 * Ambient signal: a small dot travelling `path` forever (SMIL animateMotion,
 * a tiny repaint rect per frame). <DiagramFrame> pauses every SMIL clock
 * in the figure off-screen and under reduced motion, and pulses stay
 * hidden until the draw-in finishes.
 */
export function Pulse({
  path,
  dur = 6,
  begin = 0,
  r = 3.5,
  halo = true,
}: {
  path: string;
  dur?: number;
  begin?: number;
  r?: number;
  halo?: boolean;
}) {
  return (
    <g className="dg-pulse">
      {halo && (
        <circle r={r * 2.6} fill="var(--signal)" opacity={0.14}>
          <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} rotate="0" />
        </circle>
      )}
      <circle r={r} fill="var(--signal)">
        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} rotate="0" />
      </circle>
    </g>
  );
}

export { roundedPath };

/**
 * 400×300 art board for covers and gallery illustrations. Optional
 * drafting grid. `id` must be unique on the page (used for the pattern).
 */
export function Art({
  id,
  label,
  grid = true,
  children,
}: {
  id: string;
  label: string;
  grid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className="dg block size-full" preserveAspectRatio="xMidYMid meet">
      {grid && (
        <>
          <defs>
            <pattern id={`g-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--rule)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect className="dg-n" width="400" height="300" fill={`url(#g-${id})`} />
        </>
      )}
      {children}
    </svg>
  );
}
