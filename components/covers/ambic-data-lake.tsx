import { Art, Pulse } from "@/components/diagrams/kit";

/*
  Column mapping. A stack of raw dataset sheets (csv, xlsx, json) on the
  left, a normalized target schema on the right, and the mapping lines
  between them. One mapping is the signal; a dot rides it.
*/

const d = (ms: number, dur?: number) => ({ "--d": ms, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" };

const SX = 70; // front sheet
const SW = 112;
const TX = 258; // target table
const TW = 110;
const TOP = 102;
const BOT = 224;
const rows = [140, 164, 188, 212];
// raw field widths are ragged; the target is uniform
const raw = [
  [52, 18],
  [34, 30],
  [60, 12],
  [42, 24],
];
const map = [2, 0, 3, 1]; // source row i -> target row
const SIG = 1;

const curve = (i: number) => {
  const y0 = rows[i];
  const y1 = rows[map[i]];
  return `M ${SX + SW} ${y0} C ${SX + SW + 44} ${y0} ${TX - 44} ${y1} ${TX} ${y1}`;
};

export default function Cover() {
  return (
    <Art id="cover-ambic-data-lake" label="Raw dataset sheets mapped column by column into a normalized schema">
      {/* stacked sheets, back to front */}
      {[
        { dx: 28, t: "json" },
        { dx: 14, t: "xlsx" },
        { dx: 0, t: "csv" },
      ].map(({ dx, t }, k) => (
        <g key={t} className="dg-n" style={d(k * 90)}>
          <rect
            x={SX - dx + 0.5}
            y={TOP - dx + 0.5}
            width={SW}
            height={BOT - TOP}
            fill="var(--plate)"
            stroke="var(--rule-strong)"
            strokeWidth={0.8}
          />
          {dx > 0 && (
            <text x={SX - dx + 8} y={TOP - dx + 10.5} fontSize={9} fill="var(--ink-3)" style={mono}>
              {t}
            </text>
          )}
        </g>
      ))}
      <g className="dg-n" style={d(260)}>
        <text x={SX + 10} y={TOP + 18} fontSize={9} fill="var(--ink-3)" style={mono}>
          csv
        </text>
        <line x1={SX} y1={TOP + 26} x2={SX + SW} y2={TOP + 26} stroke="var(--rule)" strokeWidth={0.8} />
      </g>
      {rows.map((y, i) => (
        <g key={y} className="dg-n" style={d(320 + i * 50)}>
          <rect x={SX + 10} y={y - 1.5} width={raw[i][0]} height={3} rx={1.5} fill={i === SIG ? "var(--signal)" : "var(--ink-3)"} opacity={i === SIG ? 1 : 0.55} />
          <rect x={SX + 16 + raw[i][0]} y={y - 1.5} width={raw[i][1]} height={3} rx={1.5} fill="var(--ink-3)" opacity={0.3} />
          <circle cx={SX + SW} cy={y} r={2.2} fill="var(--paper)" stroke={i === SIG ? "var(--signal)" : "var(--ink-3)"} strokeWidth={0.9} />
        </g>
      ))}

      {/* target schema */}
      <g className="dg-n" style={d(420)}>
        <text x={TX} y={TOP - 10} fontSize={9} fill="var(--ink-3)" style={mono}>
          normalized
        </text>
        <rect x={TX + 0.5} y={TOP + 0.5} width={TW} height={BOT - TOP} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={0.9} />
        {/* header row: outlined, named fields in the target schema */}
        <line x1={TX} y1={TOP + 26} x2={TX + TW} y2={TOP + 26} stroke="var(--ink-2)" strokeWidth={0.9} />
        {[0, 0.36, 0.68].map((f) => (
          <rect key={f} x={TX + 8 + f * TW} y={TOP + 12} width={20} height={3} rx={1.5} fill="var(--ink-2)" />
        ))}
        {rows.slice(0, -1).map((y) => (
          <line key={y} x1={TX} y1={y + 12} x2={TX + TW} y2={y + 12} stroke="var(--rule)" strokeWidth={0.8} />
        ))}
        {[TX + TW * 0.36, TX + TW * 0.68].map((x) => (
          <line key={x} x1={x} y1={TOP} x2={x} y2={BOT} stroke="var(--rule)" strokeWidth={0.8} />
        ))}
      </g>
      {rows.map((y, j) => {
        const on = map[SIG] === j;
        return (
          <g key={y} className="dg-n" style={d(520 + j * 50)}>
            {[0, 0.36, 0.68].map((f) => (
              <rect
                key={f}
                x={TX + f * TW + 8}
                y={y - 1.5}
                width={f === 0 ? 24 : 18}
                height={3}
                rx={1.5}
                fill={on && f === 0 ? "var(--signal)" : "var(--ink-3)"}
                opacity={on && f === 0 ? 1 : 0.55}
              />
            ))}
            <circle cx={TX} cy={y} r={2.2} fill="var(--paper)" stroke={on ? "var(--signal)" : "var(--ink-3)"} strokeWidth={0.9} />
          </g>
        );
      })}

      {/* mapping */}
      {rows.map((_, i) => (
        <path
          key={i}
          className="dg-e"
          style={d(700 + i * 110, 700)}
          d={curve(i)}
          pathLength={1}
          fill="none"
          stroke={i === SIG ? "var(--signal)" : "var(--ink-3)"}
          strokeWidth={i === SIG ? 1.2 : 0.8}
          opacity={i === SIG ? 1 : 0.7}
          strokeLinecap="round"
        />
      ))}
      <g className="dg-n" style={d(1300)}>
        <text x={(SX + SW + TX) / 2} y={BOT + 30} fontSize={9} fill="var(--ink-3)" textAnchor="middle" style={mono}>
          column mapping, source linked
        </text>
      </g>

      <Pulse path={curve(SIG)} dur={5} r={2.4} />
    </Art>
  );
}
