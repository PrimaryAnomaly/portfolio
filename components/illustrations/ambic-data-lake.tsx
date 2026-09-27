import type { ComponentType } from "react";
import { Art, Pulse } from "@/components/diagrams/kit";

/*
  AMBIC gallery illustrations. Drawn stand-ins for future screenshots:
  interface pieces are wireframe abstractions (bars, not fake data),
  schematics are drawn on the drafting grid. One signal element and one
  ambient loop per board.
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
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  s?: number;
  fill?: string;
  a?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} fontSize={s} fill={fill} textAnchor={a} style={mono}>
      {children}
    </text>
  );
}

/** A plain bar standing in for a line of interface text */
function Bar({ x, y, w, tone = "var(--rule-strong)", h = 3 }: { x: number; y: number; w: number; tone?: string; h?: number }) {
  return <rect x={x} y={y - h / 2} width={w} height={h} rx={h / 2} fill={tone} />;
}

/** Application window: plate, hairline frame, slim top bar */
function Win({ x, y, w, h, d = 0 }: { x: number; y: number; w: number; h: number; d?: number }) {
  return (
    <g className="dg-n" style={dl(d)}>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={3} fill="var(--plate)" stroke="var(--rule-strong)" strokeWidth={0.8} />
      <line x1={x} y1={y + 16} x2={x + w} y2={y + 16} stroke="var(--rule)" strokeWidth={0.8} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 9 + i * 7} cy={y + 8} r={1.8} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
      ))}
    </g>
  );
}

function FileGlyph({ x, y, tone = "var(--ink-3)" }: { x: number; y: number; tone?: string }) {
  return (
    <g fill="none" stroke={tone} strokeWidth={0.8}>
      <rect x={x + 0.4} y={y + 0.4} width={7.2} height={9.2} rx={0.8} />
      <line x1={x + 2} y1={y + 3.5} x2={x + 6} y2={y + 3.5} />
      <line x1={x + 2} y1={y + 5.5} x2={x + 6} y2={y + 5.5} />
      <line x1={x + 2} y1={y + 7.5} x2={x + 6} y2={y + 7.5} />
    </g>
  );
}

function FolderGlyph({ x, y, open = false, tone = "var(--ink-3)" }: { x: number; y: number; open?: boolean; tone?: string }) {
  return (
    <path
      d={
        open
          ? `M ${x} ${y + 9} L ${x} ${y + 1} L ${x + 4} ${y + 1} L ${x + 5.5} ${y + 2.5} L ${x + 10} ${y + 2.5} L ${x + 10} ${y + 4.5} M ${x} ${y + 9} L ${x + 2} ${y + 4.5} L ${x + 12} ${y + 4.5} L ${x + 10} ${y + 9} Z`
          : `M ${x} ${y + 9} L ${x} ${y + 1} L ${x + 4} ${y + 1} L ${x + 5.5} ${y + 2.5} L ${x + 11} ${y + 2.5} L ${x + 11} ${y + 9} Z`
      }
      fill="none"
      stroke={tone}
      strokeWidth={0.8}
      strokeLinejoin="round"
    />
  );
}

/* 01 Dashboard: files, dataset list, metadata panel with a live preview */
function Dashboard() {
  const X = 44,
    Y = 44,
    W = 312,
    H = 208;
  const s1 = X + 78,
    s2 = X + 214;
  const tree = [
    [0, 64],
    [1, 50],
    [1, 42],
    [2, 36],
    [2, 40],
    [1, 46],
    [0, 58],
    [1, 38],
  ];
  const rows = [70, 92, 58, 84, 66, 76, 52];
  const sel = 2;
  const spark = `M ${s2 + 12} ${Y + 58} C ${s2 + 26} ${Y + 57} ${s2 + 32} ${Y + 50} ${s2 + 42} ${Y + 44} S ${s2 + 62} ${Y + 34} ${s2 + 86} ${Y + 33}`;
  return (
    <Art id="ambic-dashboard" label="Dataset dashboard with file browser, dataset list and metadata panel">
      <Win x={X} y={Y} w={W} h={H} d={0} />
      <g className="dg-n" style={dl(150)}>
        <line x1={s1} y1={Y + 16} x2={s1} y2={Y + H} stroke="var(--rule)" strokeWidth={0.8} />
        <line x1={s2} y1={Y + 16} x2={s2} y2={Y + H} stroke="var(--rule)" strokeWidth={0.8} />
        <rect x={X + 0.8} y={Y + 16.8} width={s1 - X - 1.6} height={H - 17.6} fill="var(--paper)" opacity={0.6} />
      </g>
      {/* file tree */}
      <g className="dg-n" style={dl(250)}>
        {tree.map(([depth, w], i) => {
          const y = Y + 34 + i * 16;
          const x = X + 10 + depth * 9;
          return (
            <g key={i}>
              {depth < 2 ? <FolderGlyph x={x} y={y - 5} open={i < 6 && tree[i + 1]?.[0] > depth} /> : <FileGlyph x={x + 1} y={y - 5} />}
              <Bar x={x + 16} y={y} w={Math.min(w - depth * 9, s1 - x - 24)} />
            </g>
          );
        })}
      </g>
      {/* dataset list */}
      <g className="dg-n" style={dl(400)}>
        <Bar x={s1 + 10} y={Y + 30} w={52} tone="var(--ink-3)" />
        <line x1={s1} y1={Y + 40} x2={s2} y2={Y + 40} stroke="var(--rule)" strokeWidth={0.8} />
        {rows.map((w, i) => {
          const y = Y + 55 + i * 21;
          const on = i === sel;
          return (
            <g key={i}>
              {on && <rect x={s1 + 1} y={y - 10} width={s2 - s1 - 1} height={20} fill="var(--paper)" />}
              {on && <rect x={s1} y={y - 10} width={2} height={20} fill="var(--signal)" />}
              <FileGlyph x={s1 + 10} y={y - 5} tone={on ? "var(--ink)" : "var(--ink-3)"} />
              <Bar x={s1 + 26} y={y} w={w} tone={on ? "var(--ink-2)" : "var(--rule-strong)"} />
              <Bar x={s2 - 22} y={y} w={12} />
              {i < rows.length - 1 && <line x1={s1 + 10} y1={y + 10.5} x2={s2 - 10} y2={y + 10.5} stroke="var(--rule)" strokeWidth={0.6} />}
            </g>
          );
        })}
      </g>
      {/* metadata panel */}
      <g className="dg-n" style={dl(600)}>
        <rect x={s2 + 10} y={Y + 24} width={W - (s2 - X) - 20} height={44} rx={2} fill="none" stroke="var(--rule)" strokeWidth={0.8} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = Y + 86 + i * 18;
          return (
            <g key={i}>
              <Bar x={s2 + 10} y={y} w={20 + ((i * 7) % 12)} />
              <Bar x={s2 + 10} y={y + 7} w={[58, 44, 66, 38, 52, 60][i]} tone="var(--ink-3)" />
            </g>
          );
        })}
      </g>
      <path className="dg-e" style={dl(800, 900)} d={spark} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={1.2} strokeLinecap="round" />
      <Pulse path={spark} dur={7} r={2} />
      <g className="dg-n" style={dl(900)}>
        <T x={X} y={Y + H + 20}>Files</T>
        <T x={s1} y={Y + H + 20}>Datasets</T>
        <T x={s2} y={Y + H + 20}>Metadata</T>
      </g>
    </Art>
  );
}

/* 02 File browser: nested folders, one dataset linked into a second folder */
function FileBrowser() {
  const X = 44,
    Y = 44,
    W = 312,
    H = 216;
  const items: [number, "f" | "o" | "d" | "l"][] = [
    [0, "o"],
    [1, "o"],
    [2, "d"],
    [2, "d"],
    [2, "d"],
    [1, "o"],
    [2, "f"],
    [2, "l"],
    [2, "d"],
    [1, "f"],
    [0, "f"],
  ];
  const widths = [72, 60, 88, 70, 80, 64, 54, 88, 62, 58, 66];
  const rowY = (i: number) => Y + 32 + i * 16.5;
  const colX = (depth: number) => X + 18 + depth * 18;
  const src = 3,
    dst = 7;
  const bx = colX(2) + 18 + 88 + 14;
  const link = `M ${bx} ${rowY(src)} C ${bx + 70} ${rowY(src)} ${bx + 70} ${rowY(dst)} ${bx} ${rowY(dst)}`;
  return (
    <Art id="ambic-file-browser" label="Hierarchical file browser with nested folders and a linked dataset">
      <Win x={X} y={Y} w={W} h={H} />
      {/* tree guides */}
      <g className="dg-n" style={dl(200)} stroke="var(--rule-strong)" strokeWidth={0.7} fill="none">
        {items.map(([depth], i) => {
          if (depth === 0) return null;
          // find parent row
          let p = i - 1;
          while (p >= 0 && items[p][0] >= depth) p--;
          const gx = colX(depth - 1) + 5;
          return <path key={i} d={`M ${gx} ${rowY(p) + 6} L ${gx} ${rowY(i)} L ${colX(depth) - 3} ${rowY(i)}`} />;
        })}
      </g>
      {items.map(([depth, kind], i) => {
        const x = colX(depth);
        const y = rowY(i);
        const on = i === src || i === dst;
        return (
          <g key={i} className="dg-n" style={dl(250 + i * 45)}>
            {kind === "o" || kind === "f" ? (
              <FolderGlyph x={x} y={y - 5} open={kind === "o"} />
            ) : (
              <g>
                <FileGlyph x={x + 1} y={y - 5} tone={on ? "var(--ink)" : "var(--ink-3)"} />
                {kind === "l" && (
                  <rect x={x - 1.5} y={y - 7} width={12} height={14} rx={2} fill="none" stroke="var(--signal)" strokeWidth={0.7} strokeDasharray="1.5 1.5" />
                )}
              </g>
            )}
            <Bar x={x + 18} y={y} w={widths[i]} tone={on ? "var(--ink-2)" : kind === "o" || kind === "f" ? "var(--ink-3)" : "var(--rule-strong)"} />
          </g>
        );
      })}
      <path className="dg-e" style={dl(900, 800)} d={link} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={1.1} strokeLinecap="round" />
      <g className="dg-n" style={dl(1100)}>
        <circle cx={bx} cy={rowY(src)} r={2} fill="var(--signal)" />
        <circle cx={bx} cy={rowY(dst)} r={2} fill="var(--paper)" stroke="var(--signal)" strokeWidth={1} />
        <T x={bx + 60} y={(rowY(src) + rowY(dst)) / 2 + 3} fill="var(--signal-ink)">
          linked
        </T>
      </g>
      <Pulse path={link} dur={6} r={2} />
    </Art>
  );
}

/* 03 Architecture, compact: the browser talks to Postgres directly (behind RLS);
   file operations go through a Deno Edge Function to object storage */
function Architecture() {
  const gx = 40;
  const cx = 250;
  const tiers = [86, 160, 236];
  const fnX = [cx - 75, cx - 25, cx + 25, cx + 75];
  const hot = fnX[1];
  const stX = cx - 60; // storage centre
  const pgX = cx + 56; // Postgres centre
  const gy = tiers[2] - 2; // glyph centre in the data tier
  const filePath = `M ${hot} ${tiers[0] + 16} L ${hot} ${tiers[2] - 34} Q ${hot} ${tiers[2] - 26} ${hot - 8} ${tiers[2] - 26} L ${stX + 8} ${tiers[2] - 26} Q ${stX} ${tiers[2] - 26} ${stX} ${tiers[2] - 18} L ${stX} ${gy - 11}`;
  const dbX = pgX;
  return (
    <Art id="ambic-architecture" label="System architecture: React frontend, Deno Edge Functions for file operations, Supabase Postgres and object storage behind row-level security">
      {tiers.map((y, i) => (
        <g key={y} className="dg-n" style={dl(i * 150)}>
          <line x1={gx} y1={y - 30} x2={360} y2={y - 30} stroke="var(--rule-strong)" strokeWidth={0.8} />
          <text x={gx} y={y - 12} fontSize={10.5} fontWeight={600} fill="var(--ink)" letterSpacing="-0.01em">
            {["Frontend", "Edge Functions", "Supabase"][i]}
          </text>
          <T x={gx} y={y + 1} s={9}>
            {["React", "Deno", "Backend"][i]}
          </T>
        </g>
      ))}
      {/* browser slab */}
      <g className="dg-n" style={dl(200)}>
        <rect x={cx - 100.5} y={tiers[0] - 16.5} width={201} height={33} rx={3} fill="var(--plate)" stroke="var(--rule-strong)" strokeWidth={0.8} />
        <line x1={cx - 100} y1={tiers[0] - 8} x2={cx + 100} y2={tiers[0] - 8} stroke="var(--rule)" strokeWidth={0.7} />
        <Bar x={cx - 88} y={tiers[0] + 4} w={38} tone="var(--ink-3)" />
        <path d={`M ${cx + 24} ${tiers[0] + 10} L ${cx + 38} ${tiers[0] + 2} L ${cx + 52} ${tiers[0] + 6} L ${cx + 66} ${tiers[0] - 2} L ${cx + 88} ${tiers[0] + 1}`} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} strokeLinejoin="round" />
      </g>
      {/* edge functions: small stateless units */}
      {fnX.map((x, i) => (
        <g key={x} className="dg-n" style={dl(450 + i * 60)}>
          <circle cx={x} cy={tiers[1]} r={10.5} fill="var(--plate)" stroke={x === hot ? "var(--signal)" : "var(--rule-strong)"} strokeWidth={x === hot ? 1.1 : 0.8} />
          <text x={x} y={tiers[1] + 3.5} fontSize={10} textAnchor="middle" fill={x === hot ? "var(--signal-ink)" : "var(--ink-3)"} style={mono}>
            ƒ
          </text>
        </g>
      ))}
      {/* RLS boundary around the data tier */}
      <g className="dg-n" style={dl(700)}>
        <rect x={cx - 104} y={tiers[2] - 22} width={208} height={52} rx={4} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} strokeDasharray="1.5 2.5" />
        <T x={cx + 104} y={tiers[2] + 44} a="end" s={9}>
          row-level security
        </T>
      </g>
      {/* storage: stacked sheets */}
      <g className="dg-n" style={dl(800)} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.8}>
        {[2, 1, 0].map((k) => (
          <rect key={k} x={stX - 12 + k * 3.5} y={gy - 11 - k * 3.5} width={22} height={17} rx={1.5} />
        ))}
      </g>
      {/* Postgres cylinder */}
      <g className="dg-n" style={dl(850)} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.8}>
        <path d={`M ${pgX - 14} ${gy - 8} L ${pgX - 14} ${gy + 8} A 14 4 0 0 0 ${pgX + 14} ${gy + 8} L ${pgX + 14} ${gy - 8}`} />
        <ellipse cx={pgX} cy={gy - 8} rx={14} ry={4} />
        <path d={`M ${pgX - 14} ${gy} A 14 4 0 0 0 ${pgX + 14} ${gy}`} fill="none" />
      </g>
      <g className="dg-n" style={dl(900)}>
        <T x={stX} y={gy + 22} s={9} a="middle">
          Storage
        </T>
        <T x={pgX} y={gy + 22} s={9} a="middle">
          Postgres
        </T>
      </g>
      {/* the browser reads structured data straight from Postgres */}
      <path
        className="dg-e"
        style={dl(1000, 600)}
        d={`M ${dbX} ${tiers[0] + 16.5} L ${dbX} ${gy - 12}`}
        pathLength={1}
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth={0.8}
      />
      {/* file operations: browser, edge function, object storage */}
      <path className="dg-e" style={dl(1000, 800)} d={filePath} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
      <Pulse path={filePath} dur={6} r={2} />
    </Art>
  );
}

/* 04 Normalization: source columns mapped to a standard target schema, with provenance */
function ColumnMapping() {
  const sx = 70,
    sw = 92,
    tx = 250,
    tw = 92;
  const src = [58, 44, 70, 38, 62, 50, 66, 42, 54];
  const tgt = [48, 64, 40, 56, 52];
  const sy = (i: number) => 78 + i * 19;
  const ty = (i: number) => 97 + i * 29;
  const map: [number, number][] = [
    [0, 1],
    [2, 0],
    [3, 3],
    [5, 2],
    [6, 4],
    [8, 3],
  ];
  const hot: [number, number] = [4, 2];
  const curve = ([a, b]: [number, number]) =>
    `M ${sx + sw} ${sy(a)} C ${sx + sw + 48} ${sy(a)} ${tx - 48} ${ty(b)} ${tx} ${ty(b)}`;
  return (
    <Art id="ambic-column-mapping" label="Column mapping from source schema to standardized target, with a provenance link back to the source">
      <g className="dg-n">
        <T x={sx} y={60}>Source columns</T>
        <T x={tx} y={60}>Target schema</T>
      </g>
      {src.map((w, i) => {
        const mapped = map.some(([a]) => a === i) || i === hot[0];
        const on = i === hot[0];
        return (
          <g key={i} className="dg-n" style={dl(100 + i * 40)}>
            <rect
              x={sx + 0.5}
              y={sy(i) - 6.5}
              width={sw - 1}
              height={13}
              rx={2}
              fill={mapped ? "var(--plate)" : "none"}
              stroke={on ? "var(--signal)" : "var(--rule-strong)"}
              strokeWidth={on ? 1.1 : 0.8}
              strokeDasharray={mapped ? undefined : "1.5 2"}
            />
            <Bar x={sx + 8} y={sy(i)} w={w} tone={on ? "var(--ink-2)" : mapped ? "var(--rule-strong)" : "var(--rule)"} />
          </g>
        );
      })}
      {tgt.map((w, i) => {
        const on = i === hot[1];
        return (
          <g key={i} className="dg-n" style={dl(300 + i * 60)}>
            <rect x={tx + 0.5} y={ty(i) - 9.5} width={tw - 1} height={19} rx={2} fill="var(--plate)" stroke={on ? "var(--signal)" : "var(--ink-3)"} strokeWidth={on ? 1.1 : 0.8} />
            <rect x={tx} y={ty(i) - 10} width={2.5} height={20} fill={on ? "var(--signal)" : "var(--ink-3)"} />
            <Bar x={tx + 11} y={ty(i)} w={w} tone={on ? "var(--ink)" : "var(--ink-3)"} />
          </g>
        );
      })}
      {map.map((m, i) => (
        <path key={i} className="dg-e" style={dl(600 + i * 70, 600)} d={curve(m)} pathLength={1} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
      ))}
      {/* the one being mapped: ghost track, then the ambient redraw */}
      <path className="dg-e" style={dl(1000, 700)} d={curve(hot)} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={1.2} strokeLinecap="round" />
      <g className="dg-pulse">
        <circle r={2.4} fill="var(--signal)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path={curve(hot)}
            keyPoints="0;1;1"
            keyTimes="0;0.45;1"
            calcMode="spline"
            keySplines={`${ease};0 0 1 1`}
          />
          <animate attributeName="opacity" dur="7s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.06;0.5;0.62;1" />
        </circle>
      </g>
      {/* provenance: every normalized column keeps a link to its source */}
      <g className="dg-n" style={dl(1300)}>
        <path
          d={`M ${tx + tw} ${ty(hot[1])} C ${tx + tw + 22} ${ty(hot[1])} ${tx + tw + 22} 262 ${tx + tw - 10} 262 L ${sx + 10} 262 C ${sx - 18} 262 ${sx - 18} ${sy(hot[0])} ${sx} ${sy(hot[0])}`}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth={0.8}
          strokeDasharray="1.5 2.5"
        />
        <rect x={188} y={255} width={58} height={14} fill="var(--plate)" />
        <T x={217} y={265.5} a="middle">
          provenance
        </T>
      </g>
    </Art>
  );
}

/* 05 2D virtualization: a vast table, only the viewport renders */
function VirtualTable() {
  const x0 = 28,
    y0 = 72,
    cw = 22,
    rh = 12;
  const nc = 18,
    nr = 20;
  const vw = cw * 6,
    vh = rh * 8;
  const vx = x0 + cw * 3,
    vy = y0 + rh * 4;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < nr; r++) {
    for (let c = 0; c < nc; c++) {
      const w = 6 + ((r * 7 + c * 13) % 10);
      cells.push(<rect key={`${r}-${c}`} x={x0 + c * cw + 4} y={y0 + r * rh + 4.5} width={w} height={3} rx={1.5} fill={r === 0 ? "var(--ink-2)" : "var(--ink-3)"} />);
    }
  }
  const path = "0 0; 110 30; 176 -8; 132 84; 22 70; 0 0";
  const kt = "0;0.22;0.42;0.64;0.84;1";
  const ks = Array(5).fill(ease).join(";");
  return (
    <Art id="ambic-virtual-table" label="2D virtualized table: only the visible viewport of a 3,000+ column dataset renders" grid={false}>
      <defs>
        <clipPath id="ambic-vt-clip">
          <rect x={vx} y={vy} width={vw} height={vh}>
            <animateTransform attributeName="transform" type="translate" values={path} keyTimes={kt} calcMode="spline" keySplines={ks} dur="14s" begin="2.4s" repeatCount="indefinite" />
          </rect>
        </clipPath>
      </defs>
      {/* the lattice that is never rendered */}
      <g className="dg-n" style={dl(0)} stroke="var(--rule)" strokeWidth={0.6}>
        {Array.from({ length: nr + 1 }, (_, r) => (
          <line key={`r${r}`} x1={x0} y1={y0 + r * rh} x2={400} y2={y0 + r * rh} />
        ))}
        {Array.from({ length: nc }, (_, c) => (
          <line key={`c${c}`} x1={x0 + c * cw} y1={y0} x2={x0 + c * cw} y2={300} />
        ))}
      </g>
      <g className="dg-n" style={dl(150)}>
        <line x1={x0} y1={y0 + rh} x2={400} y2={y0 + rh} stroke="var(--rule-strong)" strokeWidth={0.8} />
      </g>
      {/* rendered cells: only inside the viewport */}
      <g className="dg-n" style={dl(500)} clipPath="url(#ambic-vt-clip)">
        <rect x={0} y={0} width={400} height={300} fill="var(--plate)" />
        {cells}
      </g>
      <g className="dg-n" style={dl(600)}>
        <rect x={vx} y={vy} width={vw} height={vh} fill="none" stroke="var(--signal)" strokeWidth={1.2}>
          <animateTransform attributeName="transform" type="translate" values={path} keyTimes={kt} calcMode="spline" keySplines={ks} dur="14s" begin="2.4s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* dimension: columns run far past the edge */}
      <g className="dg-n" style={dl(800)} stroke="var(--ink-3)" strokeWidth={0.8} fill="none">
        <line x1={x0} y1={50} x2={x0} y2={62} />
        <line x1={x0} y1={56} x2={400} y2={56} />
      </g>
      <g className="dg-n" style={dl(900)}>
        <rect x={x0 + 150} y={49} width={96} height={14} fill="var(--paper)" />
        <T x={x0 + 198} y={59.5} a="middle" fill="var(--ink-2)">
          3,000+ columns
        </T>
      </g>
    </Art>
  );
}

/* 06 Time series: three runs over time, an annotation, a hover readout */
function TimeSeries() {
  const X = 36,
    Y = 58,
    W = 328,
    H = 214;
  const px0 = X + 26,
    px1 = X + W - 18,
    py0 = Y + 44,
    py1 = Y + H - 50;
  const run = `M ${px0} ${py1 - 8} C ${px0 + 70} ${py1 - 10} ${px0 + 96} ${py1 - 22} ${px0 + 130} ${py0 + 60} S ${px0 + 200} ${py0 + 8} ${px1} ${py0 + 6}`;
  const second = `M ${px0} ${py0 + 20} C ${px0 + 60} ${py0 + 24} ${px0 + 140} ${py0 + 70} ${px0 + 190} ${py0 + 86} S ${px1 - 20} ${py1 - 20} ${px1} ${py1 - 18}`;
  const third = `M ${px0} ${py0 + 64} C ${px0 + 50} ${py0 + 58} ${px0 + 90} ${py0 + 72} ${px0 + 140} ${py0 + 66} S ${px0 + 220} ${py0 + 56} ${px1} ${py0 + 60}`;
  const ann = px0 + 166;
  return (
    <Art id="ambic-time-series" label="Interactive time series chart with an annotation and a hover readout">
      <Win x={X} y={Y} w={W} h={H} />
      <g className="dg-n" style={dl(150)}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line
              x1={px0 + i * 58}
              y1={Y + 28}
              x2={px0 + 14 + i * 58}
              y2={Y + 28}
              stroke={i === 0 ? "var(--signal)" : i === 1 ? "var(--ink-2)" : "var(--ink-3)"}
              strokeWidth={1.2}
              strokeDasharray={i === 2 ? "2 2" : undefined}
            />
            <Bar x={px0 + 19 + i * 58} y={Y + 28} w={28} />
          </g>
        ))}
      </g>
      {/* axes and quiet gridlines, no numbers */}
      <g className="dg-n" style={dl(200)}>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={px0} y1={py0 + i * ((py1 - py0) / 4)} x2={px1} y2={py0 + i * ((py1 - py0) / 4)} stroke="var(--rule)" strokeWidth={0.6} />
        ))}
        <line x1={px0} y1={py0 - 6} x2={px0} y2={py1} stroke="var(--ink-3)" strokeWidth={0.8} />
        <line x1={px0} y1={py1} x2={px1} y2={py1} stroke="var(--ink-3)" strokeWidth={0.8} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={px0 + (i * (px1 - px0)) / 6} y1={py1} x2={px0 + (i * (px1 - px0)) / 6} y2={py1 + 3} stroke="var(--ink-3)" strokeWidth={0.8} />
        ))}
      </g>
      <path className="dg-e" style={dl(400, 900)} d={third} pathLength={1} fill="none" stroke="var(--ink-3)" strokeWidth={0.9} strokeDasharray="2 2" />
      <path className="dg-e" style={dl(500, 900)} d={second} pathLength={1} fill="none" stroke="var(--ink-2)" strokeWidth={1} />
      <path className="dg-e" style={dl(600, 900)} d={run} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={1.4} strokeLinecap="round" />
      {/* annotation flag */}
      <g className="dg-n" style={dl(1000)}>
        <line x1={ann} y1={py0 - 4} x2={ann} y2={py1} stroke="var(--ink-3)" strokeWidth={0.7} strokeDasharray="1.5 2" />
        <path d={`M ${ann} ${py0 - 12} L ${ann + 10} ${py0 - 12} L ${ann + 7} ${py0 - 8} L ${ann + 10} ${py0 - 4} L ${ann} ${py0 - 4} Z`} fill="var(--ink-3)" />
      </g>
      {/* range brush */}
      <g className="dg-n" style={dl(1100)}>
        <rect x={px0 + 0.5} y={py1 + 16.5} width={px1 - px0 - 1} height={13} rx={2} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
        <path d={`M ${px0 + 4} ${py1 + 26} C ${px0 + 60} ${py1 + 26} ${px0 + 80} ${py1 + 18} ${px0 + 120} ${py1 + 20} S ${px1 - 30} ${py1 + 19} ${px1 - 4} ${py1 + 19}`} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
        <rect x={px0 + 40} y={py1 + 16} width={180} height={14} fill="var(--ink-3)" opacity={0.12} />
        <line x1={px0 + 40} y1={py1 + 14} x2={px0 + 40} y2={py1 + 32} stroke="var(--ink-2)" strokeWidth={1.2} />
        <line x1={px0 + 220} y1={py1 + 14} x2={px0 + 220} y2={py1 + 32} stroke="var(--ink-2)" strokeWidth={1.2} />
      </g>
      {/* hover readout travelling the signal run */}
      <defs>
        <clipPath id="ambic-ts-clip">
          <rect x={px0} y={py0 - 6} width={px1 - px0} height={py1 - py0 + 6} />
        </clipPath>
      </defs>
      <g className="dg-pulse" clipPath="url(#ambic-ts-clip)">
        <g>
          <line x1={0} y1={-200} x2={0} y2={200} stroke="var(--ink-2)" strokeWidth={0.7} />
          <circle r={5.5} fill="var(--signal)" opacity={0.16} />
          <circle r={2.4} fill="var(--signal)" />
          <animateMotion dur="10s" repeatCount="indefinite" path={run} keyPoints="0.12;0.9;0.12" keyTimes="0;0.5;1" calcMode="spline" keySplines={`${ease};${ease}`} />
        </g>
      </g>
    </Art>
  );
}

/** Deterministic scatter: [position along trend, noise], both 0..1 */
const SCATTER: [number, number][] = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: 46 }, () => [rnd(), rnd()] as [number, number]);
})();

/* 07 Analytics: filters, a brushed scatter, and the linked histogram */
function Analytics() {
  const X = 36,
    Y = 58,
    W = 328,
    H = 214;
  const sx0 = X + 16,
    sx1 = X + 196,
    sy0 = Y + 50,
    sy1 = Y + H - 16;
  const pts = SCATTER.map(([t, n]) => {
    const x = sx0 + 10 + t * (sx1 - sx0 - 20);
    const y = sy1 - 12 - t * (sy1 - sy0 - 40) * 0.8 - (n - 0.5) * 50 - 8;
    return [x, Math.max(sy0 + 6, Math.min(sy1 - 6, y))] as const;
  });
  const br = { x: sx0 + 86, y: sy0 + 34, w: 58, h: 52 };
  const inBrush = (x: number, y: number) => x > br.x && x < br.x + br.w && y > br.y && y < br.y + br.h;
  const hx0 = X + 214,
    hx1 = X + W - 16;
  const bars = [0.25, 0.42, 0.66, 0.9, 0.78, 0.55, 0.36, 0.2];
  const bw = (hx1 - hx0) / bars.length;
  return (
    <Art id="ambic-analytics" label="Data exploration interface with filters, a brushed scatter plot and a linked histogram">
      <Win x={X} y={Y} w={W} h={H} />
      <g className="dg-n" style={dl(150)}>
        {[44, 36, 52].map((w, i) => {
          const x = X + 16 + [0, 54, 100][i];
          return (
            <g key={i}>
              <rect x={x + 0.5} y={Y + 24.5} width={w - 1} height={13} rx={6.5} fill="none" stroke="var(--rule-strong)" strokeWidth={0.8} />
              <Bar x={x + 7} y={Y + 31} w={w - 14} />
            </g>
          );
        })}
        <line x1={X + 204} y1={Y + 46} x2={X + 204} y2={Y + H - 12} stroke="var(--rule)" strokeWidth={0.8} />
      </g>
      <g className="dg-n" style={dl(250)}>
        <line x1={sx0} y1={sy0} x2={sx0} y2={sy1} stroke="var(--ink-3)" strokeWidth={0.8} />
        <line x1={sx0} y1={sy1} x2={sx1} y2={sy1} stroke="var(--ink-3)" strokeWidth={0.8} />
      </g>
      <g className="dg-n" style={dl(400)}>
        {pts.map(([x, y], i) =>
          inBrush(x, y) ? (
            <circle key={i} cx={x} cy={y} r={2.1} fill="var(--signal)" />
          ) : (
            <circle key={i} cx={x} cy={y} r={2} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
          ),
        )}
      </g>
      {/* brush, gently adjusted */}
      <g className="dg-n" style={dl(700)}>
        <rect x={br.x} y={br.y} width={br.w} height={br.h} fill="var(--signal)" opacity={0.06} />
        <rect x={br.x} y={br.y} width={br.w} height={br.h} fill="none" stroke="var(--signal)" strokeWidth={0.9} strokeDasharray="3 2" />
      </g>
      <g className="dg-pulse">
        <g>
          <path d={`M ${br.x + br.w - 3} ${br.y + br.h + 3} l 0 10 l 2.6 -2.4 l 2 4.2 l 1.6 -0.8 l -2 -4.1 l 3.5 -0.2 Z`} fill="var(--paper)" stroke="var(--ink)" strokeWidth={0.8} strokeLinejoin="round" />
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 4; 0 0" keyTimes="0;0.5;1" calcMode="spline" keySplines={`${ease};${ease}`} dur="6s" repeatCount="indefinite" />
        </g>
      </g>
      {/* histogram, bins inside the brush highlighted */}
      {bars.map((h, i) => {
        const on = i >= 3 && i <= 4;
        const bh = h * (sy1 - sy0 - 10);
        return (
          <rect
            key={i}
            className="dg-n"
            style={dl(500 + i * 40)}
            x={hx0 + i * bw + 1}
            y={sy1 - bh}
            width={bw - 2}
            height={bh}
            fill={on ? "var(--signal)" : "var(--plate)"}
            opacity={on ? 0.9 : 1}
            stroke={on ? "var(--signal)" : "var(--ink-3)"}
            strokeWidth={0.8}
          />
        );
      })}
      <g className="dg-n" style={dl(300)}>
        <line x1={hx0} y1={sy1} x2={hx1} y2={sy1} stroke="var(--ink-3)" strokeWidth={0.8} />
      </g>
    </Art>
  );
}

/* 08 Sharing: a dataset, an invite field, and three access tiers */
function Sharing() {
  const X = 56,
    Y = 58,
    W = 288,
    H = 216;
  const roles = ["Owner", "Editor", "Viewer"];
  const ry = (i: number) => Y + 134 + i * 28;
  return (
    <Art id="ambic-sharing" label="Dataset sharing panel with owner, editor and viewer access">
      <Win x={X} y={Y} w={W} h={H} />
      {/* dataset header */}
      <g className="dg-n" style={dl(150)}>
        <FileGlyph x={X + 16} y={Y + 29} tone="var(--ink-2)" />
        <Bar x={X + 32} y={Y + 34} w={96} tone="var(--ink-2)" />
        {/* lock */}
        <g fill="none" stroke="var(--ink-3)" strokeWidth={0.8}>
          <rect x={X + W - 26.5} y={Y + 31.5} width={11} height={8} rx={1} />
          <path d={`M ${X + W - 24} ${Y + 31.5} v -2.5 a 3.5 3.5 0 0 1 7 0 v 2.5`} />
        </g>
        <line x1={X} y1={Y + 50} x2={X + W} y2={Y + 50} stroke="var(--rule)" strokeWidth={0.8} />
      </g>
      {/* invite field with role select */}
      <g className="dg-n" style={dl(300)}>
        <rect x={X + 16.5} y={Y + 64.5} width={W - 104} height={21} rx={2} fill="var(--paper)" stroke="var(--rule-strong)" strokeWidth={0.8} />
        <Bar x={X + 25} y={Y + 75} w={58} tone="var(--ink-3)" />
        <rect x={X + W - 80.5} y={Y + 64.5} width={64} height={21} rx={2} fill="var(--plate)" stroke="var(--signal)" strokeWidth={1.1} />
        <text x={X + W - 73} y={Y + 79} fontSize={11.5} fill="var(--signal-ink)">
          Editor
        </text>
        <path d={`M ${X + W - 30} ${Y + 73} l 3.5 3.5 l 3.5 -3.5`} fill="none" stroke="var(--signal)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="dg-pulse">
        <rect x={X + 86} y={Y + 69} width={1.2} height={12} fill="var(--ink)">
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.45;0.5;0.95;1" dur="2.4s" repeatCount="indefinite" />
        </rect>
      </g>
      <g className="dg-n" style={dl(400)}>
        <T x={X + 16} y={Y + 110} s={11}>
          People with access
        </T>
      </g>
      {roles.map((r, i) => (
        <g key={r} className="dg-n" style={dl(500 + i * 90)}>
          <circle cx={X + 26} cy={ry(i)} r={9} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
          <circle cx={X + 26} cy={ry(i) - 2.6} r={2.8} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
          <path d={`M ${X + 20.5} ${ry(i) + 6} a 5.5 4.2 0 0 1 11 0`} fill="none" stroke="var(--ink-3)" strokeWidth={0.8} />
          <Bar x={X + 44} y={ry(i) - 3} w={[70, 56, 64][i]} tone="var(--ink-2)" />
          <Bar x={X + 44} y={ry(i) + 5} w={[92, 80, 86][i]} />
          <text x={X + W - 16} y={ry(i) + 4} fontSize={12} fill="var(--ink-2)" textAnchor="end">
            {r}
          </text>
          {i < 2 && <line x1={X + 44} y1={ry(i) + 15} x2={X + W - 16} y2={ry(i) + 15} stroke="var(--rule)" strokeWidth={0.6} />}
        </g>
      ))}
    </Art>
  );
}

/** Gallery illustrations for ambic-data-lake, keyed by the MDX `art` id. */
export const art: Record<string, ComponentType> = {
  "ambic-data-lake/dashboard": Dashboard,
  "ambic-data-lake/file-browser": FileBrowser,
  "ambic-data-lake/architecture": Architecture,
  "ambic-data-lake/column-mapping": ColumnMapping,
  "ambic-data-lake/virtual-table": VirtualTable,
  "ambic-data-lake/time-series": TimeSeries,
  "ambic-data-lake/analytics": Analytics,
  "ambic-data-lake/sharing": Sharing,
};
