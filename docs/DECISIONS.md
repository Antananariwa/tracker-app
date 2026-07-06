# Decisions & Lessons

> Permanent log of architectural choices, trade-offs, and lessons learned.
> Grouped by the phase the decision was made in. Add new entries under the relevant phase, newest at the bottom.

---

## Phase 0 — Setup

### No axios
Supply chain compromise discovered March 2026. Node v22 has native `fetch()` built in — same functionality, zero dependency risk.

### React at repo root
No `/frontend` subfolder. Simpler for a single-developer project. Vite expects to run from the project root, and this avoids an extra layer of nesting with no benefit at this scale.

### NOT NULL enforced via SQL Editor
The Supabase Table Editor UI silently ignores NOT NULL on columns without default values. Always set NOT NULL constraints through the SQL Editor and verify with an information_schema query afterward.

### `acquired_at` added to assets
The original schema only had `created_at`, which records when the database row was created, not when the asset was actually purchased. These are different things. Added `acquired_at` as a separate date column for tracking real purchase dates.

### Normalisation deferred
Asset properties (symbol, name, category) are repeated per user row rather than extracted into a shared lookup table. Acceptable at demo scale. If the app ever goes multi-user at scale, extract to a lookup table and reference by ID.

### `price_cache.fetched_at` nullable
An API call might succeed and return a response, but price extraction could still fail. The raw response is still worth caching even without a confirmed price. Keeping `fetched_at` nullable allows this.

### Separate `.env` per folder
Frontend `.env` at repo root holds only `VITE_`-prefixed variables (anon key, API URL). Backend `/backend/.env` holds all secrets (service_role key, external API keys). Neither file is committed. The separation makes it structurally harder to accidentally expose a secret through Vite's build.

---

## Phase 1 — Stocks

### service_role key for backend database writes
The Express backend uses Supabase's `service_role` key to write to `price_cache` and `net_worth_snapshots`, bypassing RLS entirely. Supabase offers no mid-tier scoped key — only the anon key (RLS-restricted, read-only for these tables) or service_role (unrestricted). A proper least-privilege solution (scoped write endpoints, as with AWS IAM + DynamoDB) is not possible within Supabase's current permission model. This is operational security (keep the key secret) rather than architectural security (make the wrong operations structurally impossible): the whole database is exposed if the key leaks. Acceptable at this scale because the key never leaves the server. At production scale, Supabase Edge Functions are the better approach — they run inside Supabase's infrastructure with implicit service_role access, so the key never needs to exist on an external server.

### CommonJS in backend, ES Modules in frontend
The backend uses `require()` / `module.exports`; the frontend uses `import` / `export`. Intentional, not a conflict. `npm init -y` generates a CommonJS project by default, and CommonJS remains the standard for Express backends. Switching Node to ES Modules requires `"type": "module"`, which changes how dotenv and other tools are configured for no benefit here. Separate `package.json` files, separate module systems, each appropriate to its environment.

### Backend returns raw_data in response; frontend does not read Supabase directly
The stocks route returns the full external response inside `raw_data` alongside the summary fields, so the frontend gets everything in one HTTP call. The alternative — frontend reads `price_cache.raw_data` from Supabase directly after the backend populates it — would require async coordination and give the frontend two data sources. Unified flow: all priced-asset data comes from the backend, always.

### usePortfolio queries all assets; RLS handles user filtering
The hook runs `select('*')` with no WHERE clause. Intentional — RLS rewrites the query server-side to filter by `auth.uid()` before any data leaves the database. Another user's rows are never returned, not filtered client-side. The anon key is visible in the browser but cannot bypass RLS. At production scale, Supabase-level rate limiting would be a worthwhile additional layer.

### Portfolio data fetches on mount, not on user input
Unlike `useBackendStock`, which waits for a symbol selection, `usePortfolio` fetches immediately when the component mounts. Loading starts `true`, dependency array is empty; the hook runs once and the data either comes back or it doesn't — no user trigger needed. (Note: the session dependency was later added so the table re-fetches on login and clears on logout — see the AuthContext entry.)

### Component-specific handlers stay in the component
`handleDemoLogin` is defined inside `TopBar` rather than extracted to its own file, because it calls a React hook. Hooks can only run inside components or other hooks; a plain async function in its own file is neither, so extracting it throws `Invalid hook call`. Keep handlers that depend on hooks inside the component that owns them. (Originally this called the custom `useMainPage`; after the React Router migration it uses `useNavigate`. The rule is unchanged — the example just moved.)

### Demo credentials hardcoded, not in environment variables
The demo account email and password are hardcoded in the handler rather than stored in `.env`. Intentional — the demo account is meant to be public. Putting public credentials in `.env` adds complexity with no security benefit. Real user credentials never appear in code.

### Supabase session persists automatically across page refreshes
After `signInWithPassword` succeeds, Supabase stores the JWT in browser local storage automatically. No session-management code is needed; every subsequent query through the same client carries the token, and RLS reads it to filter results to the logged-in user transparently.

### Postgres jsonb does not preserve object key order
AlphaVantage returns its time series newest-first. Stored in `jsonb`, the keys come back reordered — Postgres sorts by length then byte value for storage efficiency. Extract functions that relied on source order worked on cache miss and broke on cache hit. The broader rule, not jsonb-specific: JSON object key order is not guaranteed across any serialisation boundary. Treat every object from an external source as an unordered set of key-value pairs and sort explicitly at the point order becomes meaningful. Never rely on `Object.keys()`, `Object.entries()`, or `[0]` to mean position without first imposing order yourself. Applies to every extract function.

### State-driven UI, not DOM-driven
Timeframe button active state uses React state (`selectedTimeFrame`) as the source of truth, not the CSS `:focus` pseudo-class. `:focus` tracks which DOM element last received input, not which value the app has selected — clicking elsewhere or tabbing away silently breaks the visual. State-driven conditional classes re-evaluate on every render and stay consistent with the actual app state.

### Verification and cleanup as separate branches
End-to-end verification and dead-code deletion were split into two branches: one "verified and fixed", one "dead code removed" with no logic changes. Keeps git history readable and lets either be reverted independently without entangling fix work with deletion work. Phase boundaries are the right moment to clean up — leaving legacy paths until the next asset class makes "keep old code around" compound.

### Symbol catalog as a separate table
The stock listings table is its own table, not a category inside `price_cache`. Different lifecycles: prices refresh row-at-a-time on a short schedule; the catalog refreshes atomically on a long one. Mixing them forces one pattern on both.

### RLS policies follow the access path
Backend-only tables get RLS enabled with no policies (service_role bypasses anyway; default-deny blocks anon). Frontend-queried tables need explicit policies scoped to the access pattern. Rule for new tables: ask whether anything in the frontend imports `supabase` and queries the table directly. If no, RLS on, no policies.

### Supabase max_rows is server-enforced
PostgREST caps SELECTs at 1000 rows by default. `.limit(N)` and `.range()` above 1000 don't bypass it — only the dashboard setting raises the ceiling. Raised for the listings catalog. Not version-controlled: a fresh Supabase project reverts to the default, so this must be re-applied on any new project.

### Atomic refresh enables a single-row freshness probe
All rows in the listings catalog share one `fetched_at` from the same upsert, so the age of any row reveals the age of the table. The probe uses `.order('fetched_at', desc).limit(1)` rather than an arbitrary first row — conservative toward freshness if the invariant ever breaks. Valid only for atomic-refresh tables; row-at-a-time tables like `price_cache` need per-row checks.

### Parameterise only when generality is confirmed
`useSymbolCatalog(category)` took a parameter while only `/stocks` existed, because the next phase was already known to add `/crypto` to the same `symbols` route. Rule: parameterise when generality is confirmed by near-term plans, not on speculation. Phase 2 has since shipped `/crypto`, validating the call.

### URL inconsistency: `/api/stocks/:symbol` vs `/api/symbols/stocks`
Inverted noun ordering between the price route and the catalog route. Awkward but not fixed now — the rename touches backend, route file, and frontend hook. Revisit in Phase 5 with crypto built; likely target is resource-first (`/api/stocks/catalog`, `/api/stocks/:symbol`).

### CSV handling for AlphaVantage
The listings endpoint returns CSV — the only AV endpoint that does. Read with `fetch().text()`, not `.json()`. Parse with `csv-parse/sync` and `columns: true`; hand-parsing breaks on quoted commas. Missing dates arrive as the literal string `"null"` and must be coerced to real `null` before Postgres accepts them in `date` columns.

---

## Phase 1 — TypeScript migration

### LeftMenuBox uses a mapping pattern over hardcoded buttons
`LeftMenuBox` accepts `optionName: string[]` and `onOptionClick: (option: string) => void`, mapping each string to a button. Justified for dynamic options from a data source, overkill for the 3–4 hardcoded labels per menu in current usage. Simplification path: drop both props, accept children, each parent button owns its onClick. Deferred.

### `import 'dotenv/config'` as a side-effect import
Replaces the two-line `import dotenv` + `dotenv.config()` pair. Placed as the first line, the side-effect import guarantees `.config()` fires before any later module loads and reads `process.env`, regardless of hoisting rules. Generalises: when a library setup call must run before other modules load, prefer the library's side-effect entry point over import-then-call.

### moduleResolution "bundler" is the modern non-deprecated equivalent of "node"
`"moduleResolution": "node"` (renamed `"node10"`) is deprecated in TS 6.0, removed in TS 7.0. The two migration targets are `"nodenext"` (strict, requires `.js` extensions on relative imports) and `"bundler"` (no friction, allowed alongside `"module": "CommonJS"`). Backend uses `bundler`; the frontend already did via Vite's template. A deprecation warning points at a supported replacement — find it, don't silence it with `ignoreDeprecations`.

### Custom router replaced with React Router
The hand-rolled `MainPageContext` was a state-based page switcher. React Router does the same URL-to-component job with browser integration (F5, back, forward, bookmarks) the custom version structurally could not have. The URL replaces React memory as the source of truth, with no mental shift for consumers: `setSelectedMainPage('x')` became `navigate('/x')`. One library replaced an entire custom subsystem.

### Auth state via React Context + Supabase event listener
Cross-component access to "who is logged in" needs a React-aware mirror of the SDK's auth state. `AuthContext` holds `session` and `loading` via `useState`; a `useEffect` seeds initial state from `getSession()` and subscribes to `onAuthStateChange`, unsubscribing on unmount. Components read via `useAuth()`. The SDK is the source of truth; the context is the React-friendly copy that triggers re-renders.

---

## Phase 2 — Crypto

### Graph time-range slicing assumes fixed-interval data points
Slicing the chart to a selected range takes the last N points rather than parsing dates. This assumes each point is a fixed interval: one week per point for stocks (AlphaVantage weekly), one day per point for crypto (CoinGecko daily). Under that assumption a range is just a count — no date arithmetic. It holds only while each API returns evenly spaced points at the expected interval; if an API changes granularity, the point-to-time mapping breaks and the slicing needs revisiting. Worth monitoring.

### jsonb preserves array order but not object key order
Companion to the Phase 1 key-order entry. CoinGecko chart data is a JSON array of `[timestamp, price]` pairs, and jsonb preserves array element order, so cached crypto data comes back in order with no sorting. AlphaVantage data is a JSON object keyed by date, and jsonb does not preserve object key order, which is why that data must be sorted after retrieval. Array-shaped data is safe by structure; object-shaped data is not.

### Allowed values for category and status are defined in two places
The legal values for `assets.category` and `assets.status` live in two independent places that must stay in sync: a TypeScript union in the frontend types, and a CHECK constraint on the database column. The union controls what the application accepts; the constraint controls what the database accepts. Adding or removing a value means editing both. Current values: category is stock / crypto / real_estate (custom planned for Phase 4); status is hold / to_sell / watching. The long-term replacement is Supabase CLI generating types from the schema, making the schema the single source.

### Cache TTLs live in route code, not in the schema
Each cached data type has its own freshness window, set as a constant in the relevant backend route. They differ because the underlying data changes at different rates: catalogs and coin metadata change rarely, prices constantly. The value is kept in code on purpose — it is tuned often during development, while schema docs describe table shape, which is stable. SCHEMA.md therefore records no TTL number by design.
