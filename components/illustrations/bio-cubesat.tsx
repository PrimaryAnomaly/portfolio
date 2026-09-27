import type { ComponentType, CSSProperties, ReactNode } from "react";
import { Art, Pulse, roundedPath } from "@/components/diagrams/kit";

/*
  Gallery stand-ins for the CubeSat bio-payload. Every board shares one
  drawing language: 1px ink-2 outlines, 0.6px ink-3 detail, mono 9px
  labels with dotted-origin leaders, one orange element per sheet, and a
  single slow SMIL loop. Facts come only from content/projects/bio-cubesat.mdx;
  plots are qualitative shapes.
*/

type Pt = [number, number];

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const dd = (d: number, dur?: number) => ({ "--d": d, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as CSSProperties;
const EASE = "0.4 0 0.2 1";
const P = (pts: Pt[]) => `M ${pts.map((p) => p.join(" ")).join(" L ")}`;
const poly = (pts: Pt[]) => `${P(pts)} Z`;

type Tone = "muted" | "ink" | "strong" | "signal";
const toneFill: Record<Tone, string> = {
  muted: "var(--ink-3)",
  ink: "var(--ink-2)",
  strong: "var(--ink)",
  signal: "var(--signal-ink)",
};

/** Label: mono 9 by default, sans for the rare block title */
function T({
  x,
  y,
  children,
  a = "start",
  tone = "muted",
  size = 9,
  sans = false,
  weight,
  at = 0,
  transform,
}: {
  x: number;
  y: number;
  children: ReactNode;
  a?: "start" | "middle" | "end";
  tone?: Tone;
  size?: number;
  sans?: boolean;
  weight?: number;
  at?: number;
  transform?: string;
}) {
  return (
    <text
      className="dg-n"
      style={{ ...dd(at), ...(sans ? {} : mono) }}
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={toneFill[tone]}
      textAnchor={a}
      transform={transform}
    >
      {children}
    </text>
  );
}

/** A path that draws itself in */
function Ln({
  d,
  at = 0,
  dur = 700,
  stroke = "var(--ink-2)",
  w = 1,
  dash,
  cap = "round",
}: {
  d: string;
  at?: number;
  dur?: number;
  stroke?: string;
  w?: number;
  dash?: string;
  cap?: "round" | "butt";
}) {
  if (dash)
    return (
      <path className="dg-n" style={dd(at)} d={d} fill="none" stroke={stroke} strokeWidth={w} strokeDasharray={dash} strokeLinecap={cap} />
    );
  return (
    <path
      className="dg-e"
      style={dd(at, dur)}
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={w}
      strokeLinecap={cap}
      strokeLinejoin="round"
    />
  );
}

/** Leader: origin dot, hairline, label */
function Lead({
  pts,
  label,
  tone = "muted",
  at = 0,
  a = "start",
  dy = 3,
}: {
  pts: Pt[];
  label: ReactNode;
  tone?: Tone;
  at?: number;
  a?: "start" | "end";
  dy?: number;
}) {
  const [x, y] = pts[pts.length - 1];
  const sig = tone === "signal";
  return (
    <g className="dg-n" style={dd(at)}>
      <circle cx={pts[0][0]} cy={pts[0][1]} r={1.5} fill={sig ? "var(--signal)" : "var(--ink-2)"} />
      <path d={P(pts)} fill="none" stroke={sig ? "var(--signal)" : "var(--ink-3)"} strokeWidth={0.6} />
      <text x={a === "start" ? x + 4 : x - 4} y={y + dy} fontSize={9} fill={toneFill[tone]} textAnchor={a} style={mono}>
        {label}
      </text>
    </g>
  );
}

/** 45° section hatch */
function Hatch({ id, gap = 4 }: { id: string; gap?: number }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2={gap} stroke="var(--ink-3)" strokeWidth="0.6" />
    </pattern>
  );
}

/** Small open arrowhead at b, pointing from a */
function head(a: Pt, b: Pt, s = 4) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const p1: Pt = [b[0] - s * Math.cos(ang - 0.5), b[1] - s * Math.sin(ang - 0.5)];
  const p2: Pt = [b[0] - s * Math.cos(ang + 0.5), b[1] - s * Math.sin(ang + 0.5)];
  return P([p1, b, p2]);
}

function Arrow({ pts, tone = "default", at = 0, dur = 500, dash }: { pts: Pt[]; tone?: "default" | "signal"; at?: number; dur?: number; dash?: string }) {
  const c = tone === "signal" ? "var(--signal)" : "var(--ink-3)";
  const w = tone === "signal" ? 1.2 : 0.8;
  const n = pts.length;
  return (
    <g>
      <Ln d={roundedPath(pts, 6)} at={at} dur={dur} stroke={c} w={w} dash={dash} />
      <path className="dg-h" style={dd(at + dur - 80)} d={head(pts[n - 2], pts[n - 1])} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

const C30 = Math.cos(Math.PI / 6);
/** Isometric projector: x runs right-down, y runs left-down, z up */
const isoAt =
  (ox: number, oy: number) =>
  (x: number, y: number, z = 0): Pt => [ox + (x - y) * C30, oy + (x + y) * 0.5 - z];

/* ------------------------------------------------------------------ */
/* 01 Complete payload assembly, section elevation                     */
/* ------------------------------------------------------------------ */

function Assembly() {
  const boards = [
    { y: 92, name: "Aux 1" },
    { y: 112, name: "Detector" },
    { y: 148, name: "Source" },
    { y: 168, name: "Aux 2" },
  ];
  const flow = roundedPath(
    [
      [158, 222],
      [108, 222],
      [108, 192],
      [82, 192],
      [82, 132],
      [110, 132],
    ],
    6,
  );
  return (
    <Art id="bio-assembly" label="Section through the complete bio-payload: pressure vessel housing the computer stack, fluidic card, reservoirs and actuator">
      <defs>
        <Hatch id="hx-bio-assembly" />
      </defs>

      {/* fluid moving from reservoir, through the actuator, into the card (under everything) */}
      <Pulse path={flow} dur={9} r={2.4} />

      {/* vessel in section: U body + lid */}
      <g className="dg-n" style={dd(0)}>
        <path d="M 62 70 V 252 H 258 V 70 H 248 V 242 H 72 V 70 Z" fill="url(#hx-bio-assembly)" stroke="var(--ink-2)" strokeWidth={1} />
        <rect x={56} y={58} width={208} height={12} fill="url(#hx-bio-assembly)" stroke="var(--ink-2)" strokeWidth={1} />
        {[67, 253].map((x) => (
          <g key={x}>
            <rect x={x - 4} y={53} width={8} height={5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.8} />
            <line x1={x} y1={58} x2={x} y2={92} stroke="var(--ink-2)" strokeWidth={0.8} strokeDasharray="1.5 1.5" />
          </g>
        ))}
      </g>

      {/* tubing */}
      <Ln d={flow} at={500} dur={700} stroke="var(--ink-3)" w={0.9} />

      {/* stack: standoffs, boards, components */}
      <g className="dg-n" style={dd(250)}>
        {[98, 204].map((x) => (
          <line key={x} x1={x} y1={92} x2={x} y2={172} stroke="var(--ink-3)" strokeWidth={0.8} />
        ))}
        {boards.map((b) => (
          <g key={b.name}>
            <rect x={92} y={b.y} width={120} height={4} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
            {[118, 146, 176].map((x, i) => (
              <rect key={x} x={x} y={b.y - (i === 1 ? 5 : 3)} width={i === 1 ? 18 : 10} height={i === 1 ? 5 : 3} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.6} />
            ))}
          </g>
        ))}
      </g>
      {/* the fluidic card, sandwiched */}
      <g className="dg-n" style={dd(450)}>
        <rect x={92} y={126} width={120} height={12} fill="var(--plate)" stroke="var(--signal)" strokeWidth={1.25} />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={104 + i * 12} y1={128} x2={104 + i * 12} y2={136} stroke="var(--signal)" strokeWidth={0.6} />
        ))}
      </g>

      {/* reservoirs + actuator */}
      <g className="dg-n" style={dd(600)}>
        <rect x={88} y={204} width={40} height={30} rx={3} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        <circle cx={108} cy={219} r={8} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
        <circle cx={108} cy={219} r={1.6} fill="var(--ink-2)" />
        {[140, 184].map((x) => (
          <g key={x}>
            <rect x={x} y={200} width={36} height={34} rx={5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
            <line x1={x + 5} y1={213} x2={x + 31} y2={213} stroke="var(--ink-3)" strokeWidth={0.6} strokeDasharray="2 2" />
          </g>
        ))}
      </g>

      <Lead pts={[[258, 64], [274, 64]]} label="Pressure vessel" at={800} />
      <Lead pts={[[212, 94], [274, 94]]} label="Computer stack" at={880} />
      <Lead pts={[[212, 132], [274, 132]]} label="Fluidic card" tone="signal" at={960} />
      <Lead pts={[[212, 150], [274, 150]]} label="Sensor module" at={1040} />
      <Lead pts={[[220, 217], [274, 217]]} label="Reservoirs" at={1120} />
      <Lead pts={[[108, 234], [108, 266], [274, 266]]} label="Actuator" at={1200} />
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 02 System block diagram                                             */
/* ------------------------------------------------------------------ */

function Blk({ x, y, w, h, t, s, at = 0 }: { x: number; y: number; w: number; h: number; t: string; s?: string; at?: number }) {
  return (
    <g className="dg-n" style={dd(at)}>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={2} fill="var(--plate)" stroke="var(--rule-strong)" strokeWidth={1} />
      <text x={x + 8} y={s ? y + h / 2 - 2 : y + h / 2 + 3.5} fontSize={10} fontWeight={500} fill="var(--ink)">
        {t}
      </text>
      {s && (
        <text x={x + 8} y={y + h / 2 + 11} fontSize={9} fill="var(--ink-3)" style={mono}>
          {s}
        </text>
      )}
    </g>
  );
}

function BlockDiagram() {
  return (
    <Art id="bio-blocks" label="System block diagram: sensor card read through multiplexers and ADC by the ATmega328P, which also drives the LED source board and the fluidics">
      <g className="dg-n" style={dd(0)}>
        <rect x={10.5} y={40.5} width={379} height={212} rx={6} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} strokeDasharray="1 2.5" />
      </g>
      <T x={10} y={270} at={100}>
        Pressure vessel
      </T>

      {/* the read chain, signal passes behind each block */}
      <Pulse path="M 108 138 H 296" dur={5} r={2.4} />
      <Arrow pts={[[108, 138], [131, 138]]} tone="signal" at={650} dur={250} />
      <Arrow pts={[[204, 138], [227, 138]]} tone="signal" at={800} dur={250} />
      <Arrow pts={[[272, 138], [295, 138]]} tone="signal" at={950} dur={250} />

      <Blk x={20} y={52} w={88} h={28} t="Source board" at={200} />
      <Blk x={20} y={116} w={88} h={44} t="Sensor card" s="81 electrodes" at={100} />
      <Blk x={20} y={196} w={88} h={28} t="Detector board" at={300} />
      <Blk x={132} y={52} w={72} h={28} t="LED drivers" at={350} />
      <Blk x={132} y={122} w={72} h={32} t="Multiplexers" at={400} />
      <Blk x={228} y={122} w={44} h={32} t="ADC" at={500} />
      <Blk x={296} y={116} w={84} h={44} t="ATmega328P" s="C++ firmware" at={600} />
      <Blk x={296} y={196} w={84} h={40} t="Fluidics" s="actuators" at={700} />

      {/* control + optical */}
      <Arrow pts={[[338, 116], [338, 66], [205, 66]]} at={900} dur={500} />
      <Arrow pts={[[132, 66], [109, 66]]} at={1150} dur={200} />
      <Arrow pts={[[338, 160], [338, 195]]} at={1000} dur={250} />
      <Arrow pts={[[108, 210], [250, 210], [250, 155]]} at={1100} dur={500} />
      <Arrow pts={[[64, 80], [64, 115]]} at={1250} dur={250} dash="1.5 2" />
      <Arrow pts={[[64, 160], [64, 195]]} at={1300} dur={250} dash="1.5 2" />
      <T x={70} y={101} at={1300}>
        light
      </T>
      <T x={70} y={181} at={1350}>
        light
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 03 27-well sensor card, 7 x 10 cm, pogo-pin interface               */
/* ------------------------------------------------------------------ */

function SensorCard() {
  const X = 60,
    Y = 62,
    W = 250,
    H = 175;
  const wx = (c: number) => 85 + c * 25;
  const wy = (r: number) => 95 + r * 35;
  const live = { r: 0, c: 8 };
  return (
    <Art id="bio-card" label="27-well sensor card, 7 by 10 cm, three electrodes per well, pogo-pin interface along one edge">
      <g className="dg-n" style={dd(0)}>
        <rect x={X + 0.5} y={Y + 0.5} width={W - 1} height={H - 1} rx={5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        {[
          [X + 10, Y + 10],
          [X + W - 10, Y + 10],
          [X + 10, Y + H - 10],
          [X + W - 10, Y + H - 10],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill="var(--paper)" stroke="var(--ink-3)" strokeWidth={0.8} />
        ))}
      </g>

      {/* fan-out from the bottom row to the pogo pads */}
      <g className="dg-n" style={dd(400)}>
        {Array.from({ length: 9 }, (_, c) => (
          <path key={c} d={P([[wx(c), wy(2) + 9.5], [wx(c), 190], [118 + c * 16.8, 198]])} fill="none" stroke="var(--ink-3)" strokeWidth={0.5} />
        ))}
        <rect x={104.5} y={198.5} width={161} height={23} rx={2} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.6} />
        {Array.from({ length: 20 }, (_, i) =>
          [205, 215].map((y) => <circle key={`${i}-${y}`} cx={112 + i * 7.9} cy={y} r={1.5} fill="var(--ink-3)" />),
        )}
      </g>

      {/* wells */}
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => {
          const on = r === live.r && c === live.c;
          const col = on ? "var(--signal)" : "var(--ink-3)";
          return (
            <g key={`${r}-${c}`} className="dg-n" style={dd(150 + (r * 9 + c) * 22)}>
              <circle cx={wx(c)} cy={wy(r)} r={9.5} fill="var(--plate)" stroke={on ? "var(--signal)" : "var(--ink-2)"} strokeWidth={on ? 1.25 : 0.8} />
              {[0, 1, 2].map((k) => {
                const a = (k / 3) * Math.PI * 2 - Math.PI / 2;
                return <circle key={k} cx={wx(c) + Math.cos(a) * 4.6} cy={wy(r) + Math.sin(a) * 4.6} r={1.6} fill={col} />;
              })}
            </g>
          );
        }),
      )}

      {/* multiplexer scan */}
      <g className="dg-pulse">
        <g>
          <line x1={wx(0)} y1={76} x2={wx(0)} y2={180} stroke="var(--ink-2)" strokeWidth={0.6} strokeDasharray="1 2" />
          <path d={`M ${wx(0) - 3} 74 L ${wx(0)} 78 L ${wx(0) + 3} 74`} fill="none" stroke="var(--ink-2)" strokeWidth={0.8} />
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0 0;${wx(8) - wx(0)} 0;0 0`}
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines={`${EASE};${EASE}`}
            dur="12s"
            repeatCount="indefinite"
          />
        </g>
      </g>

      {/* dimensions */}
      <g className="dg-n" style={dd(900)}>
        <path d={`M ${X} ${Y - 4} V ${Y - 18} M ${X + W} ${Y - 4} V ${Y - 18} M ${X} ${Y - 13} H ${X + W}`} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
        <path d={`${head([X + 20, Y - 13], [X, Y - 13], 4)} ${head([X + W - 20, Y - 13], [X + W, Y - 13], 4)}`} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
        <path d={`M ${X - 4} ${Y} H ${X - 18} M ${X - 4} ${Y + H} H ${X - 18} M ${X - 13} ${Y} V ${Y + H}`} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
        <path d={`${head([X - 13, Y + 20], [X - 13, Y], 4)} ${head([X - 13, Y + H - 20], [X - 13, Y + H], 4)}`} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
      </g>
      <T x={X + W / 2} y={Y - 17} a="middle" at={950}>
        10 cm
      </T>
      <T x={0} y={0} a="middle" at={950} transform={`translate(${X - 17} ${Y + H / 2}) rotate(-90)`}>
        7 cm
      </T>

      <Lead pts={[[wx(8) + 9.5, wy(0)], [320, wy(0)]]} label="pH, pNa, ref" tone="signal" at={1100} />
      <T x={324} y={wy(0) + 14} at={1150}>
        per well
      </T>
      <Lead pts={[[265, 216], [265, 256], [60, 256]]} label="Pogo-pin interface" a="start" at={1200} dy={-6} />
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 04 PANI electrode fabrication                                       */
/* ------------------------------------------------------------------ */

function Fabrication() {
  const cx = [70, 160, 250, 340];
  const steps: [string, string][] = [
    ["Polycarbonate", "substrate"],
    ["Conductive", "pads, traces"],
    ["PANI", "sensing film"],
    ["Ag/AgCl/PVB", "reference"],
  ];
  return (
    <Art id="bio-fab" label="PANI electrode fabrication in four steps, plan and section: polycarbonate substrate, conductive pads, PANI film, Ag/AgCl/PVB reference">
      <defs>
        <Hatch id="hx-bio-fab" gap={3.5} />
      </defs>
      <Ln d="M 38 64 H 372" stroke="var(--rule-strong)" w={0.6} at={0} dur={900} />
      <T x={38} y={150} at={400}>
        Plan
      </T>
      {cx.map((x, s) => {
        const at = 150 + s * 260;
        const sig = s === 2;
        return (
          <g key={x}>
            <T x={x - 32} y={58} tone={sig ? "signal" : "muted"} at={at}>
              {`Step ${s + 1}`}
            </T>
            {/* plan view */}
            <g className="dg-n" style={dd(at + 60)}>
              <rect x={x - 32} y={78} width={64} height={52} rx={2} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.8} />
              {s >= 1 &&
                [-12, 12].map((o) => (
                  <g key={o}>
                    <line x1={x + o} y1={100} x2={x + o} y2={124} stroke="var(--ink-2)" strokeWidth={1.6} />
                    <rect x={x + o - 3} y={122} width={6} height={5} fill="var(--ink-2)" />
                    <circle cx={x + o} cy={96} r={7} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
                  </g>
                ))}
              {s >= 2 && <circle cx={x - 12} cy={96} r={5} fill={sig ? "var(--signal)" : "var(--ink-3)"} opacity={sig ? 0.9 : 0.55} />}
              {s >= 3 && (
                <>
                  <circle cx={x + 12} cy={96} r={5} fill="var(--ink-2)" />
                  <circle cx={x + 12} cy={96} r={9.5} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} strokeDasharray="1 1.5" />
                </>
              )}
            </g>
            {/* section */}
            <g className="dg-n" style={dd(at + 120)}>
              <rect x={x - 32} y={166} width={64} height={10} fill="url(#hx-bio-fab)" stroke="var(--ink-2)" strokeWidth={0.8} />
              {s >= 1 && [-12, 12].map((o) => <rect key={o} x={x + o - 7} y={163.5} width={14} height={2.5} fill="var(--ink-2)" />)}
              {s >= 2 && (
                <path
                  d={`M ${x - 20} 163.5 Q ${x - 12} 152 ${x - 4} 163.5 Z`}
                  fill={sig ? "var(--signal)" : "var(--ink-3)"}
                  opacity={sig ? 0.9 : 0.55}
                />
              )}
              {s >= 3 && (
                <>
                  <path d={`M ${x + 5} 163.5 Q ${x + 12} 154 ${x + 19} 163.5 Z`} fill="var(--ink-2)" />
                  <path d={`M ${x + 1} 163.5 Q ${x + 12} 146 ${x + 23} 163.5`} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} strokeDasharray="1 1.5" />
                </>
              )}
            </g>
            <T x={x - 32} y={202} tone={sig ? "signal" : "ink"} at={at + 160}>
              {steps[s][0]}
            </T>
            <T x={x - 32} y={214} at={at + 180}>
              {steps[s][1]}
            </T>
            {s < 3 && (
              <path
                className="dg-h"
                style={dd(at + 200)}
                d={`${P([[x + 32, 104], [x + 58, 104]])} ${head([x + 32, 104], [x + 58, 104], 3.5)}`}
                fill="none"
                stroke="var(--ink-3)"
                strokeWidth={0.8}
                strokeLinecap="round"
              />
            )}
          </g>
        );
      })}
      <T x={38} y={186} at={500}>
        Section
      </T>
      <g className="dg-n" style={dd(700)}>
        <line x1={38} y1={236} x2={372} y2={236} stroke="var(--rule-strong)" strokeWidth={0.6} />
      </g>
      <T x={38} y={252} at={900}>
        Polyaniline on polycarbonate, 3 electrodes per well
      </T>

      {/* deposition onto the PANI pad */}
      <g className="dg-pulse">
        <circle cx={cx[2] - 12} r={1.6} fill="var(--signal)">
          <animate attributeName="cy" values="140;156" dur="4.5s" calcMode="spline" keySplines="0.5 0 0.8 1" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.25;0.8;1" dur="4.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Pressure vessel CAD: isometric + section A-A                     */
/* ------------------------------------------------------------------ */

function VesselCad() {
  const a = 90,
    b = 90,
    h = 70,
    lid = 14;
  const I = isoAt(110, 130);
  const top = poly([I(0, 0, h), I(a, 0, h), I(a, b, h), I(0, b, h)]);
  const right = poly([I(a, 0, h), I(a, b, h), I(a, b, 0), I(a, 0, 0)]);
  const front = poly([I(0, b, h), I(a, b, h), I(a, b, 0), I(0, b, 0)]);
  const plane = poly([I(a / 2, -10, h + 10), I(a / 2, b + 10, h + 10), I(a / 2, b + 10, -10), I(a / 2, -10, -10)]);
  const bolts: Pt[] = [
    [8, 8],
    [a / 2, 8],
    [a - 8, 8],
    [a - 8, b / 2],
    [a - 8, b - 8],
    [a / 2, b - 8],
    [8, b - 8],
    [8, b / 2],
  ];
  // section: 1.4 scale of the y-z plane
  const sx = 238,
    sy = 80,
    k = 1.4,
    sw = b * k,
    sh = h * k,
    wall = 9,
    ld = lid * k;
  return (
    <Art id="bio-vessel-cad" label="Pressure vessel CAD: isometric view with the section plane, and section A-A through lid and walls">
      <defs>
        <Hatch id="hx-bio-vcad" />
      </defs>
      <g className="dg-n" style={dd(0)}>
        <path d={right} fill="var(--paper)" stroke="var(--ink-2)" strokeWidth={1} strokeLinejoin="round" />
        <path d={front} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} strokeLinejoin="round" />
        <path d={top} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} strokeLinejoin="round" />
      </g>
      <Ln d={P([I(0, b, h - lid), I(a, b, h - lid), I(a, 0, h - lid)])} at={300} dur={500} stroke="var(--ink-3)" w={0.8} />
      <g className="dg-n" style={dd(450)}>
        {bolts.map(([x, y]) => {
          const [px, py] = I(x, y, h);
          return <ellipse key={`${x}-${y}`} cx={px} cy={py} rx={3.2} ry={1.85} fill="var(--paper)" stroke="var(--ink-3)" strokeWidth={0.7} />;
        })}
      </g>

      {/* section plane */}
      <g className="dg-pulse">
        <path d={plane} fill="var(--signal)" opacity={0.06}>
          <animate attributeName="opacity" values="0.05;0.13;0.05" keyTimes="0;0.5;1" calcMode="spline" keySplines={`${EASE};${EASE}`} dur="7s" repeatCount="indefinite" />
        </path>
      </g>
      <g className="dg-n" style={dd(700)}>
        <path d={P([I(a / 2, -12, h), I(a / 2, b, h), I(a / 2, b, 0), I(a / 2, b + 12, 0)])} fill="none" stroke="var(--signal)" strokeWidth={1} strokeDasharray="8 2 1.5 2" />
      </g>
      <T x={I(a / 2, -16, h)[0] - 2} y={I(a / 2, -16, h)[1] - 2} a="end" tone="signal" at={800}>
        A
      </T>
      <T x={I(a / 2, b + 16, 0)[0] + 2} y={I(a / 2, b + 16, 0)[1] + 8} tone="signal" at={800}>
        A
      </T>

      {/* section A-A */}
      <g className="dg-n" style={dd(500)}>
        <path
          d={`M ${sx} ${sy + ld} V ${sy + sh} H ${sx + sw} V ${sy + ld} H ${sx + sw - wall} V ${sy + sh - wall} H ${sx + wall} V ${sy + ld} Z`}
          fill="url(#hx-bio-vcad)"
          stroke="var(--ink-2)"
          strokeWidth={1}
        />
        <rect x={sx} y={sy} width={sw} height={ld} fill="url(#hx-bio-vcad)" stroke="var(--ink-2)" strokeWidth={1} />
        {[sx + wall / 2, sx + sw - wall / 2].map((x) => (
          <line key={x} x1={x} y1={sy - 4} x2={x} y2={sy + ld + 16} stroke="var(--ink-2)" strokeWidth={0.8} strokeDasharray="1.5 1.5" />
        ))}
        <line x1={sx + sw / 2} y1={sy - 8} x2={sx + sw / 2} y2={sy + sh + 8} stroke="var(--ink-3)" strokeWidth={0.5} strokeDasharray="8 2 1.5 2" />
      </g>
      <T x={sx + wall + 6} y={sy + ld + 14} at={900}>
        Cavity
      </T>

      <g className="dg-n" style={dd(1000)}>
        <line x1={32} y1={238} x2={368} y2={238} stroke="var(--rule-strong)" strokeWidth={0.6} />
      </g>
      <T x={32} y={254} tone="ink" at={1050}>
        Isometric
      </T>
      <T x={sx} y={254} tone="signal" at={1100}>
        Section A-A
      </T>
      <T x={sx} y={266} at={1150}>
        Al 6061, Fusion 360
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 06 Fabricated pressure vessel: machined lid + pressure test         */
/* ------------------------------------------------------------------ */

function VesselBuilt() {
  const gx = 300,
    gy = 140,
    gr = 50;
  const ang = (t: number) => ((135 + t * 270) * Math.PI) / 180;
  const needle = 0.78; // qualitative
  return (
    <Art id="bio-vessel-built" label="Fabricated pressure vessel: CNC-milled aluminum lid with bolt pattern, plumbed to a pressure gauge for the 60 psi test">
      <defs>
        <clipPath id="clip-bio-vbuilt">
          <rect x={44} y={64} width={152} height={152} rx={8} />
        </clipPath>
      </defs>
      <g className="dg-n" style={dd(0)}>
        <rect x={40.5} y={60.5} width={159} height={159} rx={10} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
      </g>
      {/* face-mill scallops */}
      <g className="dg-n" style={dd(250)} clipPath="url(#clip-bio-vbuilt)">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={10 + i * 18} cy={140} r={84} fill="none" stroke="var(--rule-strong)" strokeWidth={0.6} />
        ))}
      </g>
      <g className="dg-n" style={dd(400)}>
        <rect x={44.5} y={64.5} width={151} height={151} rx={8} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
        {(
          [
            [54, 74],
            [120, 74],
            [186, 74],
            [54, 140],
            [186, 140],
            [54, 206],
            [120, 206],
            [186, 206],
          ] as Pt[]
        ).map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={4.2} fill="var(--paper)" stroke="var(--ink-2)" strokeWidth={0.8} />
            <circle cx={x} cy={y} r={1.6} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
          </g>
        ))}
        <path
          d={poly(Array.from({ length: 6 }, (_, i) => [120 + 11 * Math.cos((i * Math.PI) / 3), 140 + 11 * Math.sin((i * Math.PI) / 3)] as Pt))}
          fill="var(--plate)"
          stroke="var(--ink-2)"
          strokeWidth={1}
        />
        <circle cx={120} cy={140} r={4.5} fill="none" stroke="var(--ink-2)" strokeWidth={0.8} />
      </g>

      {/* line to gauge */}
      <Ln d={`M 131 140 H ${gx - gr}`} at={600} dur={500} stroke="var(--ink-2)" w={1} />
      <Ln d={`M 131 144 H ${gx - gr}`} at={600} dur={500} stroke="var(--ink-3)" w={0.6} />

      {/* gauge */}
      <g className="dg-n" style={dd(750)}>
        <circle cx={gx} cy={gy} r={gr} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        <circle cx={gx} cy={gy} r={gr - 6} fill="none" stroke="var(--rule-strong)" strokeWidth={0.6} />
        {Array.from({ length: 29 }, (_, i) => {
          const t = i / 28;
          const major = i % 7 === 0;
          const r1 = gr - 8,
            r2 = r1 - (major ? 8 : 4);
          return (
            <line
              key={i}
              x1={gx + r1 * Math.cos(ang(t))}
              y1={gy + r1 * Math.sin(ang(t))}
              x2={gx + r2 * Math.cos(ang(t))}
              y2={gy + r2 * Math.sin(ang(t))}
              stroke={major ? "var(--ink-2)" : "var(--ink-3)"}
              strokeWidth={major ? 0.9 : 0.6}
            />
          );
        })}
      </g>
      <T x={gx} y={gy + 26} a="middle" at={900}>
        psi
      </T>
      <g className="dg-n" style={dd(1000)}>
        <g transform={`rotate(${(135 + needle * 270) % 360} ${gx} ${gy})`}>
          <g>
            <line x1={gx - 8} y1={gy} x2={gx + gr - 12} y2={gy} stroke="var(--signal)" strokeWidth={1.4} strokeLinecap="round" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={`0 ${gx} ${gy};2.5 ${gx} ${gy};0 ${gx} ${gy}`}
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines={`${EASE};${EASE}`}
              dur="8s"
              repeatCount="indefinite"
            />
          </g>
        </g>
        <circle cx={gx} cy={gy} r={3.4} fill="var(--ink)" />
      </g>

      <g className="dg-n" style={dd(1100)}>
        <line x1={40} y1={238} x2={360} y2={238} stroke="var(--rule-strong)" strokeWidth={0.6} />
      </g>
      <T x={40} y={254} tone="ink" at={1150}>
        Al 6061, CNC-milled
      </T>
      <T x={40} y={266} at={1200}>
        Bolted lid
      </T>
      <T x={250} y={254} tone="signal" at={1250}>
        Tested to 60 psi
      </T>
      <T x={250} y={266} at={1300}>
        7-day hold at 1 atm
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 07 Three fluidic card iterations                                    */
/* ------------------------------------------------------------------ */

const DROP = "M 0 -5 C 2.6 -1.6 4 0.6 4 2.6 A 4 4 0 0 1 -4 2.6 C -4 0.6 -2.6 -1.6 0 -5 Z";

function Iterations() {
  const cards = [30, 152, 274];
  const Y = 74,
    CW = 96,
    CH = 136;
  const wells = (x: number) =>
    Array.from({ length: 9 }, (_, r) =>
      [0, 1, 2].map((c) => <circle key={`${r}-${c}`} cx={x + 30 + c * 18} cy={Y + 20 + r * 12} r={3.4} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.7} />),
    );
  const ch: string[] = [
    // 1: three straight runs between manifolds
    `M ${cards[0] + 48} ${Y} V ${Y + 9} M ${cards[0] + 30} ${Y + 9} H ${cards[0] + 66} M ${cards[0] + 30} ${Y + 9} V ${Y + 127} M ${cards[0] + 48} ${Y + 9} V ${Y + 127} M ${cards[0] + 66} ${Y + 9} V ${Y + 127} M ${cards[0] + 30} ${Y + 127} H ${cards[0] + 66} M ${cards[0] + 48} ${Y + 127} V ${Y + CH}`,
    // 2: one serpentine
    roundedPath(
      [
        [cards[1] + 30, Y],
        [cards[1] + 30, Y + 126],
        [cards[1] + 48, Y + 126],
        [cards[1] + 48, Y + 10],
        [cards[1] + 66, Y + 10],
        [cards[1] + 66, Y + CH],
      ],
      6,
    ),
    // 3: row-fed ladder between two buses
    [
      `M ${cards[2]} ${Y + 20} H ${cards[2] + 14} V ${Y + 116}`,
      `M ${cards[2] + 82} ${Y + 20} V ${Y + 116} H ${cards[2] + CW}`,
      ...Array.from({ length: 9 }, (_, r) => `M ${cards[2] + 14} ${Y + 20 + r * 12} H ${cards[2] + 82}`),
    ].join(" "),
  ];
  return (
    <Art id="bio-iterations" label="Three fluidic card iterations: the first two leaked, the third sealed">
      {cards.map((x, i) => {
        const final = i === 2;
        const at = i * 220;
        return (
          <g key={x}>
            <T x={x} y={64} tone={final ? "signal" : "muted"} at={at}>
              {`Iteration ${i + 1}`}
            </T>
            <g className="dg-n" style={dd(at + 80)}>
              <rect
                x={x + 0.5}
                y={Y + 0.5}
                width={CW - 1}
                height={CH - 1}
                rx={4}
                fill="var(--plate)"
                stroke={final ? "var(--signal)" : "var(--ink-2)"}
                strokeWidth={final ? 1.25 : 1}
              />
            </g>
            <Ln d={ch[i]} at={at + 200} dur={800} stroke="var(--ink-3)" w={0.9} />
            <g className="dg-n" style={dd(at + 300)}>
              {wells(x)}
            </g>
            <T x={x} y={228} tone={final ? "ink" : "muted"} at={at + 400}>
              {final ? "Sealed" : "Leakage"}
            </T>
            {final && (
              <T x={x} y={240} at={at + 450}>
                Up to 1 mL/min
              </T>
            )}
          </g>
        );
      })}

      {/* static leak on iteration 2 */}
      <g className="dg-n" style={dd(800)}>
        <path d={DROP} transform={`translate(${cards[1] + CW + 5} ${Y + 96})`} fill="var(--ink-3)" opacity={0.7} />
        <path d={`M ${cards[1] + CW - 2} ${Y + 86} q 3 4 7 5`} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
      </g>
      {/* dripping seam on iteration 1 */}
      <g className="dg-n" style={dd(600)}>
        <path d={`M ${cards[0] + CW - 2} ${Y + 56} q 3 4 7 5`} fill="none" stroke="var(--ink-3)" strokeWidth={0.6} />
      </g>
      <g className="dg-pulse">
        <path d={DROP} fill="var(--ink-3)" opacity={0.7}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${cards[0] + CW + 5} ${Y + 66};${cards[0] + CW + 5} ${Y + 66};${cards[0] + CW + 5} ${Y + 92}`}
            keyTimes="0;0.55;1"
            calcMode="spline"
            keySplines={`0 0 1 1;0.55 0 0.9 0.6`}
            dur="6s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.35;0.8;1" dur="6s" repeatCount="indefinite" />
        </path>
      </g>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 08 Iteration 3: channel routing and well layout                     */
/* ------------------------------------------------------------------ */

function FluidicDetail() {
  const wx = (c: number) => 80 + c * 30;
  const wy = (r: number) => 100 + r * 50;
  const route = roundedPath(
    [
      [58, 100],
      [340, 100],
      [340, 150],
      [60, 150],
      [60, 200],
      [342, 200],
    ],
    16,
  );
  return (
    <Art id="bio-fluidic" label="Iteration 3 fluidic card: channel from inlet through all 27 wells to outlet">
      <g className="dg-n" style={dd(0)}>
        <rect x={40.5} y={58.5} width={319} height={183} rx={6} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
      </g>
      {/* channel walls */}
      <g className="dg-n" style={dd(250)}>
        <path d={route} fill="none" stroke="var(--ink-3)" strokeWidth={7} strokeLinejoin="round" />
        <path d={route} fill="none" stroke="var(--plate)" strokeWidth={5.4} strokeLinejoin="round" />
      </g>
      <Ln d={route} at={450} dur={1100} stroke="var(--signal)" w={0.9} />
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => (
          <g key={`${r}-${c}`} className="dg-n" style={dd(300 + (r * 9 + c) * 18)}>
            <circle cx={wx(c)} cy={wy(r)} r={10.5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
            <circle cx={wx(c)} cy={wy(r)} r={6.5} fill="none" stroke="var(--rule-strong)" strokeWidth={0.6} />
          </g>
        )),
      )}
      {(
        [
          [58, 100],
          [342, 200],
        ] as Pt[]
      ).map(([x, y], i) => (
        <g key={i} className="dg-n" style={dd(800 + i * 100)}>
          <circle cx={x} cy={y} r={6.5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
          <circle cx={x} cy={y} r={2.4} fill="var(--ink-2)" />
        </g>
      ))}
      <T x={50} y={82} tone="ink" at={900}>
        Inlet
      </T>
      <T x={350} y={227} a="end" tone="ink" at={950}>
        Outlet
      </T>
      <Lead pts={[[wx(4), wy(1) + 10.5], [wx(4) + 12, 176], [236, 176]]} label="Well" at={1000} />

      <Pulse path={route} dur={14} r={2.4} />

      <g className="dg-n" style={dd(1050)}>
        <line x1={40} y1={252} x2={360} y2={252} stroke="var(--rule-strong)" strokeWidth={0.6} />
      </g>
      <T x={40} y={268} at={1100}>
        Iteration 3, zero leakage
      </T>
      <T x={360} y={268} a="end" tone="signal" at={1150}>
        Up to 1 mL/min
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 09 Exploded 4-board stack                                           */
/* ------------------------------------------------------------------ */

function Exploded() {
  const A = 80;
  const layers = [
    { name: "Aux 1", kind: "aux1" },
    { name: "Detector", kind: "det" },
    { name: "Fluidic card", kind: "card" },
    { name: "Source", kind: "src" },
    { name: "Aux 2", kind: "aux2" },
  ] as const;
  const y0 = (k: number) => 44 + k * 35;
  const grid = (k: number) =>
    Array.from({ length: 3 }, (_, i) => Array.from({ length: 9 }, (_, j) => isoAt(160, y0(k))(28 + i * 12, 8 + j * 8))).flat();
  return (
    <Art id="bio-exploded" label="Exploded 4-board PCB stack, top to bottom: Aux 1, Detector, fluidic card, Source, Aux 2">
      {/* standoffs */}
      <g className="dg-n" style={dd(0)}>
        {(
          [
            [5, 5],
            [A - 5, 5],
            [A - 5, A - 5],
            [5, A - 5],
          ] as Pt[]
        ).map(([x, y]) => {
          const [px, t] = isoAt(160, y0(0))(x, y);
          const [, bt] = isoAt(160, y0(4))(x, y);
          return <line key={`${x}-${y}`} x1={px} y1={t} x2={px} y2={bt + 3} stroke="var(--ink-3)" strokeWidth={0.6} strokeDasharray="1 2" />;
        })}
      </g>
      {layers
        .map((L, k) => ({ ...L, k }))
        .reverse()
        .map(({ name, kind, k }) => {
          const I = isoAt(160, y0(k));
          const card = kind === "card";
          const edge = card ? "var(--signal)" : "var(--ink-2)";
          const off = (k - 2) * 2.5;
          const rect = (x: number, y: number, w: number, h: number, fill = "var(--plate)") => (
            <path key={`${x}-${y}`} d={poly([I(x, y), I(x + w, y), I(x + w, y + h), I(x, y + h)])} fill={fill} stroke="var(--ink-3)" strokeWidth={0.6} />
          );
          const [rx, ry] = I(A, 0);
          return (
            <g key={name} className="dg-n" style={dd(k * 140)}>
              <g>
                <path d={poly([I(0, A), I(A, A), [I(A, A)[0], I(A, A)[1] + 3], [I(0, A)[0], I(0, A)[1] + 3]])} fill="var(--plate)" stroke={edge} strokeWidth={0.8} />
                <path d={poly([I(A, 0), I(A, A), [I(A, A)[0], I(A, A)[1] + 3], [I(A, 0)[0], I(A, 0)[1] + 3]])} fill="var(--paper)" stroke={edge} strokeWidth={0.8} />
                <path d={poly([I(0, 0), I(A, 0), I(A, A), I(0, A)])} fill="var(--plate)" stroke={edge} strokeWidth={card ? 1.25 : 1} strokeLinejoin="round" />
                {kind === "aux1" && [rect(14, 14, 22, 22), rect(46, 12, 14, 10), rect(46, 30, 14, 10), ...Array.from({ length: 8 }, (_, i) => rect(10 + i * 8, 66, 4, 4, "var(--ink-3)"))]}
                {kind === "aux2" && [rect(12, 40, 16, 26), rect(40, 44, 26, 16), ...Array.from({ length: 8 }, (_, i) => rect(10 + i * 8, 10, 4, 4, "var(--ink-3)"))]}
                {kind === "det" && grid(k).map(([x, y], i) => <rect key={i} x={x - 1.6} y={y - 1.1} width={3.2} height={2.2} fill="var(--ink-3)" />)}
                {kind === "src" && grid(k).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.5} fill="var(--ink-3)" />)}
                {card && grid(k).map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={2.6} ry={1.5} fill="none" stroke="var(--signal)" strokeWidth={0.6} />)}
                <path d={P([[rx + 4, ry + 1.5], [262, ry + 1.5]])} fill="none" stroke={card ? "var(--signal)" : "var(--ink-3)"} strokeWidth={0.6} />
                <circle cx={rx + 4} cy={ry + 1.5} r={1.4} fill={card ? "var(--signal)" : "var(--ink-2)"} />
                <text x={268} y={ry + 4.5} fontSize={9} fill={card ? "var(--signal-ink)" : "var(--ink-2)"} style={mono}>
                  {name}
                </text>
                {off !== 0 && (
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0 0;0 ${off};0 0`}
                    keyTimes="0;0.5;1"
                    calcMode="spline"
                    keySplines={`${EASE};${EASE}`}
                    dur="9s"
                    repeatCount="indefinite"
                  />
                )}
              </g>
            </g>
          );
        })}
      <T x={268} y={y0(2) + 54} at={900}>
        Sandwiched
      </T>
      <T x={268} y={y0(2) + 66} at={900}>
        between boards
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 10 KiCad layout                                                     */
/* ------------------------------------------------------------------ */

type Pads = { l: Pt[]; r: Pt[]; t: Pt[]; b: Pt[] };

function soic(cx: number, cy: number, n: number, pitch = 4, bw = 14): { el: ReactNode; p: Pads } {
  const span = (n - 1) * pitch;
  const bh = span + 6;
  const l: Pt[] = [],
    r: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const y = cy - span / 2 + i * pitch;
    l.push([cx - bw / 2 - 3, y]);
    r.push([cx + bw / 2 + 3, y]);
  }
  const el = (
    <g key={`${cx}-${cy}`}>
      <rect x={cx - bw / 2} y={cy - bh / 2} width={bw} height={bh} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
      <circle cx={cx - bw / 2 + 3} cy={cy - bh / 2 + 3} r={1} fill="var(--ink-3)" />
      {[...l, ...r].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 2.8} y={y - 0.9} width={5.6} height={1.8} fill="var(--ink-3)" />
      ))}
    </g>
  );
  return { el, p: { l, r, t: [], b: [] } };
}

function tqfp(cx: number, cy: number, n = 8, pitch = 3.6, body = 30): { el: ReactNode; p: Pads } {
  const span = (n - 1) * pitch;
  const o = body / 2 + 3.2;
  const p: Pads = { l: [], r: [], t: [], b: [] };
  for (let i = 0; i < n; i++) {
    const d = -span / 2 + i * pitch;
    p.l.push([cx - o, cy + d]);
    p.r.push([cx + o, cy + d]);
    p.t.push([cx + d, cy - o]);
    p.b.push([cx + d, cy + o]);
  }
  const el = (
    <g>
      <rect x={cx - body / 2} y={cy - body / 2} width={body} height={body} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
      <circle cx={cx - body / 2 + 4} cy={cy - body / 2 + 4} r={1.3} fill="var(--ink-3)" />
      {[...p.l, ...p.r].map(([x, y]) => (
        <rect key={`h${x}-${y}`} x={x - 2.6} y={y - 0.8} width={5.2} height={1.6} fill="var(--ink-3)" />
      ))}
      {[...p.t, ...p.b].map(([x, y]) => (
        <rect key={`v${x}-${y}`} x={x - 0.8} y={y - 2.6} width={1.6} height={5.2} fill="var(--ink-3)" />
      ))}
    </g>
  );
  return { el, p };
}

function Layout() {
  const mcu = tqfp(200, 146);
  const adc1 = soic(106, 116, 4),
    adc2 = soic(106, 176, 4);
  const mux1 = soic(296, 116, 8, 3.6, 16),
    mux2 = soic(296, 176, 8, 3.6, 16);
  const drv = soic(200, 84, 4);
  const hdr = Array.from({ length: 12 }, (_, i) => [134 + i * 12, 232] as Pt);
  const m = mcu.p;

  // traces: 45° routing, hand-laid
  const tr: string[] = [
    // adc2 -> mcu left pins (lower)
    P([adc2.p.r[0], [134, 170], [150, 154], [m.l[5][0], m.l[5][1]]]),
    P([adc2.p.r[1], [138, 174], [156, 156], [170, 156], m.l[6]]),
    // mux -> mcu right pins
    P([mux1.p.l[5], [260, 134], [252, 142], m.r[2]]),
    P([mux1.p.l[6], [262, mux1.p.l[6][1]], [253, m.r[3][1]], m.r[3]]),
    P([mux2.p.l[1], [262, 165.8], [250, 153.8], m.r[5]]),
    P([mux2.p.l[2], [264, 169.4], [252, 157.4], m.r[6]]),
    // driver -> mcu top
    P([drv.p.r[3], [224, 90], [224, 110], [m.t[6][0], 118], m.t[6]]),
    P([drv.p.l[3], [176, 90], [176, 110], [m.t[1][0], 118], m.t[1]]),
    // mcu bottom -> header
    ...[2, 3, 4, 5].map((i) => P([m.b[i], [m.b[i][0], 184], [hdr[i + 2][0], 216], hdr[i + 2]])),
    // mux outputs to board edge (to the card)
    ...[0, 1, 2, 3].map((i) => P([mux1.p.r[i], [330, mux1.p.r[i][1]], [340, mux1.p.r[i][1] - 10]])),
    ...[4, 5, 6, 7].map((i) => P([mux2.p.r[i], [330, mux2.p.r[i][1]], [340, mux2.p.r[i][1] + 10]])),
  ];
  // the highlighted net: ADC 1 data to the MCU
  const net = P([adc1.p.r[2], [132, adc1.p.r[2][1]], [150, m.l[2][1] + 0], m.l[2]]);
  const vias: Pt[] = [
    [150, 136],
    [224, 110],
    [176, 110],
    [252, 142],
    [150, 154],
  ];
  return (
    <Art id="bio-layout" label="KiCad PCB layout: ATmega328P with ADCs, multiplexers and LED driver, routed traces and header">
      <g className="dg-n" style={dd(0)}>
        <rect x={50.5} y={52.5} width={299} height={199} rx={8} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        {(
          [
            [64, 66],
            [336, 66],
            [64, 238],
            [336, 238],
          ] as Pt[]
        ).map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={5.5} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
            <circle cx={x} cy={y} r={3} fill="var(--paper)" stroke="var(--ink-3)" strokeWidth={0.6} />
          </g>
        ))}
      </g>
      <g className="dg-n" style={dd(200)}>
        {mcu.el}
        {adc1.el}
        {adc2.el}
        {mux1.el}
        {mux2.el}
        {drv.el}
        {hdr.map(([x, y]) => (
          <rect key={x} x={x - 3} y={y - 3} width={6} height={6} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
        ))}
      </g>
      {tr.map((d, i) => (
        <Ln key={i} d={d} at={450 + i * 40} dur={450} stroke="var(--ink-3)" w={0.8} />
      ))}
      <Ln d={net} at={1000} dur={600} stroke="var(--signal)" w={1.3} />
      <g className="dg-n" style={dd(900)}>
        {vias.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={2.2} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.7} />
          </g>
        ))}
      </g>
      <T x={200} y={188} a="middle" tone="ink" at={700}>
        ATmega328P
      </T>
      <T x={106} y={96} a="middle" at={750}>
        ADC
      </T>
      <T x={106} y={200} a="middle" at={750}>
        ADC
      </T>
      <T x={296} y={92} a="middle" at={800}>
        Mux
      </T>
      <T x={296} y={206} a="middle" at={800}>
        Mux
      </T>
      <T x={214} y={73} at={850}>
        LED driver
      </T>

      {/* cursor */}
      <g className="dg-pulse">
        <g>
          <path d="M -7 0 H -2.5 M 2.5 0 H 7 M 0 -7 V -2.5 M 0 2.5 V 7" stroke="var(--ink)" strokeWidth={0.8} />
          <rect x={-1.2} y={-1.2} width={2.4} height={2.4} fill="none" stroke="var(--ink)" strokeWidth={0.6} />
          <animateMotion
            dur="16s"
            repeatCount="indefinite"
            path="M 150 136 C 170 100, 236 92, 252 142 S 196 212, 150 154 S 128 150, 150 136"
            calcMode="spline"
            keyPoints="0;0.33;0.33;0.66;0.66;1"
            keyTimes="0;0.25;0.35;0.6;0.7;1"
            keySplines={`${EASE};0 0 1 1;${EASE};0 0 1 1;${EASE}`}
          />
        </g>
      </g>
      <T x={50} y={270} at={1100}>
        KiCad 6.0
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 11 Assembled stack, side elevation                                  */
/* ------------------------------------------------------------------ */

function Assembled() {
  const X0 = 60,
    X1 = 280;
  const wells = Array.from({ length: 9 }, (_, i) => 88 + i * 22);
  const beam = wells[4];
  const boards = [
    { y: 70, name: "Aux 1" },
    { y: 108, name: "Detector" },
    { y: 160, name: "Source" },
    { y: 198, name: "Aux 2" },
  ];
  return (
    <Art id="bio-assembled" label="Assembled computer stack in side elevation, fluidic card sandwiched between detector and source boards, light passing through a well">
      {/* standoffs */}
      <g className="dg-n" style={dd(0)}>
        {[X0 + 6, X1 - 12].map((x) => (
          <rect key={x} x={x} y={75} width={6} height={123} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.7} />
        ))}
        {/* header pins */}
        {[X1 - 34, X1 - 30, X1 - 26].map((x) => (
          <line key={x} x1={x} y1={75} x2={x} y2={198} stroke="var(--ink-3)" strokeWidth={0.5} />
        ))}
      </g>
      {boards.map((b, i) => (
        <g key={b.name} className="dg-n" style={dd(120 + i * 110)}>
          <rect x={X0} y={b.y} width={X1 - X0} height={5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
          {i === 0 &&
            [90, 132, 176, 214].map((x, j) => (
              <rect key={x} x={x} y={b.y - (j % 2 ? 7 : 4)} width={j % 2 ? 22 : 12} height={j % 2 ? 7 : 4} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.6} />
            ))}
          {i === 3 &&
            [96, 150, 206].map((x, j) => (
              <rect key={x} x={x} y={b.y - (j === 1 ? 7 : 4)} width={j === 1 ? 24 : 14} height={j === 1 ? 7 : 4} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.6} />
            ))}
          {i === 1 && wells.map((x) => <rect key={x} x={x - 3} y={b.y + 5} width={6} height={3} fill="var(--ink-3)" />)}
          {i === 2 && wells.map((x) => <path key={x} d={`M ${x - 3} ${b.y} A 3 3 0 0 1 ${x + 3} ${b.y} Z`} fill="var(--ink-3)" />)}
        </g>
      ))}

      {/* fluidic card */}
      <g className="dg-n" style={dd(560)}>
        <rect x={X0 - 12} y={132} width={X1 - X0 + 12} height={16} fill="var(--plate)" stroke="var(--signal)" strokeWidth={1.25} />
        {wells.map((x) => (
          <rect key={x} x={x - 4} y={135} width={8} height={10} fill="var(--paper)" stroke="var(--signal)" strokeWidth={0.6} />
        ))}
        {[136, 144].map((y) => (
          <line key={y} x1={X0 - 12} y1={y} x2={X0 - 30} y2={y} stroke="var(--ink-2)" strokeWidth={0.9} />
        ))}
      </g>
      <Ln d={`M ${X0 - 30} 136 H ${X0 - 34} Q ${X0 - 40} 136 ${X0 - 40} 142 V 250`} at={750} dur={500} stroke="var(--ink-3)" w={0.8} />
      <Ln d={`M ${X0 - 30} 144 H ${X0 - 30} Q ${X0 - 32} 144 ${X0 - 32} 146 V 250`} at={750} dur={500} stroke="var(--ink-3)" w={0.8} />

      {/* light path through one well */}
      <g className="dg-n" style={dd(900)}>
        <line x1={beam} y1={157} x2={beam} y2={117} stroke="var(--signal)" strokeWidth={0.7} strokeDasharray="1.5 2" />
      </g>
      <g className="dg-pulse">
        <rect x={beam - 0.9} width={1.8} height={5} rx={0.9} fill="var(--signal)">
          <animate attributeName="y" values="154;114" dur="3.6s" calcMode="spline" keySplines={EASE} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="3.6s" repeatCount="indefinite" />
        </rect>
      </g>

      {boards.map((b, i) => (
        <Lead key={b.name} pts={[[X1, b.y + 2.5], [300, b.y + 2.5]]} label={b.name} tone="ink" at={1000 + i * 60} />
      ))}
      <Lead pts={[[X1, 140], [300, 140]]} label="Fluidic card" tone="signal" at={1100} />
      <T x={X0 - 40} y={266} at={1200}>
        Tubing
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 12 AIT: calibration responses                                       */
/* ------------------------------------------------------------------ */

function Ait() {
  const panels = [
    { t: "pH", unit: "mV", x: "pH", k: -1, v: "71.0 mV/pH", s: "R² > 0.99" },
    { t: "pNa", unit: "mV", x: "pNa", k: -1, v: "75.2 mV/pNa", s: "R² > 0.99" },
    { t: "Absorbance", unit: "Abs", x: "g/L", k: 1, v: "R² = 0.994", s: "0.1 to 5 g/L" },
  ];
  const jit = [1.8, -1.4, 2.2, -2, 0.8, -1.2];
  const top = 76,
    bot = 190;
  return (
    <Art id="bio-ait" label="Integrated test results: linear pH, pNa and absorbance responses (qualitative)">
      {panels.map((p, i) => {
        const x0 = 36 + i * 120;
        const lo: Pt = [x0 + 10, p.k < 0 ? top + 10 : bot - 10];
        const hi: Pt = [x0 + 92, p.k < 0 ? bot - 10 : top + 10];
        const sig = i === 0;
        const at = i * 200;
        return (
          <g key={p.t}>
            <T x={x0} y={52} sans size={10} weight={500} tone="strong" at={at}>
              {p.t}
            </T>
            <T x={x0} y={68} at={at + 50}>
              {p.unit}
            </T>
            <g className="dg-n" style={dd(at + 60)}>
              <rect x={x0} y={top} width={100} height={bot - top} fill="var(--plate)" />
            </g>
            <Ln d={P([[x0, top], [x0, bot], [x0 + 100, bot]])} at={at + 80} dur={500} stroke="var(--ink-3)" w={0.8} />
            <Ln d={P([lo, hi])} at={at + 350} dur={600} stroke={sig ? "var(--signal)" : "var(--ink-2)"} w={sig ? 1.3 : 1} />
            <g className="dg-n" style={dd(at + 500)}>
              {jit.map((j, n) => {
                const t = n / 5;
                return (
                  <circle
                    key={n}
                    cx={lo[0] + (hi[0] - lo[0]) * t}
                    cy={lo[1] + (hi[1] - lo[1]) * t + j}
                    r={2.2}
                    fill="var(--plate)"
                    stroke="var(--ink-2)"
                    strokeWidth={0.8}
                  />
                );
              })}
            </g>
            <T x={x0 + 100} y={204} a="end" at={at + 150}>
              {p.x}
            </T>
            <T x={x0} y={228} tone={sig ? "signal" : "ink"} at={at + 700}>
              {p.v}
            </T>
            <T x={x0} y={240} at={at + 750}>
              {p.s}
            </T>
          </g>
        );
      })}
      <g className="dg-pulse">
        <circle r={5.5} fill="var(--signal)" opacity={0.14}>
          <animateMotion dur="10s" repeatCount="indefinite" path={`M ${46} ${top + 10} L ${128} ${bot - 10}`} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines={`${EASE};${EASE}`} />
        </circle>
        <circle r={2.4} fill="var(--signal)">
          <animateMotion dur="10s" repeatCount="indefinite" path={`M ${46} ${top + 10} L ${128} ${bot - 10}`} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines={`${EASE};${EASE}`} />
        </circle>
      </g>
      <g className="dg-n" style={dd(1100)}>
        <line x1={36} y1={256} x2={376} y2={256} stroke="var(--rule-strong)" strokeWidth={0.6} />
      </g>
      <T x={36} y={270} at={1150}>
        Response time 2.7 to 5.6 s
      </T>
    </Art>
  );
}

/* ------------------------------------------------------------------ */
/* 13 36-hour yeast cultivation                                        */
/* ------------------------------------------------------------------ */

function Yeast() {
  const L = 62,
    R = 330,
    TOP = 70,
    BOT = 216;
  const sig = (t: number, c: number, k: number) => {
    const f = (u: number) => 1 / (1 + Math.exp(-(u - c) * k));
    return (f(t) - f(0)) / (f(1) - f(0));
  };
  const N = 48;
  const ts = Array.from({ length: N + 1 }, (_, i) => i / N);
  const xs = ts.map((t) => L + (R - L) * t);
  const ya = ts.map((t) => BOT - (BOT - TOP) * sig(t, 0.5, 9));
  const yp = ts.map((t) => TOP + (BOT - TOP) * sig(t, 0.42, 7));
  const line = (ys: number[]) => P(xs.map((x, i) => [+x.toFixed(1), +ys[i].toFixed(1)] as Pt));
  const refT = [4, 12, 20, 28, 36, 44];
  const vals = (a: number[]) => a.map((v) => v.toFixed(1)).join(";");
  return (
    <Art id="bio-yeast" label="36-hour yeast cultivation: absorbance rises from 0.3 to 0.8 while pH falls from 7.5 to 4.0, tracking commercial reference readings">
      <g className="dg-n" style={dd(0)}>
        <rect x={L} y={TOP} width={R - L} height={BOT - TOP} fill="var(--plate)" />
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={L} y1={TOP + (BOT - TOP) * f} x2={R} y2={TOP + (BOT - TOP) * f} stroke="var(--rule)" strokeWidth={0.6} />
        ))}
      </g>
      <Ln d={P([[L, TOP], [L, BOT], [R, BOT], [R, TOP]])} at={100} dur={700} stroke="var(--ink-3)" w={0.8} />
      <Ln d={line(yp)} at={500} dur={1000} stroke="var(--ink-2)" w={1.1} />
      <Ln d={line(ya)} at={600} dur={1000} stroke="var(--signal)" w={1.4} />
      <g className="dg-n" style={dd(1100)}>
        {refT.map((i, n) => (
          <g key={i}>
            <circle cx={xs[i]} cy={ya[i] + (n % 2 ? 2 : -2)} r={2.4} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.8} />
            <circle cx={xs[i]} cy={yp[i] + (n % 2 ? -2 : 2)} r={2.4} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.8} />
          </g>
        ))}
      </g>

      <T x={L} y={58} tone="signal" at={300}>
        Absorbance
      </T>
      <T x={R} y={58} a="end" tone="ink" at={350}>
        pH
      </T>
      <T x={L - 6} y={TOP + 3} a="end" at={400}>
        0.8
      </T>
      <T x={L - 6} y={BOT + 3} a="end" at={400}>
        0.3
      </T>
      <T x={R + 6} y={TOP + 3} at={400}>
        7.5
      </T>
      <T x={R + 6} y={BOT + 3} at={400}>
        4.0
      </T>
      <T x={L} y={230} a="middle" at={450}>
        0
      </T>
      <T x={(L + R) / 2} y={230} a="middle" at={450}>
        Time
      </T>
      <T x={R} y={230} a="middle" at={450}>
        36 h
      </T>
      <g className="dg-n" style={dd(1200)}>
        <circle cx={L + 3} cy={260} r={2.4} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.8} />
      </g>
      <T x={L + 12} y={263} at={1200}>
        Commercial reference
      </T>

      {/* recording cursor */}
      <g className="dg-pulse">
        <g>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.93;1" dur="12s" repeatCount="indefinite" />
          <line y1={TOP} y2={BOT} stroke="var(--ink-3)" strokeWidth={0.6} strokeDasharray="1 2">
            <animate attributeName="x1" values={vals(xs)} dur="12s" repeatCount="indefinite" />
            <animate attributeName="x2" values={vals(xs)} dur="12s" repeatCount="indefinite" />
          </line>
          <circle r={2.6} fill="var(--signal)">
            <animate attributeName="cx" values={vals(xs)} dur="12s" repeatCount="indefinite" />
            <animate attributeName="cy" values={vals(ya)} dur="12s" repeatCount="indefinite" />
          </circle>
          <circle r={2.6} fill="var(--ink-2)">
            <animate attributeName="cx" values={vals(xs)} dur="12s" repeatCount="indefinite" />
            <animate attributeName="cy" values={vals(yp)} dur="12s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
    </Art>
  );
}

/** Gallery illustrations for bio-cubesat, keyed by the MDX `art` id. */
export const art: Record<string, ComponentType> = {
  "bio-cubesat/assembly": Assembly,
  "bio-cubesat/block-diagram": BlockDiagram,
  "bio-cubesat/sensor-card": SensorCard,
  "bio-cubesat/electrode-fab": Fabrication,
  "bio-cubesat/vessel-cad": VesselCad,
  "bio-cubesat/vessel-built": VesselBuilt,
  "bio-cubesat/fluidic-iterations": Iterations,
  "bio-cubesat/fluidic-detail": FluidicDetail,
  "bio-cubesat/stack-exploded": Exploded,
  "bio-cubesat/pcb-layout": Layout,
  "bio-cubesat/stack-assembled": Assembled,
  "bio-cubesat/ait-results": Ait,
  "bio-cubesat/yeast-cultivation": Yeast,
};
