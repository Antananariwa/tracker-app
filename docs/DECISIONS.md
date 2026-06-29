# Decisions & Lessons

> Permanent log of architectural choices, trade-offs, and lessons learned.
> Add new entries at the bottom.
 
---
 
## No axios
**Phase 0** — Supply chain compromise discovered March 2026. Node v22 has native `fetch()` built in — same functionality, zero dependency risk.
 
---
 
## React at repo root
**Phase 0** — No `/frontend` subfolder. Simpler for a single-developer project. Vite expects to run from the project root and this avoids an extra layer of nesting with no benefit at this scale.
 
---
 
## NOT NULL enforced via SQL Editor
**Phase 0** — The Supabase Table Editor UI silently ignores NOT NULL on columns without default values. Always set NOT NULL constraints through the SQL Editor and verify with an information_schema query afterward.
 
---
 
## `acquired_at` added to assets
**Phase 0** — Original schema only had `created_at`, which records when the database row was created, not when the asset was actually purchased. These are different things. Added `acquired_at` as a separate date column for tracking real purchase dates.
 
---
 
## Normalisation deferred
**Phase 0** — Asset properties (symbol, name, category) are repeated per user row rather than extracted into a shared lookup table. Acceptable at demo scale. If the app ever goes multi-user at scale, extract to a lookup table and reference by ID.
 
---
 
## `price_cache.fetched_at` nullable
**Phase 0** — An API call might succeed and return a response, but price extraction could still fail. The raw response is still worth caching even without a confirmed price. Keeping `fetched_at` nullable allows this.
 
---
 
## Separate `.env` per folder
**Phase 0** — Frontend `.env` at repo root holds only `VITE_` prefixed variables (anon key, API URL). Backend `/backend/.env` holds all secrets (service_role key, AlphaVantage key). Neither file is committed. The separation makes it structurally harder to accidentally expose a secret through Vite's build.
 
---
 
## Step guides as dedicated files
**Phase 0** — Each step gets its own standalone walkthrough file rather than embedding instructions in the roadmap. Keeps the roadmap readable as a high-level overview while allowing guides to be as detailed as needed without cluttering the master document.
 
---
 
## service_role key for backend database writes
**Phase 1** — The Express backend uses Supabase's `service_role` key to write to `price_cache` and `net_worth_snapshots`, bypassing RLS entirely.
 
Supabase offers no mid-tier scoped key. The only options are the anon key (restricted by RLS, read-only for these tables) or the service_role key (unrestricted). A proper least-privilege solution — separate write endpoints with scoped permissions, as you would build with AWS IAM and DynamoDB — is not possible within Supabase's current permission model.
 
This is operational security (keep the key secret) rather than architectural security (make the wrong operations structurally impossible). The entire database is exposed if the key is compromised. Acceptable at this scale because the key never leaves the server environment. At production scale, Supabase Edge Functions are the better approach — they run inside Supabase's infrastructure with implicit service_role access, so the key never needs to exist on an external server.
 
---
 
## CommonJS in backend, ES Modules in frontend
**Phase 1** — The backend uses `require()` / `module.exports` (CommonJS). The frontend uses `import` / `export` (ES Modules). This is intentional and not a conflict. `npm init -y` generates a CommonJS project by default, and CommonJS remains the standard for Express backends. Switching to ES Modules in Node requires adding `"type": "module"` to `package.json`, which changes how dotenv and several other tools are configured and introduces unnecessary complexity. The two projects have separate `package.json` files and separate module systems — each uses what is appropriate for its environment.
 
---
 
## Backend returns raw_data in response, frontend does not read Supabase directly
**Phase 1** — The stocks route returns the full AlphaVantage response body inside
raw_data alongside the summary fields. The frontend receives everything it needs
in one HTTP call. The alternative — frontend reads price_cache.raw_data from
Supabase directly after the backend populates it — would require async
coordination between the two and give the frontend two data sources. Unified
flow: all stock data comes from the backend, always.
 
---
 
## usePortfolio queries all assets, RLS handles user filtering
**Phase 1** — The hook runs `select('*')` with no WHERE clause. This is intentional —
RLS rewrites the query server-side to filter by `auth.uid()` before any data leaves
the database. Another user's rows are never returned, not filtered client-side.
The anon key is visible in the browser but cannot bypass RLS. Acceptable for this
project. At production scale, rate limiting at the Supabase level would be an
additional layer worth adding.
 
---
 
 
## Portfolio data fetches on mount, not on user input
**Phase 1** — Unlike useBackendStock which waits for a symbol selection, usePortfolio
fetches immediately when the component mounts. Loading starts as true, dependency
array is empty. The hook runs once and the data either comes back or it doesn't —
no user trigger needed.
 
---
 
## Login handler lives in TopBar, not a separate file
**Phase 1** — `handleDemoLogin` is defined inside `TopBar` rather than extracted
to a standalone file. It calls `useMainPage()`, which is a React hook. Hooks can
only be called inside React components or other hooks — a plain async function in
its own file is neither. Attempting to extract it causes `Invalid hook call`.
Keep component-specific handlers inside the component that owns them.
 
---
 
## Demo credentials hardcoded, not in environment variables
**Phase 1** — The demo account email and password are hardcoded directly in the
handler rather than stored in `.env`. This is intentional — the demo account is
meant to be public. Putting public credentials in `.env` adds complexity with no
security benefit. Real user credentials never appear in code.
 
---
 
## Supabase session persists automatically across page refreshes
**Phase 1** — After `signInWithPassword` succeeds, Supabase stores the JWT in
browser local storage automatically. No session management code is needed anywhere
in the app. Every subsequent Supabase query through the same client instance carries
the token. `usePortfolio` requires no auth logic of its own — RLS reads the token
and filters results to the logged-in user transparently.
 
---
 
## Postgres jsonb does not preserve key order
**Phase 1** — AlphaVantage returns time series newest-first. Stored in `jsonb`, keys come back reordered — Postgres sorts by length then byte value for storage efficiency. `extractChartPriceByDateWeekly` and `extractLatestPrice` previously relied on source order, producing correct behaviour on cache miss and incorrect behaviour on cache hit. The broader rule, not `jsonb`-specific: JSON object key order is not guaranteed across any serialisation boundary. Treat every object from an external source as an unordered set of key-value pairs. Sort explicitly at the point order becomes meaningful. Never rely on `Object.keys()`, `Object.entries()`, or indexed access like `[0]` to mean position without first imposing order yourself. Applies to every extract function in the codebase.
 
---
 
## State-driven UI, not DOM-driven
**Phase 1** — Timeframe button active state uses React state (`selectedTimeFrame`) as the source of truth, not the CSS `:focus` pseudo-class. `:focus` tracks which DOM element last received input, not which value the app has selected — clicking elsewhere or tabbing away silently breaks the visual. State-driven conditional classes re-evaluate on every render and stay consistent with the actual app state regardless of DOM focus events.
 
---
 
## Verification and cleanup as separate branches
**Phase 1** — Step 1.5 was split into two branches. First branch verified end-to-end behaviour and fixed bugs found during verification. Second branch deleted dead code with no logic changes. Keeps git history readable: one commit of "Phase 1 verified and fixed", one commit of "Phase 1 dead code removed". Either can be reverted independently without entangling fix work with deletion work. Phase boundaries are the right moment to clean up — leaving legacy paths until the next asset class makes the pattern of "keep old code around" compound.
 
---
 
## Symbol catalog as separate table
**Phase 1** — `alphavantage_listings` is its own table, not a category in
`price_cache`. Different lifecycles: prices refresh row-at-a-time on 24h
schedules, catalog refreshes atomically every 30d. Mixing them forces one
pattern on both.
 
---
 
## RLS policies follow the access path
**Phase 1** — Backend-only tables get RLS enabled with no policies (service_role
bypasses anyway; default-deny blocks anon). Frontend-queried tables need
explicit policies scoped to the access pattern. `price_cache` SELECT policy
from Phase 0 is unused residue — Phase 1 chose backend-only access. Rule for
new tables: ask if anything in the frontend imports `supabase` and queries it
directly. If no, RLS on, no policies.
 
---
 
## Supabase max_rows is server-enforced
**Phase 1** — PostgREST caps SELECTs at 1000 by default. `.limit(N)` and
`.range()` above 1000 don't bypass it. Only the dashboard setting raises the
ceiling. Set to 15000 for the listings catalog. Not version-controlled — fresh
Supabase projects revert to 1000 default.
 
---
 
## Atomic refresh enables single-row freshness probe
**Phase 1** — All ~13k rows share one `fetched_at` timestamp from the same
upsert, so age of any row reveals age of the table. Probe uses
`.order('fetched_at', desc).limit(1)` rather than arbitrary first row —
conservative toward freshness if the invariant ever breaks. Pattern only
valid for atomic-refresh tables; row-at-a-time tables (`price_cache`) need
per-row checks.
 
---
 
## Hook parameter retained despite single backend route
**Phase 1** — `useSymbolCatalog(category)` takes a parameter even though only
`/stocks` exists today. Phase 2 (next phase, not speculative) adds `/crypto`
to same `symbols.js`. Rule: parameterise when generality is confirmed by
near-term plans.
 
---
 
## URL inconsistency `/api/stocks/:symbol` vs `/api/symbols/stocks`
**Phase 1** — Inverted noun ordering between the price route and the catalog
route. Awkward but not fixed now — rename touches backend, route file, and
frontend hook. Revisit in Phase 5 with crypto built; likely target is
resource-first (`/api/stocks/catalog`, `/api/stocks/:symbol`).
 
---
 
## CSV handling for AlphaVantage
**Phase 1** — LISTING_STATUS returns CSV, the only AV endpoint that does.
`fetch().text()` not `.json()`. Parse with `csv-parse/sync` and `columns: true`
— hand-parsing breaks on quoted commas. Missing dates come as literal string
`"null"`, must be coerced to real `null` before Postgres accepts them in
`date` columns.
 
 
---
 
## Prop drilling on chart data identified during TS migration
**Phase 1 / TS migration** — chartData flows StockMainPage → PrimaryGraph → DemoGraph
through pass-through props. Each layer just forwards. Tracing the type during TS
conversion required walking up three components. Worth lifting to context or a
hook in a later pass. Not addressing during migration to avoid mixing refactors.
 
---
 
## LeftMenuBox uses mapping pattern over hardcoded buttons
**Phase 1 / TS migration** — LeftMenuBox accepts `optionName: string[]` and
`onOptionClick: (option: string) => void`, mapping each string to a button.
Pattern justified for dynamic options from data sources, overkill for the 3-4
hardcoded labels per menu in current usage. Simplification path: drop both
props, accept children, each parent button writes its own onClick. Defer until
TS migration closes.
 
---
 
## import 'dotenv/config' as side-effect import
**Phase 1 / TS migration** — Replaces the two-line `import dotenv from
'dotenv'` + `dotenv.config()` pair. Side-effect import placed as the first
line guarantees `.config()` fires before any subsequent module loads and
reads `process.env`, regardless of hoisting rules under different module
systems. Idiomatic, single line, no ordering question. Generalises: when a
library setup call must run before other modules load, prefer the
library's side-effect entry point over the import-then-call pair.
 
---
 
## moduleResolution bundler is the modern non-deprecated equivalent of node
**Phase 1 / TS migration** — `"moduleResolution": "node"` (renamed to
`"node10"`) is deprecated in TS 6.0, removed in TS 7.0. The two migration
targets are `"nodenext"` (strict, requires `.js` extensions on relative
imports of `.ts` files) and `"bundler"` (no friction, allowed alongside
`"module": "CommonJS"` per the TS 6.0 release notes). Backend uses
`bundler`. The frontend always worked because Vite's template uses bundler
resolution. A deprecation warning points at a supported replacement; the
correct first move is to find it, not to silence it via
`ignoreDeprecations`.
 
---
 
## Custom router replaced with React Router
**Phase 1** Hand-rolled MainPageContext was a state-based page switcher. React Router does the same job (URL to component mapping) with browser integration (F5, back, forward, bookmarks) the custom version structurally could not have. URL replaces React memory as the source of truth. No mental shift for consumers: `setSelectedMainPage('x')` became `navigate('/x')`. One library replaces an entire custom subsystem.
 
---
 
## Auth state via React Context + Supabase event listener
**Phase 1** Cross-component access to "who is logged in" requires a React-aware mirror of the SDK's auth state. AuthContext holds session and loading via useState. A useEffect in the provider subscribes to `supabase.auth.onAuthStateChange` and updates state on every auth event. Components read via `useAuth()`. The SDK is the source of truth, the context is the React-friendly copy that triggers re-renders. Same pub-sub shape as event emitters elsewhere, but scoped to the SDK in the browser, no network involved for the events themselves.
 
---
