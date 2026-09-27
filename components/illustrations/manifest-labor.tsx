import type { ComponentType } from "react";
import { Art, Pulse } from "@/components/diagrams/kit";

/*
  Manifest Labor gallery illustrations. Qualitative technical drawings:
  no invented datasets, values or specs. Signal orange marks welding,
  the current focus, or the one path that matters on each board.
*/

const dl = (d: number, dur?: number) =>
  ({ "--d": d, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;
const ease = "0.4 0 0.2 1";

function T({
  x,
  y,
  children,
  s = 9.5,
  fill = "var(--ink-3)",
  a = "start",
  sans = false,
  w,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  s?: number;
  fill?: string;
  a?: "start" | "middle" | "end";
  sans?: boolean;
  w?: number;
}) {
  return (
    <text x={x} y={y} fontSize={s} fill={fill} textAnchor={a} fontWeight={w} style={sans ? undefined : mono}>
      {children}
    </text>
  );
}

/** Ellipse as a closed path starting at its leftmost point (for animateMotion) */
const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy}`;

/* 01 Landscape: the benchmarked datasets sit in lab demos and simulation;
   skilled trade work sits outside them. Structure only, no sizes or rankings. */
function DatasetLandscape() {
  const lab = { cx: 118, cy: 160, rx: 80, ry: 60 };
  const tr = { cx: 304, cy: 160, rx: 62, ry: 60 };
  const sets = ["RT-X", "Open X-Embodiment", "DROID"];
  const trades = ["Welding", "Pipefitting", "Fabrication"];
  const rowY = (i: number) => 142 + i * 20;
  const gy = 160;
  const gx0 = lab.cx + lab.rx;
  const gx1 = tr.cx - tr.rx;
  return (
    <Art id="manifest-landscape" label="Existing robotics datasets sit in lab demonstrations and simulation; skilled trade work sits outside their coverage">
      <g className="dg-n" style={dl(0)}>
        <ellipse cx={lab.cx} cy={lab.cy} rx={lab.rx} ry={lab.ry} fill="var(--plate)" stroke="var(--rule-strong)" strokeWidth={0.8} />
        <T x={lab.cx} y={lab.cy - lab.ry - 10} a="middle" fill="var(--ink-2)">
          Lab demos, simulation
        </T>
      </g>
      {sets.map((s, i) => (
        <g key={s} className="dg-n" style={dl(200 + i * 90)}>
          <circle cx={62} cy={rowY(i) - 3} r={3} fill="var(--ink-2)" />
          <T x={72} y={rowY(i)} fill="var(--ink-2)">
            {s}
          </T>
        </g>
      ))}
      {/* the gap between the two domains */}
      <g className="dg-n" style={dl(800)} stroke="var(--ink-3)" strokeWidth={0.8}>
        <line x1={gx0} y1={gy} x2={gx1} y2={gy} strokeDasharray="1.5 2" />
        <circle cx={gx0} cy={gy} r={1.8} fill="var(--ink-3)" stroke="none" />
        <circle cx={gx1} cy={gy} r={1.8} fill="var(--signal)" stroke="none" />
      </g>
      <g className="dg-n" style={dl(850)}>
        <T x={(gx0 + gx1) / 2} y={gy - 7} a="middle">
          gap
        </T>
      </g>
      <path className="dg-e" style={dl(500, 1000)} d={ellipsePath(tr.cx, tr.cy, tr.rx, tr.ry)} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={1} />
      <g className="dg-n" style={dl(700)}>
        <T x={tr.cx} y={tr.cy - tr.ry - 10} a="middle" fill="var(--ink-2)">
          Skilled trades
        </T>
      </g>
      {trades.map((t, i) => (
        <g key={t} className="dg-n" style={dl(900 + i * 90)}>
          <circle cx={268} cy={rowY(i) - 3} r={3} fill={i === 0 ? "var(--signal)" : "none"} stroke={i === 0 ? "none" : "var(--ink-3)"} strokeWidth={0.8} />
          <T x={278} y={rowY(i)} fill={i === 0 ? "var(--signal-ink)" : "var(--ink-3)"}>
            {t}
          </T>
        </g>
      ))}
      <Pulse path={ellipsePath(tr.cx, tr.cy, tr.rx, tr.ry)} dur={12} r={2} />
    </Art>
  );
}

/* 02 Gap: the trades are largely absent from the benchmarked datasets
   (one region, not per-cell scores); this project starts with welding. */
function TradeGap() {
  const colX = [226, 290, 354];
  const cols = ["Welding", "Pipefitting", "Fabrication"];
  const rows = ["RT-X", "Open X-Embodiment", "DROID"];
  const rowY = [118, 146, 174];
  const mY = 228;
  const reg = { x: 194, y: 102, w: 192, h: 88 };
  return (
    <Art id="manifest-trade-gap" label="Skilled trade coverage gaps: welding, pipefitting and fabrication are largely absent from the benchmarked datasets; this project starts with welding">
      <defs>
        <pattern id="manifest-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--rule)" strokeWidth="1" />
        </pattern>
      </defs>
      {/* trades bracket and column heads */}
      <g className="dg-n" style={dl(0)}>
        <path d={`M ${reg.x} 64 L ${reg.x} 60 L ${reg.x + reg.w} 60 L ${reg.x + reg.w} 64`} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
        <T x={reg.x + reg.w / 2} y={53} a="middle">
          Skilled trades
        </T>
      </g>
      {cols.map((c, i) => (
        <text key={c} className="dg-n" style={dl(100 + i * 50)} x={colX[i]} y={84} fontSize={10} textAnchor="middle" fill={i === 0 ? "var(--signal-ink)" : "var(--ink-2)"}>
          {c}
        </text>
      ))}
      <g className="dg-n" style={dl(150)}>
        <line x1={40} y1={94} x2={386} y2={94} stroke="var(--rule-strong)" strokeWidth={0.8} />
        <line x1={40} y1={202} x2={386} y2={202} stroke="var(--rule-strong)" strokeWidth={0.8} />
      </g>
      {rows.map((name, j) => (
        <g key={name} className="dg-n" style={dl(250 + j * 80)}>
          <text x={40} y={rowY[j] + 3.5} fontSize={10} fill="var(--ink-2)">
            {name}
          </text>
        </g>
      ))}
      {/* one empty region: largely absent */}
      <g className="dg-n" style={dl(550)}>
        <rect x={reg.x + 0.5} y={reg.y + 0.5} width={reg.w - 1} height={reg.h - 1} rx={3} fill="url(#manifest-hatch)" stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="1.5 2.5" />
        <rect x={reg.x + reg.w / 2 - 44} y={reg.y + reg.h / 2 - 9} width={88} height={16} fill="var(--plate)" />
        <T x={reg.x + reg.w / 2} y={reg.y + reg.h / 2 + 2.5} a="middle">
          largely absent
        </T>
      </g>
      {/* this project: welding first, the pipeline stays trade-agnostic */}
      <g className="dg-n" style={dl(800)}>
        <text x={40} y={mY + 3.5} fontSize={10} fontWeight={500} fill="var(--ink)" wordSpacing="0.12em">
          Manifest Labor
        </text>
        <line x1={colX[0] + 8} y1={mY} x2={colX[2] - 5} y2={mY} stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="1.5 2.5" />
        <circle cx={colX[1]} cy={mY} r={4.5} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.8} />
        <circle cx={colX[2]} cy={mY} r={4.5} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.8} />
        <circle cx={colX[0]} cy={mY} r={6.5} fill="var(--signal)" />
        <T x={colX[0]} y={mY + 26} a="middle" fill="var(--signal-ink)">
          current focus
        </T>
        <T x={(colX[1] + colX[2]) / 2} y={mY + 26} a="middle">
          trade-agnostic
        </T>
      </g>
      <g className="dg-pulse">
        <circle cx={colX[0]} cy={mY} r={6.5} fill="none" stroke="var(--signal)" strokeWidth={0.8}>
          <animate attributeName="r" values="6.5;13.5" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.2 0 0.2 1" keyTimes="0;1" />
          <animate attributeName="opacity" values="0.7;0" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.2 0 0.2 1" keyTimes="0;1" />
        </circle>
      </g>
    </Art>
  );
}

/* 03 Capture pipeline: four modalities on one clock, merged into an aligned record */
function CapturePipeline() {
  const x0 = 100,
    x1 = 282;
  const lanes = [
    { name: "Video", y: 86 },
    { name: "IMU", y: 134 },
    { name: "Force", y: 182 },
    { name: "Audio", y: 230 },
  ];
  const bx = 316,
    bw = 50,
    by = 110,
    bh = 96;
  const inY = lanes.map((_, i) => by + 12 + i * 24);
  const sine = (y: number, amp: number, k: number, ph: number) =>
    Array.from({ length: 61 }, (_, i) => {
      const x = x0 + (i / 60) * (x1 - x0);
      return `${i ? "L" : "M"} ${x.toFixed(1)} ${(y + amp * Math.sin(i * k + ph) * (0.6 + 0.4 * Math.sin(i / 14))).toFixed(1)}`;
    }).join(" ");
  const force = `M ${x0} ${lanes[2].y + 12} C ${x0 + 20} ${lanes[2].y + 12} ${x0 + 26} ${lanes[2].y - 10} ${x0 + 48} ${lanes[2].y - 10} S ${x0 + 90} ${lanes[2].y - 6} ${x0 + 110} ${lanes[2].y - 11} S ${x0 + 140} ${lanes[2].y - 8} ${x0 + 152} ${lanes[2].y - 4} S ${x0 + 166} ${lanes[2].y + 12} ${x1} ${lanes[2].y + 12}`;
  const audio = Array.from({ length: 46 }, (_, i) => {
    const x = x0 + 2 + i * 3.95;
    const env = 0.35 + 0.65 * Math.sin((i / 45) * Math.PI) ** 0.6;
    const h = (3 + (((i * 37) % 11) / 11) * 11) * env;
    return <line key={i} x1={x} y1={lanes[3].y - h} x2={x} y2={lanes[3].y + h} />;
  });
  return (
    <Art id="manifest-pipeline" label="Multi-modal capture pipeline: video, IMU, force and audio recorded on one clock and merged into a time-aligned record">
      {lanes.map((l, i) => (
        <g key={l.name} className="dg-n" style={dl(i * 80)}>
          <line x1={40} y1={l.y + 24} x2={x1 + 8} y2={l.y + 24} stroke="var(--rule)" strokeWidth={0.8} />
          <text x={40} y={l.y + 3.5} fontSize={10} fill="var(--ink-2)">
            {l.name}
          </text>
        </g>
      ))}
      <g className="dg-n" style={dl(80)}>
        <line x1={40} y1={lanes[0].y - 24} x2={x1 + 8} y2={lanes[0].y - 24} stroke="var(--rule)" strokeWidth={0.8} />
      </g>
      {/* video: two camera angles as frame strips */}
      <g className="dg-n" style={dl(250)} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.8}>
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <rect x={x0 + i * 20.5} y={lanes[0].y - 13} width={16.5} height={11} rx={1} />
            <rect x={x0 + 8 + i * 20.5} y={lanes[0].y + 2} width={16.5} height={11} rx={1} />
          </g>
        ))}
      </g>
      {/* IMU: three axes */}
      <path className="dg-e" style={dl(350, 900)} d={sine(lanes[1].y, 11, 0.32, 0)} pathLength={1} fill="none" stroke="var(--ink-2)" strokeWidth={0.9} />
      <path className="dg-e" style={dl(400, 900)} d={sine(lanes[1].y, 8, 0.24, 1.8)} pathLength={1} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
      <path className="dg-e" style={dl(450, 900)} d={sine(lanes[1].y, 5, 0.45, 3.4)} pathLength={1} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="1.5 1.5" />
      {/* force/torque */}
      <path className="dg-e" style={dl(500, 900)} d={force} pathLength={1} fill="none" stroke="var(--ink-2)" strokeWidth={1} />
      {/* audio */}
      <g className="dg-n" style={dl(600)} stroke="var(--ink-3)" strokeWidth={1}>
        {audio}
      </g>
      {/* merge into the aligned record */}
      {lanes.map((l, i) => (
        <g key={l.name}>
          <path
            className="dg-e"
            style={dl(800 + i * 60, 500)}
            d={`M ${x1 + 8} ${l.y} C ${x1 + 22} ${l.y} ${bx - 14} ${inY[i]} ${bx} ${inY[i]}`}
            pathLength={1}
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth={0.8}
          />
          <circle className="dg-n" style={dl(800)} cx={x1 + 8} cy={l.y} r={1.8} fill="var(--ink-3)" />
        </g>
      ))}
      <g className="dg-n" style={dl(1000)}>
        <rect x={bx + 0.5} y={by + 0.5} width={bw - 1} height={bh - 1} rx={2} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
        {[1, 2, 3].map((i) => (
          <line key={i} x1={bx} y1={by + i * 24} x2={bx + bw} y2={by + i * 24} stroke="var(--rule-strong)" strokeWidth={0.7} />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <line key={i} x1={bx + i * 10} y1={by} x2={bx + i * 10} y2={by + bh} stroke="var(--rule)" strokeWidth={0.7} />
        ))}
        <T x={bx + bw / 2} y={by + bh + 16} a="middle">
          aligned
        </T>
      </g>
      {/* shared clock: one playhead crosses every modality at once */}
      <g className="dg-pulse">
        <g>
          <line x1={x0} y1={lanes[0].y - 24} x2={x0} y2={lanes[3].y + 24} stroke="var(--signal)" strokeWidth={1.1} />
          <path d={`M ${x0 - 3.5} ${lanes[0].y - 24} L ${x0 + 3.5} ${lanes[0].y - 24} L ${x0} ${lanes[0].y - 19} Z`} fill="var(--signal)" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0 0; ${x1 - x0} 0`}
            keyTimes="0;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1"
            dur="9s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur="9s" repeatCount="indefinite" />
        </g>
      </g>
    </Art>
  );
}

/* 04 Schema: an episode record with streams on a shared timestamp axis */
function DataSchema() {
  const tx = 44;
  const rows: { k: string; v?: string; depth: number }[] = [
    { k: "episode", depth: 0 },
    { k: "trade", v: "welding", depth: 1 },
    { k: "process", v: "TIG, MIG", depth: 1 },
    { k: "streams", depth: 1 },
    { k: "video", depth: 2 },
    { k: "imu", depth: 2 },
    { k: "force_torque", depth: 2 },
    { k: "audio", depth: 2 },
    { k: "t", depth: 1 },
  ];
  const ry = [76, 98, 118, 138, 160, 182, 204, 226, 254];
  const kx = (d: number) => tx + d * 16;
  const px = 212,
    pw = 12,
    n = 13,
    gap = 1.5;
  const sx = (i: number) => px + i * (pw + gap);
  const win = 3; // slices per training sample
  const steps = [0, 3, 6, 9];
  const vals = steps.map((s) => `${s * (pw + gap)} 0`);
  return (
    <Art id="manifest-schema" label="Structured data format: an episode record with trade, process and four streams aligned on a shared timestamp axis">
      {/* key tree */}
      <g className="dg-n" style={dl(0)} fill="none" stroke="var(--rule-strong)" strokeWidth={0.7}>
        {rows.map((r, i) => {
          if (r.depth === 0) return null;
          let p = i - 1;
          while (p >= 0 && rows[p].depth >= r.depth) p--;
          const gx = kx(r.depth - 1) + 3;
          return <path key={i} d={`M ${gx} ${ry[p] + 4} L ${gx} ${ry[i] - 3} L ${kx(r.depth) - 4} ${ry[i] - 3}`} />;
        })}
      </g>
      {rows.map((r, i) => (
        <g key={r.k} className="dg-n" style={dl(100 + i * 50)}>
          <T x={kx(r.depth)} y={ry[i]} fill={r.depth === 0 ? "var(--ink)" : r.k === "t" ? "var(--signal-ink)" : "var(--ink-2)"} w={r.depth === 0 ? 600 : undefined}>
            {r.k}
          </T>
          {r.v && (
            <T x={120} y={ry[i]} fill="var(--ink-3)">
              {r.v}
            </T>
          )}
        </g>
      ))}
      {/* stream tracks, one row per key */}
      {[4, 5, 6, 7].map((row, j) => (
        <g key={row} className="dg-n" style={dl(500 + j * 80)}>
          <line x1={150} y1={ry[row] - 3} x2={px - 6} y2={ry[row] - 3} stroke="var(--rule)" strokeWidth={0.7} strokeDasharray="1 2" />
          {Array.from({ length: n }, (_, i) => {
            const y = ry[row] - 3;
            const h = j === 0 ? 13 : 8;
            return <rect key={i} x={sx(i) + 0.5} y={y - h / 2} width={pw - 1} height={h} rx={1} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={0.7} />;
          })}
        </g>
      ))}
      {/* shared clock */}
      <g className="dg-n" style={dl(900)}>
        <line x1={150} y1={ry[8] - 3} x2={px - 6} y2={ry[8] - 3} stroke="var(--rule)" strokeWidth={0.7} strokeDasharray="1 2" />
        <line x1={px} y1={ry[8] - 3} x2={sx(n) - gap} y2={ry[8] - 3} stroke="var(--signal)" strokeWidth={1} />
        {Array.from({ length: n + 1 }, (_, i) => (
          <line key={i} x1={sx(i) - gap / 2} y1={ry[8] - 7} x2={sx(i) - gap / 2} y2={ry[8] + 1} stroke="var(--signal)" strokeWidth={0.9} />
        ))}
        {Array.from({ length: n + 1 }, (_, i) => (
          <line key={`g${i}`} x1={sx(i) - gap / 2} y1={ry[4] - 12} x2={sx(i) - gap / 2} y2={ry[8] - 7} stroke="var(--rule)" strokeWidth={0.6} strokeDasharray="1 2" />
        ))}
      </g>
      {/* one training sample: a window of slices across every stream */}
      <g className="dg-pulse">
        <rect x={px - 3} y={ry[4] - 14} width={win * (pw + gap) + 4.5} height={ry[8] - ry[4] + 18} rx={2} fill="var(--signal)" fillOpacity={0.05} stroke="var(--signal)" strokeWidth={1}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={[...vals, vals[3], vals[0]].join(";")}
            keyTimes="0;0.22;0.44;0.66;0.9;1"
            calcMode="spline"
            keySplines={Array(5).fill("0.65 0 0.35 1").join(";")}
            dur="10s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </Art>
  );
}

/* 05 Minimum viable rig, plan view: bench, workpiece, three cameras, IMU,
   force/torque plate under the fixture, microphone. The torch traces the seam. */
function CaptureRig() {
  const seamY = 153;
  const sx0 = 164,
    sx1 = 276;
  const shoulder: [number, number] = [232, 240];
  const hand = (tx: number): [number, number] => [tx + 12, 184];
  const kt = "0;0.7;0.78;1";
  const ks = `${ease};0 0 1 1;${ease}`;
  const travel = sx1 - sx0;
  const cams: { x: number; y: number; a: number; to: [number, number][] }[] = [
    { x: 64, y: 118, a: 12, to: [[150, 128], [150, 178]] },
    { x: 220, y: 54, a: 90, to: [[150, 128], [290, 128]] },
    { x: 360, y: 104, a: 160, to: [[290, 128], [290, 178]] },
  ];
  return (
    <Art id="manifest-rig" label="Minimum viable capture rig, plan view: welding bench, three cameras, IMU on the operator, force/torque plate under the fixture and a microphone">
      {/* bench */}
      <g className="dg-n" style={dl(0)}>
        <rect x={120.5} y={100.5} width={200} height={108} rx={2} fill="var(--plate)" stroke="var(--rule-strong)" strokeWidth={0.8} />
        <line x1={120} y1={200} x2={320} y2={200} stroke="var(--rule)" strokeWidth={0.7} />
      </g>
      {/* force/torque plate, hidden under the fixture */}
      <g className="dg-n" style={dl(150)}>
        <circle cx={220} cy={seamY} r={44} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="3 3" />
        <line x1={220} y1={seamY - 50} x2={220} y2={seamY - 38} stroke="var(--ink-3)" strokeWidth={0.6} />
        <line x1={220} y1={seamY + 38} x2={220} y2={seamY + 50} stroke="var(--ink-3)" strokeWidth={0.6} />
      </g>
      {/* workpiece: two plates, one seam */}
      <g className="dg-n" style={dl(250)} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.8}>
        <rect x={150} y={128} width={140} height={23} rx={0.5} />
        <rect x={150} y={155} width={140} height={23} rx={0.5} />
      </g>
      {/* cameras and their fields of view, onto the workpiece corners */}
      {cams.map((c, i) => (
        <g key={i}>
          {c.to.map(([x, y], k) => (
            <line key={k} className="dg-n" style={dl(500 + i * 80)} x1={c.x} y1={c.y} x2={x} y2={y} stroke="var(--ink-3)" strokeWidth={0.6} strokeDasharray="1.5 2.5" />
          ))}
          <g className="dg-n" style={dl(400 + i * 80)} transform={`translate(${c.x} ${c.y}) rotate(${c.a})`}>
            <rect x={-16} y={-6} width={13} height={12} rx={1.5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
            <path d="M -3 -3.5 L 3 -6 L 3 6 L -3 3.5 Z" fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} strokeLinejoin="round" />
          </g>
        </g>
      ))}
      {/* microphone on a stand */}
      <g className="dg-n" style={dl(700)}>
        <circle cx={344} cy={214} r={5.5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
        <circle cx={344} cy={214} r={1.6} fill="var(--ink-2)" />
      </g>
      {/* operator, plan symbol */}
      <g className="dg-n" style={dl(600)}>
        <ellipse cx={210} cy={246} rx={30} ry={10} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
        <circle cx={210} cy={244} r={8.5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
        <rect x={236} y={236} width={7} height={7} rx={1} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
      </g>
      {/* weld bead, drawn as the torch travels */}
      <g className="dg-pulse">
        <path d={`M ${sx0} ${seamY} L ${sx1} ${seamY}`} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={2} strokeLinecap="round" strokeDasharray="1 1">
          <animate attributeName="stroke-dashoffset" values="1;0;0;1" keyTimes="0;0.7;0.9;1" calcMode="spline" keySplines={`${ease};0 0 1 1;0 0 1 1`} dur="10s" begin="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.78;0.9;1" dur="10s" begin="2.4s" repeatCount="indefinite" />
        </path>
      </g>
      {/* arm, glove IMU and torch */}
      <g className="dg-n" style={dl(750)}>
        <line x1={shoulder[0]} y1={shoulder[1]} x2={hand(sx0)[0]} y2={hand(sx0)[1]} stroke="var(--ink-2)" strokeWidth={0.9} strokeLinecap="round">
          <animate attributeName="x2" values={`${hand(sx0)[0]};${hand(sx1)[0]};${hand(sx1)[0]};${hand(sx0)[0]}`} keyTimes={kt} calcMode="spline" keySplines={ks} dur="10s" begin="2.4s" repeatCount="indefinite" />
        </line>
        <g>
          <line x1={hand(sx0)[0]} y1={hand(sx0)[1]} x2={sx0 + 1.5} y2={seamY + 3} stroke="var(--ink-2)" strokeWidth={1.1} strokeLinecap="round" />
          <rect x={hand(sx0)[0] - 3.5} y={hand(sx0)[1] - 3.5} width={7} height={7} rx={1} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
          <circle cx={sx0} cy={seamY} r={5} fill="var(--signal)" opacity={0.18} />
          <circle cx={sx0} cy={seamY} r={2.2} fill="var(--signal)" />
          <animateTransform attributeName="transform" type="translate" values={`0 0; ${travel} 0; ${travel} 0; 0 0`} keyTimes={kt} calcMode="spline" keySplines={ks} dur="10s" begin="2.4s" repeatCount="indefinite" />
        </g>
      </g>
      {/* callouts: leader from each element to its label */}
      <g className="dg-n" style={dl(1000)} fill="none" stroke="var(--ink-3)" strokeWidth={0.6}>
        <path d="M 226 50 L 240 42 L 250 42" />
        <path d="M 243 242 L 262 262 L 280 262" />
        <path d={`M 150 ${seamY + 25} L 110 222 L 94 222`} />
        <path d="M 194.8 117 L 164 84 L 150 84" />
      </g>
      <g className="dg-n" style={dl(1050)}>
        <T x={254} y={45}>
          Cameras, multi-angle
        </T>
        <T x={146} y={87} a="end">
          Force/torque
        </T>
        <T x={344} y={234} a="middle">
          Microphone
        </T>
        <T x={284} y={265}>
          IMU
        </T>
        <T x={90} y={225} a="end">
          Workpiece
        </T>
      </g>
    </Art>
  );
}

/** Gallery illustrations for manifest-labor, keyed by the MDX `art` id. */
export const art: Record<string, ComponentType> = {
  "manifest-labor/dataset-landscape": DatasetLandscape,
  "manifest-labor/trade-gap": TradeGap,
  "manifest-labor/capture-pipeline": CapturePipeline,
  "manifest-labor/data-schema": DataSchema,
  "manifest-labor/capture-rig": CaptureRig,
};
