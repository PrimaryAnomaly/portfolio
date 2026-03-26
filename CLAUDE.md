# CLAUDE.md

## Project

Next.js 16 portfolio site. TypeScript, Tailwind CSS 4, MDX via `next-mdx-remote`. Swiss/brutalist design system.

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

## Content Architecture

- `content/site.ts` — name, title, intro, email, social links
- `content/resume.ts` — experience, education, publications, certifications, technicalSkills
- `content/skills.ts` — skill domains with individual skills and context
- `content/projects/*.mdx` — project write-ups with frontmatter (title, description, date, tags, hero)
- Section order on home page: Skills & Certifications (01) → Experience (02) → Projects (03) → Education (04) → Publications (05)

## MDX Gotchas

- Gallery component receives `images` prop from MDX inline JSX. In Turbopack dev mode, complex inline array props may arrive as `undefined`. Gallery has a null check + string fallback to handle this. Production builds work fine.
- Place project images in `public/images/projects/`. Reference as `/images/projects/filename.ext`.

## Resume PDF

- Must exist at `public/resume.pdf` for the "PDF Resume" header link to work.
