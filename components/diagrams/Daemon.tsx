import { Band, Chip, Diagram, Edge, Label, Node, Pulse, X0, cols, roundedPath } from "./kit";

/*
  DAEMON: Discovery Agents Exploring Mechanistic ODE Networks.
  Reads top to bottom: the PI steers through the web layer, the
  orchestrator runs the discovery cycle, agents act, and three services
  underneath hold state, simulate, and reason.

  Colour: grey outline = component. Orange = the discovery cycle (the
  story) and the hypotheses it produces. Every edge starts and ends on
  an element: nodes, a bus line, a junction dot, or a column rule.
*/

const H = 948;

type CSS = React.CSSProperties;

function Bus({ x1, x2, y, d = 0 }: { x1: number; x2: number; y: number; d?: number }) {
  return <Edge pts={[[x1, y], [x2, y]]} head={false} d={d} dur={320} />;
}

function Junction({ x, y, tone = "ink", d = 0 }: { x: number; y: number; tone?: "ink" | "signal"; d?: number }) {
  return (
    <circle
      className="dg-n"
      style={{ "--d": d } as CSS}
      cx={x}
      cy={y}
      r={3}
      fill={tone === "signal" ? "var(--signal)" : "var(--ink-3)"}
    />
  );
}

export function DaemonDiagram() {
  const web = cols(4);
  const agents = cols(5, 14);
  const svc = cols(3, 20);
  const CX = X0 + 490; // diagram spine

  // Web layer
  const webBusTop = 136;
  const webTop = 156;
  const webBottom = webTop + 68;
  const webBusBottom = 244;
  const sseY = 256;

  // Discovery cycle
  const cycleY = 396;
  const loopTop = cycleY - 58;
  const stations = ["Question", "Propose", "Execute", "Observe", "Update", "Convene"];
  const sx = (i: number) => X0 + 36 + i * 142;
  const diamondX = sx(6) + 12;
  const loop: [number, number][] = [
    [diamondX, cycleY - 13],
    [diamondX, loopTop],
    [sx(0), loopTop],
    [sx(0), cycleY - 7],
  ];
  const cyclePath = `M ${sx(0)} ${cycleY} L ${diamondX - 13} ${cycleY} ` + roundedPath(loop).replace(/^M/, "L");
  const dispatchX = (sx(2) + sx(3)) / 2;

  // Agents
  const agentBusTop = 494;
  const agentTop = 514;
  const agentBottom = agentTop + 68;
  const agentBusBottom = 604;

  // Services
  const svcRule = 656;
  const svcHead = svcRule + 24;
  const svcBody = svcRule + 58;

  const kbChips = ["sessions", "cycles", "agents", "experiments", "hypotheses", "board_posts", "notebook_entries", "monitor_flags", "agent_questions"];
  const kbChipsEnd = svcBody + 4 * 32 + 24;
  const barY = kbChipsEnd + 44;
  const barW = svc[0].w;

  return (
    <Diagram h={H} title="DAEMON system architecture: principal investigator, web layer, orchestrator discovery cycle, five agents, and knowledge base, simulation and LLM services">
      {/* ── PI → web layer ── */}
      <Node x={CX - 140} y={0} w={280} h={44} pill align="center" title="Principal investigator" d={0} />
      <Edge pts={[[CX, 44], [CX, webBusTop]]} head={false} d={120} dur={300} />
      <Junction x={CX} y={webBusTop} d={400} />
      <Label x={CX + 12} y={94} d={200}>
        Research questions, interventions, parameter restrictions, monitoring
      </Label>

      <Band y={112} h={176} name="Web layer" meta="FastAPI, Next.js, SSE" d={250} />
      <Bus x1={web[0].cx} x2={web[3].cx} y={webBusTop} d={380} />
      {web.map((c, i) => (
        <Edge key={i} pts={[[c.cx, webBusTop], [c.cx, webTop]]} d={480 + i * 40} dur={180} />
      ))}
      {[
        ["Session dashboard", "Real-time agent activity"],
        ["Hypothesis panel", "Evidence chains and scores"],
        ["Experiment log", "Parameters and results"],
        ["Convergence metrics", "Cycle progress"],
      ].map(([t, s], i) => (
        <Node key={t} x={web[i].x} y={webTop} w={web[i].w} h={68} title={t} sub={s} d={300 + i * 60} />
      ))}

      {/* views are fed by the SSE stream */}
      {web.map((c, i) => (
        <Edge key={i} pts={[[c.cx, webBusBottom], [c.cx, webBottom]]} d={700 + i * 40} dur={160} />
      ))}
      <Bus x1={web[0].cx} x2={web[3].cx} y={webBusBottom} d={640} />
      <Edge pts={[[CX, sseY], [CX, webBusBottom]]} head={false} d={620} dur={120} />
      <Junction x={CX} y={webBusBottom} d={640} />
      <Chip x={CX - 50} y={sseY} w={100} label="SSE stream" d={600} />

      {/* ── Orchestrator ── */}
      <Band y={288} h={174} name="Orchestrator" meta="Python, asyncio" d={650} />
      {/* cycle state streams up to the web layer */}
      <Edge pts={[[CX, loopTop], [CX, sseY + 24]]} d={1500} dur={260} />
      <Junction x={CX} y={loopTop} tone="signal" d={1500} />

      <path
        className="dg-e"
        style={{ "--d": 900, "--dur": "1600ms" } as CSS}
        d={cyclePath}
        pathLength={1}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {stations.map((s, i) => (
        <g key={s} className="dg-n" style={{ "--d": 900 + i * 110 } as CSS}>
          <circle cx={sx(i)} cy={cycleY} r={6} fill="var(--paper)" stroke="var(--signal)" strokeWidth={1.5} />
          <circle cx={sx(i)} cy={cycleY} r={2.2} fill="var(--signal)" />
          <text x={sx(i)} y={cycleY + 30} fontSize={12.5} textAnchor="middle" fill="var(--ink)">
            {s}
          </text>
        </g>
      ))}
      <g className="dg-n" style={{ "--d": 1600 } as CSS}>
        <rect
          x={diamondX - 9}
          y={cycleY - 9}
          width={18}
          height={18}
          transform={`rotate(45 ${diamondX} ${cycleY})`}
          fill="var(--signal)"
        />
        <text x={diamondX} y={cycleY + 30} fontSize={12.5} textAnchor="middle" fill="var(--ink)" fontWeight={600}>
          Converged?
        </text>
      </g>
      <Label x={sx(0) + 14} y={loopTop - 8} mono size={11} tone="signal" d={1500}>
        discovery cycle, repeats until converged
      </Label>
      <Pulse path={cyclePath} dur={7} />

      {/* ── Orchestrator dispatches agents ── */}
      <Edge pts={[[dispatchX, cycleY], [dispatchX, agentBusTop]]} head={false} d={1300} dur={300} />
      <Junction x={dispatchX} y={cycleY} tone="signal" d={1300} />
      <Junction x={dispatchX} y={agentBusTop} d={1450} />
      <Label x={dispatchX + 10} y={cycleY + 60} mono size={11} d={1350}>
        dispatch
      </Label>

      <Band y={462} h={176} name="Agent system" meta="independent beliefs" d={1150} />
      <Bus x1={agents[0].cx} x2={agents[4].cx} y={agentBusTop} d={1400} />
      {agents.map((c, i) => (
        <Edge key={i} pts={[[c.cx, agentBusTop], [c.cx, agentTop]]} d={1480 + i * 40} dur={160} />
      ))}
      {[
        ["Scout", "Breadth-first explorer"],
        ["Refiner", "Depth-first optimizer"],
        ["Auditor", "Quality verification"],
        ["Conservative", "Risk validation"],
        ["Monitor", "PI proxy / observer"],
      ].map(([t, s], i) => (
        <Node key={t} x={agents[i].x} y={agentTop} w={agents[i].w} h={68} title={t} sub={s} d={1200 + i * 60} />
      ))}

      {/* ── Agents use the services ── */}
      {agents.map((c, i) => (
        <Edge key={i} pts={[[c.cx, agentBottom], [c.cx, agentBusBottom]]} head={false} d={1600 + i * 30} dur={140} />
      ))}
      <Bus x1={agents[0].cx} x2={agents[4].cx} y={agentBusBottom} d={1650} />
      {svc.map((c, i) => (
        <g key={i}>
          <Edge pts={[[c.cx, agentBusBottom], [c.cx, svcRule]]} d={1750 + i * 60} dur={240} />
          <Junction x={c.cx} y={agentBusBottom} d={1750 + i * 60} />
          <line
            className="dg-n"
            style={{ "--d": 1800 + i * 60 } as CSS}
            x1={c.x}
            y1={svcRule}
            x2={c.x + c.w}
            y2={svcRule}
            stroke="var(--ink-2)"
            strokeWidth={1}
          />
        </g>
      ))}

      <Band y={638} h={H - 638} name="Services" d={1650} />

      {/* Knowledge base */}
      <g className="dg-n" style={{ "--d": 1850 } as CSS}>
        <text x={svc[0].x} y={svcHead} fontSize={14} fontWeight={600} fill="var(--ink)">
          Knowledge base
        </text>
        <text x={svc[0].x} y={svcHead + 18} fontSize={11} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          SQLite, full provenance
        </text>
      </g>
      {kbChips.map((t, i) => (
        <Chip
          key={t}
          x={svc[0].x + (i % 2) * ((svc[0].w + 8) / 2)}
          y={svcBody + Math.floor(i / 2) * 32}
          w={(svc[0].w - 8) / 2}
          label={t}
          tone={t === "hypotheses" ? "signal" : "default"}
          d={1900 + i * 35}
        />
      ))}
      {/* Bayesian confidence carried by each hypothesis */}
      <g className="dg-n" style={{ "--d": 2150 } as CSS}>
        <text x={svc[0].x} y={barY - 12} fontSize={12} fill="var(--ink-2)">
          Hypothesis confidence (Bayesian)
        </text>
        <rect x={svc[0].x} y={barY} width={barW} height={4} rx={2} fill="var(--rule)" />
        <rect x={svc[0].x} y={barY} width={barW * 0.2} height={4} rx={2} fill="var(--ink-3)" opacity={0.55} />
        <rect x={svc[0].x + barW * 0.9} y={barY} width={barW * 0.1} height={4} rx={2} fill="var(--signal)" />
        <text x={svc[0].x} y={barY + 22} fontSize={10.5} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          {"retire < 0.2"}
        </text>
        <text
          x={svc[0].x + barW}
          y={barY + 22}
          fontSize={10.5}
          fill="var(--signal-ink)"
          textAnchor="end"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {"accept ≥ 0.9"}
        </text>
      </g>

      {/* Simulation */}
      <g className="dg-n" style={{ "--d": 1900 } as CSS}>
        <text x={svc[1].x} y={svcHead} fontSize={14} fontWeight={600} fill="var(--ink)">
          Simulation
        </text>
        <text x={svc[1].x} y={svcHead + 18} fontSize={11} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          9-state ODE, SciPy BDF
        </text>
      </g>
      <Node x={svc[1].x} y={svcBody} w={svc[1].w} h={56} title="SimulationInterface" sub="abstract base class (ABC)" d={1950} />
      <Edge pts={[[svc[1].cx, svcBody + 56], [svc[1].cx, svcBody + 86]]} d={2050} dur={220} />
      <Node
        x={svc[1].x}
        y={svcBody + 86}
        w={svc[1].w}
        h={68}
        title="lyo-mech-model"
        sub="20 parameters, trajectories, CQAs"
        d={2100}
      />

      {/* LLM providers */}
      <g className="dg-n" style={{ "--d": 1950 } as CSS}>
        <text x={svc[2].x} y={svcHead} fontSize={14} fontWeight={600} fill="var(--ink)">
          LLM providers
        </text>
        <text x={svc[2].x} y={svcHead + 18} fontSize={11} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          per-agent model config
        </text>
      </g>
      <Node x={svc[2].x} y={svcBody} w={svc[2].w} h={56} title="Anthropic" sub="Claude API" d={2000} />
      <Node x={svc[2].x} y={svcBody + 66} w={svc[2].w} h={56} title="OpenRouter" sub="Gemini Flash" d={2050} />
      <g className="dg-n" style={{ "--d": 2150 } as CSS}>
        <circle cx={svc[2].x + 4} cy={svcBody + 150} r={3} fill="var(--ink-3)" />
        <text x={svc[2].x + 14} y={svcBody + 154} fontSize={12} fill="var(--ink-2)">
          Zero silent fallbacks
        </text>
        <text x={svc[2].x + 14} y={svcBody + 170} fontSize={12} fill="var(--ink-3)">
          All failures surface immediately
        </text>
      </g>
    </Diagram>
  );
}
