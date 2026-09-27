import { Art } from "@/components/diagrams/kit";

const stroke = { stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, fill: "none" };

/* Motion-capture skeleton with a hand trajectory trail */
export default function Cover() {
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
    <Art id="cover-manifest-labor" label="Motion capture skeleton">
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
    </Art>
  );
}
