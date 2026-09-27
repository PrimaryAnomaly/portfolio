import Image from "next/image";

/*
  Project artwork. Real images render as-is (architecture diagrams sit
  on a white plate, contained). Placeholder heroes are replaced with a
  drawn motif specific to the project, so no card ever shows "HERO IMAGE".
*/

export function isPlaceholder(src?: string) {
  return !src || src.includes("placeholder");
}

export function ProjectCover({
  slug,
  src,
  alt,
  sizes,
  priority = false,
}: {
  slug: string;
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!isPlaceholder(src)) {
    return (
      <div className="absolute inset-0 bg-white">
        <Image src={src!} alt={alt} fill sizes={sizes} priority={priority} className="object-contain p-[4%]" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-plate text-ink-3" role="img" aria-label={alt}>
      <Motif slug={slug} />
    </div>
  );
}

const stroke = { stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };

function Frame({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <defs>
        <pattern id={`grid-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" {...stroke} stroke="var(--rule)" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#grid-${id})`} />
      {children}
    </svg>
  );
}

function Motif({ slug }: { slug: string }) {
  switch (slug) {
    case "bio-cubesat":
      return <WellArray />;
    case "fleet-coord":
      return <Fleet />;
    case "lyo-mech-model":
      return <LyoCycle />;
    case "manifest-labor":
      return <MoCap />;
    default:
      return (
        <Frame id="motif">
          <circle cx="200" cy="150" r="40" {...stroke} />
          <line x1="140" y1="150" x2="260" y2="150" {...stroke} />
          <line x1="200" y1="90" x2="200" y2="210" {...stroke} />
        </Frame>
      );
  }
}

/* 27-well sensor card, 3 electrodes per well, one well live */
function WellArray() {
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
    <Frame id="wellarray">
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
    </Frame>
  );
}

/* Two agents sharing a load, cue waves between them */
function Fleet() {
  return (
    <Frame id="fleet">
      <line x1="120" y1="150" x2="280" y2="150" stroke="var(--ink-2)" strokeWidth="6" strokeLinecap="round" opacity="0.18" />
      <line x1="120" y1="150" x2="280" y2="150" {...stroke} stroke="var(--ink-2)" />
      {[120, 280].map((x) => (
        <g key={x}>
          <circle cx={x} cy="150" r="22" {...stroke} stroke="var(--ink-2)" />
          <circle cx={x} cy="150" r="3" fill="var(--ink-2)" />
          <line x1={x} y1="172" x2={x} y2="206" {...stroke} />
          <path d={`M ${x - 5} 200 L ${x} 208 L ${x + 5} 200`} {...stroke} />
        </g>
      ))}
      {[1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M ${150 - i * 8} ${126 - i * 4} Q 200 ${104 - i * 16} ${250 + i * 8} ${126 - i * 4}`}
          {...stroke}
          stroke={i === 1 ? "var(--signal)" : "currentColor"}
          opacity={1 - i * 0.18}
        />
      ))}
      <text x="200" y="236" textAnchor="middle" className="mono" fontSize="8" fill="currentColor">
        no central controller
      </text>
    </Frame>
  );
}

/* Freeze-drying cycle: shelf temperature and chamber pressure over three phases */
function LyoCycle() {
  const x0 = 60;
  const x1 = 350;
  const phases = [60, 130, 270, 350];
  const temp = "M 60 110 L 80 110 L 100 200 L 130 200 L 150 150 L 270 150 L 290 96 L 350 96";
  const press = "M 60 80 L 130 80 L 138 230 L 270 230 L 278 238 L 350 238";
  return (
    <Frame id="lyocycle">
      <line x1={x0} y1="250" x2={x1} y2="250" {...stroke} stroke="var(--ink-2)" />
      <line x1={x0} y1="60" x2={x0} y2="250" {...stroke} stroke="var(--ink-2)" />
      {phases.slice(1, 3).map((x) => (
        <line key={x} x1={x} y1="60" x2={x} y2="250" {...stroke} strokeDasharray="2 4" />
      ))}
      <path d={press} {...stroke} strokeDasharray="4 3" />
      <path d={temp} {...stroke} stroke="var(--signal)" strokeWidth={1.5} />
      {["Freezing", "Primary drying", "Secondary"].map((label, i) => (
        <text
          key={label}
          x={(phases[i] + phases[i + 1]) / 2}
          y="268"
          textAnchor="middle"
          className="mono"
          fontSize="8"
          fill="currentColor"
        >
          {label}
        </text>
      ))}
    </Frame>
  );
}

/* Motion-capture skeleton with a hand trajectory trail */
function MoCap() {
  const j: Record<string, [number, number]> = {
    head: [196, 78],
    neck: [198, 102],
    sh_l: [176, 108],
    sh_r: [222, 108],
    el_l: [162, 146],
    el_r: [250, 134],
    wr_l: [168, 184],
    wr_r: [278, 120],
    hip: [200, 172],
    hip_l: [186, 176],
    hip_r: [214, 176],
    kn_l: [178, 220],
    kn_r: [226, 218],
    an_l: [172, 262],
    an_r: [238, 258],
  };
  const bones: [string, string][] = [
    ["head", "neck"],
    ["neck", "sh_l"],
    ["neck", "sh_r"],
    ["sh_l", "el_l"],
    ["el_l", "wr_l"],
    ["sh_r", "el_r"],
    ["el_r", "wr_r"],
    ["neck", "hip"],
    ["hip", "hip_l"],
    ["hip", "hip_r"],
    ["hip_l", "kn_l"],
    ["kn_l", "an_l"],
    ["hip_r", "kn_r"],
    ["kn_r", "an_r"],
  ];
  const trail = Array.from({ length: 22 }, (_, i) => {
    const t = i / 21;
    return [278 + t * 70 - Math.sin(t * Math.PI) * 10, 120 + Math.sin(t * Math.PI * 1.5) * 34 + t * 40] as const;
  });
  return (
    <Frame id="mocap">
      {bones.map(([a, b]) => (
        <line key={a + b} x1={j[a][0]} y1={j[a][1]} x2={j[b][0]} y2={j[b][1]} {...stroke} stroke="var(--ink-2)" />
      ))}
      {Object.entries(j).map(([k, [x, y]]) => (
        <circle key={k} cx={x} cy={y} r={k === "head" ? 9 : 2.5} {...stroke} fill={k === "head" ? "none" : "var(--plate)"} stroke="var(--ink-2)" />
      ))}
      {trail.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="var(--signal)" opacity={0.25 + (i / trail.length) * 0.75} />
      ))}
      <text x="60" y="270" className="mono" fontSize="8" fill="currentColor">
        hand trajectory
      </text>
    </Frame>
  );
}
