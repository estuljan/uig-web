# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/` hosts all UI routes; follow the Next.js Pages Router (each `.tsx` file becomes a route).
- `src/pages/api/` stores serverless handlers; keep them isolated from UI code and export typed `NextApiRequest/Response` signatures.
- `src/styles/globals.css` is the single entry for Tailwind CSS v4 and design tokens. Theme variables (for example, `--font-geist-sans`) should be defined here.
- `public/` stores static assets and favicons that are referenced via the `/` prefix.
- Root-level configs (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`) should stay minimal; summarize intent in PRs whenever you modify them.

## Build, Test, and Development Commands
- `pnpm dev` starts the hot-reloading dev server at `http://localhost:3000`.
- `pnpm build` runs the production Next.js compiler and TypeScript checks.
- `pnpm start` serves the `.next` output locally to mimic the deployed build.
- `pnpm lint` runs the Next + ESLint 9 stack; add `--fix` only when confident.

## Coding Style & Naming Conventions
Write modules in `.ts`/`.tsx` and prefer `const` plus arrow functions. Component files should mirror their route (for example, `src/pages/words/index.tsx`). Keep two-space indentation and default to double quotes unless Tailwind utilities demand otherwise. Group Tailwind classes layout → spacing → typography → state as seen in `src/pages/index.tsx`. Keep API handlers synchronous where possible and return typed payloads (`NextApiResponse<{ name: string }>`). Fonts load via `next/font`; do not add manual `<link>` tags or global imports beyond `globals.css`.

## Testing Guidelines
No automated test script exists yet (see `package.json`), so document manual QA steps in every PR. When you add tests, store them as `*.test.ts(x)` next to the component or under `src/__tests__/` and wire them to a future `pnpm test` script. For API routes, verify responses with `curl http://localhost:3000/api/hello` after running `pnpm dev`. Maintain scenario parity: each new route or API path merged should include at least one verification note.

## Commit & Pull Request Guidelines
Follow the short, imperative subjects visible in `git log` (for example, `Fetch words from API`, `Update deploy port mapping`). Group related changes per commit and keep bodies focused on “what” and “why.” Every PR must include a purpose summary, screenshots or GIFs for UI work, reproduction steps for reviewers, and links to Jira or GitHub issues when applicable. Re-run `pnpm lint` and `pnpm build` before requesting review, and note skipped checks directly in the PR description.
