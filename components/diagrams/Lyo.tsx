import { Band, Diagram, Edge, Label, Node, Pulse, X0, cols, roundedPath } from "./kit";

/*
  Lyophilization mechanistic model. Reads top to bottom: an Excel
  workbook and config.yaml are parsed and validated, a phase schedule
  feeds the ODE driver, the driver and the physics kernel trade state
  and derivatives (the signal loop), and post-processing turns the
  trajectories into CQA predictions and synthetic datasets.
*/

const H = 970;
const del = (d: number) => ({ "--d": d }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" };

/** State chip with a subscript, e.g. T + p. */
function State({ x, y, name, sub, d }: { x: number; y: number; name: string; sub?: string; d: number }) {
  const w = 56;
  return (
    <g className="dg-n" style={del(d)}>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={23} rx={11.5} fill="var(--paper)" stroke="var(--rule-strong)" />
      <text x={x + w / 2} y={y + 16} fontSize={11.5} textAnchor="middle" fill="var(--ink-2)" style={mono}>
        {name}
        {sub && (
          <tspan fontSize={8.5} dy={3}>
            {sub}
          </tspan>
        )}
      </text>
    </g>
  );
}

/** Kernel block: title, one line of context, then a row of state chips. */
function Kernel({
  x,
  y,
  w,
  title,
  sub,
  states,
  d,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  sub: string;
  states: [string, string?][];
  d: number;
}) {
  return (
    <>
      <g className="dg-n" style={del(d)}>
        <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={109} rx={3} fill="var(--plate)" stroke="var(--rule-strong)" />
        <text x={x + 16} y={y + 30} fontSize={14} fontWeight={600} fill="var(--ink)" letterSpacing="-0.01em">
          {title}
        </text>
        <text x={x + 16} y={y + 48} fontSize={12} fill="var(--ink-3)">
          {sub}
        </text>
      </g>
      {states.map(([n, s], i) => (
        <State key={n + (s ?? "")} x={x + 16 + i * 64} y={y + 66} name={n} sub={s} d={d + 80 + i * 40} />
      ))}
    </>
  );
}

export function LyoDiagram() {
  // Inputs: three workbook sheets over the parsers, config.yaml over ConfigLoader
  const sheets = cols(3, 16, X0, 640);
  const colA = { x: X0, w: 300, cx: X0 + 150 }; // ExcelParser
  const colB = { x: X0 + 340, w: 300, cx: X0 + 490 }; // PhaseManager, phase schedule
  const colC = { x: X0 + 680, w: 300, cx: X0 + 830 }; // config.yaml, ConfigLoader, driver
  const busY = 96;

  // Phase schedule bar, qualitative proportions
  const barX = X0;
  const barW = 604;
  const barY = 330;
  const phases: [string, number][] = [
    ["Freeze", 0.22],
    ["Anneal", 0.14],
    ["Primary", 0.4],
    ["Secondary", 0.24],
  ];
  let acc = 0;
  const segs = phases.map(([name, f]) => {
    const s = { name, x: barX + acc * barW, w: f * barW };
    acc += f;
    return s;
  });

  // Driver and the integration loop
  const drv = { x: colC.x, y: 306, w: 300, h: 76 };
  const loopL = X0 + 780;
  const loopR = X0 + 900;
  const kTop = 476;
  const loopPath = roundedPath(
    [
      [loopL, drv.y + drv.h],
      [loopL, kTop],
      [loopR, kTop],
      [loopR, drv.y + drv.h],
      [loopL + 12, drv.y + drv.h],
    ],
    8,
  );

  // Kernel frame and blocks
  const thermal = { x: X0 + 20, w: 508 };
  const lnp = { x: X0 + 548, w: 412 };
  const post = { y: 716 };
  const cqa = { x: X0, w: 548, cx: X0 + 274 };
  const dmg = { x: X0 + 568, w: 412, cx: X0 + 774 };
  const outs = cols(4);
  const outBus = 856;

  return (
    <Diagram
      h={H}
      title="Lyophilization mechanistic model architecture: Excel and YAML inputs, parsing and strict configuration, a phase schedule driving an ODE integration loop with the physics kernel, CQA prediction, and synthetic dataset outputs"
    >
      {/* Inputs */}
      <Band y={0} h={120} name="Inputs" meta="Excel workbook, YAML" d={0} />
      {["Recipe", "Formulation", "RunResults"].map((t, i) => (
        <Node key={t} x={sheets[i].x} y={24} w={sheets[i].w} h={44} pill align="center" title={t} d={60 + i * 60} />
      ))}
      <Node x={colC.x} y={24} w={colC.w} h={44} pill align="center" title="config.yaml" d={240} />
      {sheets.map((s, i) => (
        <Edge key={i} pts={[[s.cx, 68], [s.cx, busY]]} head={false} d={320} dur={200} />
      ))}
      <Edge pts={[[sheets[0].cx, busY], [sheets[2].cx, busY]]} head={false} d={420} dur={300} />
      <g className="dg-n" style={del(520)}>
        <circle cx={colA.cx} cy={busY} r={2.5} fill="var(--ink-3)" />
      </g>
      <Edge pts={[[colA.cx, busY], [colA.cx, 154]]} d={520} dur={300} />
      <Edge pts={[[colC.cx, 68], [colC.cx, 154]]} d={400} dur={400} />

      {/* Parsing and configuration */}
      <Band y={120} h={150} name="Parsing and configuration" meta="strict validation" note="No silent defaults" d={560} />
      <Node x={colA.x} y={156} w={colA.w} h={68} title="ExcelParser" sub="Recipe, formulation, results" d={620} />
      <Node x={colB.x} y={156} w={colB.w} h={68} title="PhaseManager" sub="4-phase schedule builder" d={700} />
      <Node x={colC.x} y={156} w={colC.w} h={68} title="ConfigLoader" sub="Strict validation" d={660} />
      <Edge pts={[[colA.x + colA.w, 190], [colB.x - 2, 190]]} d={760} dur={250} />

      {/* Simulation engine */}
      <Edge pts={[[colB.cx, 224], [colB.cx, barY - 11]]} d={900} dur={350} />
      <Edge pts={[[colC.cx, 224], [colC.cx, drv.y - 2]]} d={900} dur={350} />
      <Band y={270} h={170} name="Simulation engine" meta="scipy.integrate.solve_ivp" note="Adaptive BDF, stiff kinetics" d={950} />
      <Label x={barX} y={barY - 18} mono size={11} d={1050}>
        phase schedule, automatic transitions
      </Label>
      <path
        className="dg-e"
        style={{ "--d": 1150, "--dur": "500ms" } as React.CSSProperties}
        d={`M ${barX + 0.5} ${barY - 4} V ${barY - 9.5} H ${barX + barW - 0.5} V ${barY - 4}`}
        pathLength={1}
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth={1}
      />
      {segs.map((s, i) => (
        <g key={s.name} className="dg-n" style={del(1050 + i * 70)}>
          <rect
            x={s.x + (i ? 2 : 0) + 0.5}
            y={barY + 0.5}
            width={s.w - (i ? 2 : 0) - (i < 3 ? 2 : 0) - 1}
            height={27}
            rx={2}
            fill="var(--plate)"
            stroke="var(--rule-strong)"
          />
          <text x={s.x + (i ? 2 : 0) + 12} y={barY + 18} fontSize={12.5} fill="var(--ink-2)">
            {s.name}
          </text>
        </g>
      ))}
      <Edge pts={[[barX + barW, barY + 14], [drv.x - 2, barY + 14]]} d={1330} dur={300} />
      <Node
        x={drv.x}
        y={drv.y}
        w={drv.w}
        h={drv.h}
        tone="signal"
        title="LNPFreezeDriver"
        sub="ODE integration orchestrator"
        d={1250}
      />

      {/* Integration loop: driver hands state down, kernel returns derivatives */}
      <Edge pts={[[loopL, drv.y + drv.h], [loopL, kTop - 2]]} tone="signal" d={1450} dur={400} />
      <Edge pts={[[loopR, kTop], [loopR, drv.y + drv.h + 2]]} tone="signal" d={1650} dur={400} />
      <Label x={loopL - 10} y={424} anchor="end" mono size={11.5} tone="signal" d={1600}>
        t, y
      </Label>
      <Label x={loopR + 10} y={424} mono size={11.5} tone="signal" d={1800}>
        dy/dt
      </Label>
      <Label x={(loopL + loopR) / 2} y={404} anchor="middle" mono size={11} tone="signal" d={1850}>
        integration
      </Label>
      <Label x={(loopL + loopR) / 2} y={418} anchor="middle" mono size={11} tone="signal" d={1850}>
        loop
      </Label>
      <Pulse path={loopPath} dur={6} r={3} />

      {/* Physics kernel */}
      <Band y={440} h={240} name="Physics kernel" meta="9 coupled ODEs" note="First-principles Arrhenius kinetics" d={1400} />
      <g className="dg-n" style={del(1450)}>
        <rect x={X0 + 0.5} y={kTop + 0.5} width={979} height={179} rx={4} fill="none" stroke="var(--signal)" strokeWidth={1} />
      </g>
      <Kernel
        x={thermal.x}
        y={496}
        w={thermal.w}
        title="Thermal and mass transfer"
        sub="Standard freeze-drying physics"
        states={[["T", "p"], ["z"], ["P", "c"], ["X"], ["N"], ["R", "p"]]}
        d={1500}
      />
      <Kernel
        x={lnp.x}
        y={496}
        w={lnp.w}
        title="LNP kinetics"
        sub="Leakage, RNA degradation, aggregation"
        states={[["EE"], ["RIN"], ["D", "h"]]}
        d={1560}
      />
      <Label x={thermal.x} y={634} mono size={11} d={1800}>
        kinetics.py: Arrhenius, WLF model, moisture coupling
      </Label>

      {/* Post-processing */}
      <Edge pts={[[cqa.cx, 656], [cqa.cx, post.y - 2]]} d={1850} dur={300} />
      <Edge pts={[[dmg.cx, 656], [dmg.cx, post.y - 2]]} d={1850} dur={300} />
      <Band y={680} h={150} name="Post-processing" meta="CQA prediction" note="Phase-attributed damage" d={1850} />
      <Node x={cqa.x} y={post.y} w={cqa.w} h={68} title="CQAPredictor" sub="RM%, EE%, RIN, Z50, PDI" code d={1950} />
      <Node x={dmg.x} y={post.y} w={dmg.w} h={68} title="DamageTracker" sub="Phase-attributed integrals" d={1920} />
      <Edge pts={[[dmg.x, 750], [cqa.x + cqa.w + 2, 750]]} d={2020} dur={250} />

      {/* Outputs */}
      <Edge pts={[[cqa.cx, 784], [cqa.cx, outBus]]} head={false} d={2050} dur={250} />
      <Edge pts={[[outs[0].cx, outBus], [outs[3].cx, outBus]]} head={false} d={2120} dur={300} />
      <g className="dg-n" style={del(2150)}>
        <circle cx={cqa.cx} cy={outBus} r={2.5} fill="var(--ink-3)" />
      </g>
      {outs.map((c, i) => (
        <Edge key={i} pts={[[c.cx, outBus], [c.cx, 874]]} d={2150} dur={150} />
      ))}
      <Band y={830} h={140} name="Outputs" meta="ML and MSPC ready" note="Synthetic datasets" d={2000} />
      {[
        ["CSV trajectories", "9-state time series"],
        ["Excel RunResults", "CQA predictions"],
        ["Visualizations", "6-panel overview"],
        ["Summary stats", "Correlation analysis"],
      ].map(([t, s], i) => (
        <Node key={t} x={outs[i].x} y={876} w={outs[i].w} h={68} title={t} sub={s} d={2050 + i * 50} />
      ))}
    </Diagram>
  );
}
