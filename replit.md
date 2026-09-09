# Shortly

Shortly turns long URLs into clean, shareable links through a responsive React frontend with an AWS-ready API boundary and local mock fallback.

## Run & Operate

- `pnpm --filter @workspace/shortly run dev` — run the Shortly frontend
- `pnpm --filter @workspace/api-server run dev` — run the shared API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Frontend env: `VITE_API_URL` — optional AWS API Gateway base URL. When omitted, Shortly uses its local mock shortener.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/shortly/src/pages/home.tsx` — landing page and URL shortening flow
- `artifacts/shortly/src/lib/shorten-url.ts` — AWS-ready API utility and mock fallback
- `artifacts/shortly/src/index.css` — visual system and responsive styles
- `artifacts/shortly/README.md` — local setup and API contract notes

## Architecture decisions

- Keep the first release frontend-only; no authentication, database, or backend service is required for the user flow.
- Isolate the network boundary in `shorten-url.ts` so AWS API Gateway can be added without changing the UI.
- Use a deterministic mock response when `VITE_API_URL` is absent so validation, loading, success, and copy states remain demonstrable locally.

## Product

Users can paste a long HTTP(S) URL, receive a generated short URL, copy it to their clipboard, and start another shortening flow. The page also explains the three-step process and includes a minimal AWS placeholder footer.

## User preferences

- Keep the project beginner-friendly and avoid adding authentication, a database, or a backend service unless explicitly requested.

## Gotchas

- The artifact workflow supplies `PORT` and `BASE_PATH`; use the managed Shortly workflow rather than starting Vite from the workspace root.
- After changing the API contract or utility, keep the expected request at `POST ${VITE_API_URL}/shorten` with `{ url }` and the response field as `shortUrl`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
