import { Art } from "@/components/diagrams/kit";

/*
  A welder, drawn as a motion-capture skeleton, making one pass along a
  seam. The wrist sensor's motion becomes one of four time-aligned
  streams (video, IMU, force, audio) on the right. The torch pass is the
  single ambient loop.
*/

const dl = (d: number, dur?: number) =>
  ({ "--d": d, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as React.CSSProperties;
const ease = "0.4 0 0.2 1";

export default function Cover() {
  const j = {
    head: [94, 80],
    neck: [100, 103],
    sh: [104, 110],
    el: [124, 150],
    hip: [98, 172],
    kf: [122, 208],
    af: [118, 250],
    kb: [92, 212],
    ab: [82, 250],
  } as const;
  const benchY = 176;
  const seam0 = 170,
    seam1 = 214;
  const wrist = (tx: number) => [tx - 12, 150] as const;
  const travel = seam1 - seam0;
  const kt = "0;0.72;0.8;1";
  const ks = `${ease};0 0 1 1;${ease}`;
  const clock = { dur: "9s", begin: "2.4s", repeatCount: "indefinite" };

  const bones: [keyof typeof j, keyof typeof j][] = [
    ["neck", "hip"],
    ["sh", "el"],
    ["hip", "kf"],
    ["kf", "af"],
    ["hip", "kb"],
    ["kb", "ab"],
  ];

  // data lanes
  const lx0 = 262,
    lx1 = 366;
  const lanes = [100, 138, 176, 214];
  const imu = Array.from({ length: 41 }, (_, i) => {
    const x = lx0 + (i / 40) * (lx1 - lx0);
    const y = lanes[1] + 10 * Math.sin(i * 0.42) * (0.55 + 0.45 * Math.sin(i / 9));
    return `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const force = `M ${lx0} ${lanes[2] + 9} C ${lx0 + 14} ${lanes[2] + 9} ${lx0 + 16} ${lanes[2] - 8} ${lx0 + 32} ${lanes[2] - 8} S ${lx0 + 60} ${lanes[2] - 5} ${lx0 + 76} ${lanes[2] - 9} S ${lx0 + 90} ${lanes[2] + 9} ${lx1} ${lanes[2] + 9}`;

  return (
    <Art id="cover-manifest-labor" label="A welder captured as a motion skeleton, the weld pass recorded as time-aligned video, IMU, force and audio streams">
      {/* floor and bench */}
      <g className="dg-n" style={dl(0)} stroke="var(--ink-3)" strokeWidth={1}>
        <line x1={52} y1={252} x2={240} y2={252} />
        <line x1={156} y1={benchY + 6} x2={156} y2={252} />
        <line x1={228} y1={benchY + 6} x2={228} y2={252} />
      </g>
      <g className="dg-n" style={dl(100)}>
        <rect x={148} y={benchY} width={88} height={6} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
        <rect x={164} y={benchY - 5} width={56} height={5} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1} />
      </g>

      {/* skeleton */}
      <g className="dg-n" style={dl(200)} stroke="var(--ink-2)" strokeWidth={1.3} strokeLinecap="round">
        {bones.map(([a, b]) => (
          <line key={a + b} x1={j[a][0]} y1={j[a][1]} x2={j[b][0]} y2={j[b][1]} />
        ))}
        <circle cx={j.head[0]} cy={j.head[1]} r={12} fill="var(--plate)" />
        {/* welding helmet visor */}
        <path d={`M ${j.head[0] + 6} ${j.head[1] - 10} L ${j.head[0] + 15} ${j.head[1] - 2} L ${j.head[0] + 13} ${j.head[1] + 11}`} fill="none" />
      </g>
      {/* forearm follows the wrist */}
      <g className="dg-n" style={dl(250)}>
        <line x1={j.el[0]} y1={j.el[1]} x2={wrist(seam0)[0]} y2={wrist(seam0)[1]} stroke="var(--ink-2)" strokeWidth={1.3} strokeLinecap="round">
          <animate
            attributeName="x2"
            values={`${wrist(seam0)[0]};${wrist(seam1)[0]};${wrist(seam1)[0]};${wrist(seam0)[0]}`}
            keyTimes={kt}
            calcMode="spline"
            keySplines={ks}
            {...clock}
          />
        </line>
      </g>
      {/* mocap markers */}
      <g className="dg-n" style={dl(350)} fill="var(--plate)" stroke="var(--ink-2)" strokeWidth={1.1}>
        {(["neck", "sh", "el", "hip", "kf", "kb", "af", "ab"] as const).map((k) => (
          <circle key={k} cx={j[k][0]} cy={j[k][1]} r={3.2} />
        ))}
      </g>

      {/* weld bead */}
      <g className="dg-pulse">
        <path d={`M ${seam0} ${benchY - 5} L ${seam1} ${benchY - 5}`} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="1 1">
          <animate attributeName="stroke-dashoffset" values="1;0;0;1" keyTimes="0;0.72;0.9;1" calcMode="spline" keySplines={`${ease};0 0 1 1;0 0 1 1`} {...clock} />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.8;0.9;1" {...clock} />
        </path>
      </g>
      {/* torch and wrist sensor, travelling the seam */}
      <g className="dg-n" style={dl(450)}>
        <g>
          <line x1={wrist(seam0)[0]} y1={wrist(seam0)[1]} x2={seam0} y2={benchY - 7} stroke="var(--ink)" strokeWidth={2.2} strokeLinecap="round" />
          <circle cx={seam0} cy={benchY - 6} r={7} fill="var(--signal)" opacity={0.18} />
          <circle cx={seam0} cy={benchY - 6} r={2.6} fill="var(--signal)" />
          <rect x={wrist(seam0)[0] - 4.5} y={wrist(seam0)[1] - 4.5} width={9} height={9} rx={1.5} fill="var(--signal)" />
          <animateTransform attributeName="transform" type="translate" values={`0 0; ${travel} 0; ${travel} 0; 0 0`} keyTimes={kt} calcMode="spline" keySplines={ks} {...clock} />
        </g>
      </g>

      {/* four time-aligned streams */}
      <g className="dg-n" style={dl(500)} stroke="var(--rule-strong)" strokeWidth={1}>
        {[lanes[0] - 19, ...lanes.map((y) => y + 19)].map((y) => (
          <line key={y} x1={lx0} y1={y} x2={lx1} y2={y} />
        ))}
      </g>
      <g className="dg-n" style={dl(600)} fill="var(--plate)" stroke="var(--ink-3)" strokeWidth={1}>
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={lx0 + i * 17.8} y={lanes[0] - 7} width={14} height={14} rx={1.5} />
        ))}
      </g>
      <path className="dg-e" style={dl(700, 900)} d={imu} pathLength={1} fill="none" stroke="var(--signal)" strokeWidth={1.4} strokeLinejoin="round" />
      <path className="dg-e" style={dl(800, 900)} d={force} pathLength={1} fill="none" stroke="var(--ink-2)" strokeWidth={1.3} />
      <g className="dg-n" style={dl(900)} stroke="var(--ink-3)" strokeWidth={1.4} strokeLinecap="round">
        {Array.from({ length: 27 }, (_, i) => {
          const x = lx0 + 1 + i * 3.9;
          const env = 0.35 + 0.65 * Math.sin((i / 26) * Math.PI);
          const h = (2 + (((i * 37) % 11) / 11) * 9) * env;
          return <line key={i} x1={x} y1={lanes[3] - h} x2={x} y2={lanes[3] + h} />;
        })}
      </g>
    </Art>
  );
}
