import { Art } from "@/components/diagrams/kit";

const stroke = { stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };

/* 27-well sensor card, 3 electrodes per well, one well live */
export default function Cover() {
  const wells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 9; c++) {
      const x = 92 + c * 27;
      const y = 112 + r * 30;
      const live = r === 1 && c === 5;
      wells.push(
        <g key={`${r}-${c}`}>
          <circle cx={x} cy={y} r="10" {...stroke} stroke={live ? "var(--signal)" : "currentColor"} />
          {[0, 1, 2].map((k) => {
            const a = (k / 3) * Math.PI * 2 - Math.PI / 2;
            return (
              <circle
                key={k}
                cx={x + Math.cos(a) * 4.5}
                cy={y + Math.sin(a) * 4.5}
                r="1.4"
                fill={live ? "var(--signal)" : "currentColor"}
              />
            );
          })}
        </g>,
      );
    }
  }
  return (
    <Art id="cover-bio-cubesat" label="CubeSat bio-payload sensor card">
      <rect x="70" y="88" width="260" height="126" {...stroke} stroke="var(--ink-2)" />
      {[
        [78, 96],
        [322, 96],
        [78, 206],
        [322, 206],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3" {...stroke} />
      ))}
      {wells}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={92 + i * 27} y1="214" x2={92 + i * 27} y2="232" {...stroke} strokeDasharray="1 2" />
      ))}
      <text x="70" y="78" className="mono" fontSize="8" fill="currentColor">
        27 wells · 81 electrodes
      </text>
    </Art>
  );
}
