# BSY MIS Portal

Maharashtra government's Kranti Jyoti Savitribai Phule Bal Sangopan Yojana (BSY) — a comprehensive MIS web portal for managing child welfare scheme applications, reviews, approvals, and DBT payments across all stakeholder roles.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at /api)
- `pnpm --filter @workspace/bsy-portal run dev` — run the frontend (port 24976, served at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + wouter + TanStack Query + shadcn/ui + Tailwind v4
- API: Express 5 + express-session
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → TanStack Query hooks)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/src/generated/` — generated hooks + Zod schemas
- `lib/db/src/schema/` — Drizzle ORM schema (users, applications, beneficiaries, payments, notifications, etc.)
- `artifacts/api-server/src/routes/` — Express route handlers (auth, applications, payments, etc.)
- `artifacts/bsy-portal/src/pages/` — React pages (home, login, register, apply, track, dashboard, schemes, about)
- `artifacts/bsy-portal/src/components/layout/` — Header, Footer, PageWrapper
- `artifacts/bsy-portal/src/lib/i18n.tsx` — English/Marathi translations

## Architecture decisions

- Contract-first: OpenAPI spec drives codegen; all hooks imported from `@workspace/api-client-react`
- Session-based auth: express-session stores userId server-side; no JWT tokens
- Public track endpoint: `/api/applications/track/:appNumber` works without auth
- OTP auth for applicants; username+password for staff roles (GIMABA, PO, PWC, Sanstha, Facilitator)
- Maharashtra saffron (#E65100 primary) + navy blue secondary color theme

## Product

BSY MIS Portal enables:
1. **Applicants** — register via OTP, fill 4-step application form, track status, view related schemes
2. **Facilitators** — assist applicants at e-Suvidha Kendra / Anganwadi
3. **Sanstha/NGO** — enroll beneficiaries, submit cases, receive admin grants
4. **GIMABA** — review submitted applications, forward to Protection Officer
5. **Protection Officer** — conduct SIR home visits, submit reports
6. **PWC Committee** — approve/reject in quarterly meetings, track DBT payments
7. **Public** — track application by number, view scheme info, read eligibility

## Demo Users (seeded)

- Applicant: `9999000001` (OTP login)
- GIMABA: `9999000002` (staff login, role: gimaba)
- Protection Officer: `9999000003` (staff login, role: po)
- PWC: `9999000004` (staff login, role: pwc)
- Sanstha: `9999000005` (staff login, role: sanstha)
- Facilitator: `9999000006` (staff login, role: facilitator)

## User preferences

- Full Marathi + English bilingual support — all UI text must be translated
- Maharashtra government color scheme: saffron (primary), navy (secondary)
- MIS portal must reflect the real BSY scheme rules (April–March financial year, ₹2,250/₹2,500 rates, Aadhaar seeding requirement, etc.)

## Gotchas

- The API server returns arrays directly for `/schemes`, `/payments`, `/beneficiaries` — not wrapped objects
- `/applications` returns `{ applications: [], total, page, limit }` (wrapped)
- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec changes
- Session cookie is httpOnly; credentials: true must be set on fetch calls for session to work cross-origin

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
