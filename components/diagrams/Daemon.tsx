import { Band, Chip, Diagram, Edge, Label, Node, Pulse, X0, cols, roundedPath } from "./kit";

/*
  DAEMON: Discovery Agents Exploring Mechanistic ODE Networks.
  Reads top to bottom: the PI steers, the web layer shows, the
  orchestrator runs the discovery cycle (the signal loop), agents act,
  and three services underneath hold state, simulate, and think.
*/

const H = 960;

export function DaemonDiagram() {
  const web = cols(4);
  const agents = cols(5, 14);
  const svc = cols(3, 20);

  // Discovery cycle stations
  const cycleY = 372;
  const stations = ["Question", "Propose", "Execute", "Observe", "Update", "Convene"];
  const sx = (i: number) => X0 + 36 + i * 142;
  const diamondX = sx(6) + 12;
  const loop: [number, number][] = [
    [diamondX, cycleY - 13],
    [diamondX, cycleY - 58],
    [sx(0), cycleY - 58],
    [sx(0), cycleY - 7],
  ];
  const cyclePath = `M ${sx(0)} ${cycleY} L ${diamondX - 13} ${cycleY} ` + roundedPath(loop).replace(/^M/, "L");

  return (
    <Diagram h={H} title="DAEMON system architecture: principal investigator, web layer, orchestrator discovery cycle, five agents, and knowledge base, simulation and LLM services">
      {/* PI */}
      <Node x={X0 + 350} y={0} w={280} h={44} pill align="center" tone="signal" title="Principal investigator" d={0} />
      <Label x={X0 + 506} y={78} d={200}>
        Questions, interventions, parameter limits
      </Label>
      <Edge pts={[[X0 + 490, 44], [X0 + 490, 118]]} d={150} dur={400} />

      {/* Web layer */}
      <Band y={120} h={170} name="Web layer" meta="FastAPI, Next.js, SSE" d={250} />
      {[
        ["Session dashboard", "Real-time agent activity"],
        ["Hypothesis panel", "Evidence chains and scores"],
        ["Experiment log", "Parameters and results"],
        ["Convergence metrics", "Cycle progress"],
      ].map(([t, s], i) => (
        <Node key={t} x={web[i].x} y={150} w={web[i].w} h={68} title={t} sub={s} d={300 + i * 60} />
      ))}
      <Chip x={X0 + 440} y={238} w={100} label="SSE stream" d={560} />
      <Edge pts={[[X0 + 490, 262], [X0 + 490, 292]]} d={600} dur={300} head={false} tail />

      {/* Orchestrator */}
      <Band y={292} h={150} name="Orchestrator" meta="Python, asyncio" d={650} />
      <path
        className="dg-e"
        style={{ "--d": 900, "--dur": "1600ms" } as React.CSSProperties}
        d={cyclePath}
        pathLength={1}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {stations.map((s, i) => (
        <g key={s} className="dg-n" style={{ "--d": 900 + i * 110 } as React.CSSProperties}>
          <circle cx={sx(i)} cy={cycleY} r={6} fill="var(--paper)" stroke="var(--signal)" strokeWidth={1.5} />
          <circle cx={sx(i)} cy={cycleY} r={2.2} fill="var(--signal)" />
          <text x={sx(i)} y={cycleY + 30} fontSize={12.5} textAnchor="middle" fill="var(--ink)">
            {s}
          </text>
        </g>
      ))}
      <g className="dg-n" style={{ "--d": 1600 } as React.CSSProperties}>
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
      <Label x={sx(0) + 14} y={cycleY - 66} mono size={11} d={1500}>
        discovery cycle, repeats until converged
      </Label>
      <Pulse path={cyclePath} dur={7} />

      {/* Agents */}
      <Edge pts={[[X0 + 490, 412], [X0 + 490, 470]]} d={1100} dur={300} />
      <Band y={472} h={176} name="Agent system" meta="independent beliefs" d={1150} />
      {[
        ["Scout", "Breadth-first explorer"],
        ["Refiner", "Depth-first optimiser"],
        ["Auditor", "Quality verification"],
        ["Conservative", "Risk validation"],
        ["Monitor", "PI proxy, observer"],
      ].map(([t, s], i) => (
        <Node key={t} x={agents[i].x} y={502} w={agents[i].w} h={68} title={t} sub={s} d={1200 + i * 60} />
      ))}
      <g className="dg-n" style={{ "--d": 1500 } as React.CSSProperties}>
        <text x={X0} y={604} fontSize={12} fill="var(--ink-3)">
          Bayesian hypothesis tracking
        </text>
        {/* posterior bar */}
        <rect x={X0 + 440} y={596} width={540} height={4} rx={2} fill="var(--rule)" />
        <rect x={X0 + 440} y={596} width={540 * 0.2} height={4} rx={2} fill="var(--ink-3)" opacity={0.5} />
        <rect x={X0 + 440 + 540 * 0.9} y={596} width={540 * 0.1} height={4} rx={2} fill="var(--signal)" />
        {[
          [0, "0", "var(--ink-3)", "start"],
          [0.2, "0.2", "var(--ink-3)", "middle"],
          [0.9, "0.9", "var(--signal-ink)", "middle"],
          [1, "1", "var(--ink-3)", "end"],
        ].map(([v, t, c, anchor]) => (
          <text
            key={t as string}
            x={X0 + 440 + 540 * (v as number)}
            y={620}
            fontSize={10.5}
            fill={c as string}
            textAnchor={anchor as "start" | "middle" | "end"}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {t}
          </text>
        ))}
        <text x={X0 + 440 + 540 * 0.1} y={586} fontSize={11} fill="var(--ink-3)" textAnchor="middle">
          retire
        </text>
        <text x={X0 + 440 + 540 * 0.95} y={586} fontSize={11} fill="var(--signal-ink)" textAnchor="middle">
          accept
        </text>
      </g>
      {/* a belief drifting along the posterior */}
      <g className="dg-pulse">
        <circle cy={598} r={5} fill="var(--paper)" stroke="var(--signal)" strokeWidth={1.5}>
          <animate
            attributeName="cx"
            dur="9s"
            repeatCount="indefinite"
            values={`${X0 + 440 + 540 * 0.45};${X0 + 440 + 540 * 0.72};${X0 + 440 + 540 * 0.61};${X0 + 440 + 540 * 0.94};${X0 + 440 + 540 * 0.94};${X0 + 440 + 540 * 0.45}`}
            keyTimes="0;0.3;0.45;0.75;0.92;1"
            calcMode="spline"
            keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
          />
        </circle>
      </g>

      {/* Services */}
      {svc.map((c, i) => (
        <Edge key={i} pts={[[c.cx, 632], [c.cx, 676]]} d={1600 + i * 80} dur={300} />
      ))}
      <Band y={648} h={H - 648} name="Services" d={1650} />

      {/* Knowledge base */}
      <g className="dg-n" style={{ "--d": 1700 } as React.CSSProperties}>
        <text x={svc[0].x} y={704} fontSize={14} fontWeight={600} fill="var(--ink)">
          Knowledge base
        </text>
        <text x={svc[0].x} y={722} fontSize={11} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          SQLite, full provenance
        </text>
      </g>
      {["sessions", "cycles", "agents", "experiments", "hypotheses", "board_posts", "notebook_entries", "monitor_flags", "agent_questions"].map(
        (t, i) => (
          <Chip
            key={t}
            x={svc[0].x + (i % 2) * ((svc[0].w + 8) / 2)}
            y={740 + Math.floor(i / 2) * 32}
            w={(svc[0].w - 8) / 2}
            label={t}
            tone={t === "hypotheses" ? "signal" : "default"}
            d={1750 + i * 35}
          />
        ),
      )}

      {/* Simulation */}
      <g className="dg-n" style={{ "--d": 1750 } as React.CSSProperties}>
        <text x={svc[1].x} y={704} fontSize={14} fontWeight={600} fill="var(--ink)">
          Simulation
        </text>
        <text x={svc[1].x} y={722} fontSize={11} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          9-state ODE, SciPy BDF
        </text>
      </g>
      <Node x={svc[1].x} y={740} w={svc[1].w} h={56} title="SimulationInterface" sub="abstract base, swappable models" d={1800} />
      <Edge pts={[[svc[1].cx, 796], [svc[1].cx, 826]]} d={1900} dur={250} />
      <Node x={svc[1].x} y={828} w={svc[1].w} h={68} tone="ink" title="lyo-mech-model" sub="20 parameters, trajectories, CQAs" d={1950} />

      {/* LLM providers */}
      <g className="dg-n" style={{ "--d": 1800 } as React.CSSProperties}>
        <text x={svc[2].x} y={704} fontSize={14} fontWeight={600} fill="var(--ink)">
          LLM providers
        </text>
        <text x={svc[2].x} y={722} fontSize={11} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          model set per agent
        </text>
      </g>
      <Node x={svc[2].x} y={740} w={svc[2].w} h={56} title="Anthropic" sub="Claude API" d={1850} />
      <Node x={svc[2].x} y={806} w={svc[2].w} h={56} title="OpenRouter" sub="Gemini Flash" d={1900} />
      <g className="dg-n" style={{ "--d": 2000 } as React.CSSProperties}>
        <circle cx={svc[2].x + 4} cy={886} r={3} fill="var(--signal)" />
        <text x={svc[2].x + 14} y={890} fontSize={12} fill="var(--ink-2)">
          No silent fallbacks: failures surface immediately
        </text>
      </g>
    </Diagram>
  );
}
