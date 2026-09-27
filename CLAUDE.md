# CLAUDE.md

## Project

Next.js 16 portfolio site. TypeScript, Tailwind CSS 4, MDX via `next-mdx-remote`. Swiss editorial design system with one signal colour (International Orange).

## Design system

- Tokens live as CSS variables in `app/globals.css` (`--paper`, `--ink`, `--ink-2/3`, `--rule`, `--signal`, `--signal-ink`) with a dark-mode set under `prefers-color-scheme`. Use the Tailwind names (`bg-paper`, `text-ink-2`, `border-rule`, `bg-signal`…), never raw hex.
- `--signal` is for marks (dots, rules, arcs). Orange text uses `text-signal-ink` for contrast.
- Type: Instrument Sans (variable `wdth` axis; `.narrow` = 75% width for display type) + IBM Plex Mono for numeric data only.
- Base element rules are in `@layer base` and motion classes in `@layer components`, so Tailwind utilities always win. Don't add unlayered element selectors — they override utilities.
- Design/motion skills are vendored in `.claude/skills/` (Emil Kowalski, ui-skills, frontend-design). Follow them for any UI or animation change.

## Motion (60fps rules)

- Animate only `transform`, `opacity`, `clip-path`. Easing tokens: `--ease-out`, `--ease-in-out`, `--ease-drawer`, `--ease-expo`.
- Hero load choreography: `.line-mask` + `.intro-rise` (masked rise) and `.intro-fade`, staggered with a `--i` style var.
- Scroll reveals: add `data-reveal` (fade-up), `data-reveal="mask"` (wrap text in `.line-mask > span`) or `data-reveal="clip"` (with a `.clip-inner` child). `RevealObserver` (one IntersectionObserver) sets `data-in` once. Clip reveals are observed via their parent, because Chrome treats a fully clipped target as non-intersecting.
- Reveal styles are scoped under `html.js` so content stays visible without JS.
- Lenis (`SmoothScroll`) provides inertial wheel scrolling; disabled for reduced motion; touch stays native. Same-page `#hash` links must be plain `<a>` so Lenis can glide to them.
- Scroll-linked effects (reading progress, experience rail) use CSS `animation-timeline`, never scroll listeners.
- Continuous loops (orbit diagram) pause off-screen via IntersectionObserver. Every animation has a `prefers-reduced-motion` fallback.
- `app/template.tsx` fades pages in with `fill-mode: backwards` ending at `transform: none` — a lingering transform would break the fixed header.

## Build

- **Files live on Windows filesystem** (`C:\Users\Macx\Documents\GitHub\portfolio`), accessed from WSL at `/mnt/c/...`
- **Build on Windows PowerShell** (`npm run build && npx next start`) — WSL builds are slow due to 9P filesystem bridge
- Node.js is installed on both WSL and Windows. Windows path: `C:\Program Files\nodejs`
- PowerShell syntax: use `Remove-Item -Recurse -Force` not `rm -rf`, use `;` not `&&` to chain commands
- Delete `.next` before rebuilding if switching between WSL and Windows (`Remove-Item -Recurse -Force .next`)

## Next.js 16 + Turbopack

- Turbopack is the default bundler. Any `webpack` config in `next.config.ts` requires `turbopack: {}` to be set alongside it, or build fails with "webpack config and no turbopack config" error.
- WSL hot reload doesn't work on `/mnt/c/` paths. `webpack.watchOptions.poll` is set in `next.config.ts` but only applies when webpack is used (not Turbopack dev). Dev server must be restarted manually after file changes on WSL.
- `package.json` scripts must use cross-platform syntax — no `ENVVAR=value command` (Unix-only). Use `next dev --turbopack` directly.

## Site Structure

Two page types only:
- `/` — single-page portfolio/resume (all content inline)
- `/projects/[slug]` — individual project detail pages

Content sources:
- `content/site.ts` — name, title, intro, email, social links
- `content/resume.ts` — experience, education, publications, certifications, technicalSkills
- `content/skills.ts` — skill domains with individual skills and context
- `content/projects/*.mdx` — project write-ups with frontmatter (title, description, date, tags, hero)
- Section order on home page: Skills & Certifications (01) → Experience (02) → Projects (03) → Education (04) → Publications (05)

## MDX Gotchas

- next-mdx-remote v6 strips JS expressions from MDX by default (`blockJS`). The project page passes `blockJS: false, blockDangerousJS: true` so `<Gallery images={[...]} />` props survive.
- Gallery has a null check + string fallback for `images`. Missing or `placeholder` images render a designed "photo to come" plate, and placeholder project heroes render a per-project SVG motif (`components/site/ProjectCover.tsx`).
- Place project images in `public/images/projects/`. Reference as `/images/projects/filename.ext`.

## Resume PDF

- Must exist at `public/resume.pdf` for the "PDF Resume" header link to work.

## Excalidraw Skill

- Render script at `~/.claude/skills/excalidraw-diagram-skill/references/render_excalidraw.py` uses **npx Playwright CLI** (not Python Playwright library)
- Run: `python3 render_excalidraw.py <file.excalidraw>` — outputs PNG next to the source file
- Use `--scale 6` for ~600 DPI output (default scale 2). Scale is applied via CSS transform on the SVG.
- WSL prerequisite: `sudo apt-get install -y libasound2t64` (Chromium needs `libasound.so.2`; the package name `libasound2` is virtual on Ubuntu 24+)
- Use `fontFamily: 2` (Helvetica/sans-serif) for modern look, not `fontFamily: 3` (Cascadia/monospace)
- Use `strokeStyle: "dotted"` not `"dashed"` for region borders and short connector lines — dashed looks broken on short segments
