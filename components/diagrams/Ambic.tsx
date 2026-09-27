import { Band, Chip, Diagram, Edge, Label, Node, Pulse, X0, cols, roundedPath } from "./kit";

/*
  AMBIC Data Platform. Reads top to bottom: researchers in a browser,
  the React frontend, Supabase Edge Functions, then Supabase services.
  Signal orange tells one story, the upload path: a researcher drops a
  file on the dashboard, process-dataset-upload runs, and the result
  lands in storage and in PostgreSQL.
*/

const H = 612;
const SPINE = X0 + 200; // x of the upload path through every layer
const BRANCH = X0 + 400; // where the upload path enters PostgreSQL

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

export function AmbicDiagram() {
  const web = cols(4);
  const api = cols(3, 20);
  const svc = cols(3, 20);

  const pillW = 160;
  
  const junctionY = 402;
  const uploadPath = roundedPath([
    [SPINE, 40],
    [SPINE, junctionY],
    [BRANCH, junctionY],
    [BRANCH, 458],
  ]);

  const half = (w: number) => (w - 8) / 2;
  const third = (w: number) => (w - 16) / 3;

  return (
    <Diagram
      h={H}
      title="AMBIC Data Platform architecture: users in a browser, React frontend, Supabase Edge Functions API layer, and Supabase storage, PostgreSQL and auth, with the dataset upload path highlighted"
    >
      {/* Users */}
      <g className="dg-n" style={d(0)}>
        <text x={0} y={25} fontSize={15} fontWeight={600} fill="var(--ink)" letterSpacing="-0.01em">
          Users
        </text>
        <text x={0} y={45} fontSize={11.5} fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)" }}>
          CSV, XLSX, JSON files
        </text>
      </g>
      <Node x={SPINE - pillW / 2} y={0} w={pillW} h={40} pill align="center" title="Researchers" tone="signal" d={60} />
      <Edge pts={[[SPINE, 40], [SPINE, 128]]} tone="signal" d={200} dur={450} />
      <Label x={SPINE + 12} y={88} mono size={11} tone="signal" d={500}>
        upload
      </Label>

      {/* Frontend */}
      <Band y={100} h={170} name="Frontend" meta="React, TypeScript, Vite" d={300} />
      <Label x={0} y={168} mono size={11.5} d={300}>
        shadcn/ui, Recharts
      </Label>
      {[
        ["Dashboard", "File and folder browser"],
        ["Dataset viewer", "Tables and charts"],
        ["Analytics", "Data exploration"],
        ["Normalization", "Column mapping"],
      ].map(([t, s], i) => (
        <Node key={t} x={web[i].x} y={130} w={web[i].w} h={68} title={t} sub={s} d={380 + i * 60} />
      ))}
      <g className="dg-n" style={d(640)}>
        <line x1={web[1].x + 16} y1={198} x2={web[1].x + 16} y2={216} stroke="var(--rule-strong)" />
      </g>
      <Chip x={web[1].x} y={216} w={136} label="2D virtualization" d={660} />
      <Label x={web[1].x + 148} y={232} size={11.5} d={700}>
        3,000+ columns
      </Label>

      {/* Frontend to API */}
      <Edge pts={[[SPINE, 198], [SPINE, 298]]} tone="signal" d={700} dur={450} />
      {/* shared bus: every view calls the API layer, no specific pairing implied */}
      <Edge pts={[[api[1].cx, 252], [Math.max(api[2].cx, web[3].cx), 252]]} head={false} d={740} dur={300} />
      {[1, 2].map((i) => (
        <Edge key={i} pts={[[api[i].cx, 252], [api[i].cx, 298]]} d={800 + i * 60} dur={260} />
      ))}
      <Edge pts={[[web[3].cx, 198], [web[3].cx, 252]]} head={false} d={700} dur={220} />
      <Edge pts={[[web[2].cx, 198], [web[2].cx, 252]]} head={false} d={700} dur={220} />

      {/* API layer */}
      <Band y={270} h={160} name="API layer" meta="Supabase Edge Functions" d={780} />
      <Label x={0} y={338} mono size={11.5} d={780}>
        Deno runtime
      </Label>
      {[
        ["Dataset processing", "Processes uploads"],
        ["File operations", "Create, read, update, delete"],
        ["Sharing and permissions", "Sharing operations"],
      ].map(([t, s], i) => (
        <Node key={t} x={api[i].x} y={300} w={api[i].w} h={68} title={t} sub={s} d={860 + i * 60} />
      ))}

      {/* API to services */}
      <Edge pts={[[SPINE, 368], [SPINE, 458]]} tone="signal" d={1150} dur={450} />
      <Edge pts={[[SPINE, junctionY], [BRANCH, junctionY], [BRANCH, 458]]} tone="signal" d={1300} dur={500} />
      <circle className="dg-n" style={d(1300)} cx={SPINE} cy={junctionY} r={3} fill="var(--signal)" />
      <Edge pts={[[api[1].cx + 70, 368], [api[1].cx + 70, 458]]} d={1200} dur={350} />
      <Edge pts={[[api[2].cx, 368], [api[2].cx, 458]]} d={1260} dur={350} />

      {/* Services */}
      <Band y={430} h={H - 430} name="Backend services" meta="Supabase" d={1250} />

      {/* Storage */}
      <Node x={svc[0].x} y={460} w={svc[0].w} h={70} title="Object storage" sub="Raw uploads" d={1400} />
      {["csv", "xlsx", "json"].map((t, i) => (
        <Chip key={t} x={svc[0].x + i * (third(svc[0].w) + 8)} y={546} w={third(svc[0].w)} label={t} d={1500 + i * 35} />
      ))}
      <Label x={svc[0].x} y={592} mono size={11} d={1650}>
        {"storage RLS: %/content/% paths"}
      </Label>

      {/* PostgreSQL */}
      <Node x={svc[1].x} y={460} w={svc[1].w} h={70} title="PostgreSQL" sub="Row-level security on all tables" d={1450} />
      {["normalized datasets", "source links"].map((t, i) => (
        <Chip
          key={t}
          x={svc[1].x + i * (half(svc[1].w) + 8)}
          y={546}
          w={half(svc[1].w)}
          label={t}
          tone={i === 0 ? "signal" : "default"}
          d={1550 + i * 35}
        />
      ))}
      <Label x={svc[1].x} y={592} size={11.5} d={1700}>
        Every normalized dataset links back to its source
      </Label>

      {/* Auth */}
      <Node x={svc[2].x} y={460} w={svc[2].w} h={70} title="Auth" sub="Email and password" d={1500} />
      {["owner", "editor", "viewer"].map((t, i) => (
        <Chip key={t} x={svc[2].x + i * (third(svc[2].w) + 8)} y={546} w={third(svc[2].w)} label={t} d={1650 + i * 35} />
      ))}
      <Label x={svc[2].x} y={592} size={11.5} d={1750}>
        Three-tier access control
      </Label>

      <Pulse path={uploadPath} dur={7} />
    </Diagram>
  );
}
