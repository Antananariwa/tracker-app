# Tools

> The external services and libraries this project uses, and what each is for.
> Keys and the security model live in ARCHITECTURE.md; this file is just what each tool is.

---

## Frontend

| Tool | What it is | Used for |
|------|------------|----------|
| React + Vite | UI library and build tool | The whole frontend app |
| TypeScript | Typed JavaScript | All frontend and backend source |
| Recharts | React charting library | Price and net worth charts |

## Backend

| Tool | What it is | Used for |
|------|------------|----------|
| Node.js | JavaScript runtime | Runs the backend |
| Express | Web framework for Node | The proxy server and its API routes |

## Data APIs

| Tool | What it is | Used for |
|------|------------|----------|
| AlphaVantage | Stock market data API | Stock prices, history, and the symbol catalog. Restrictive free tier, so responses are cached aggressively and demo data is pre-seeded. |
| CoinGecko | Crypto data API | Coin prices, history, metadata, and catalog. Generous free tier. Coins are identified by id ("bitcoin"), not ticker. |

## Database and auth

| Tool | What it is | Used for |
|------|------------|----------|
| Supabase | Hosted Postgres with built-in auth, an auto-generated REST/SDK layer, and Edge Functions | All app data, user login, and the daily snapshot function (Phase 3) |
| @supabase/supabase-js | Supabase client library | Querying the database from the frontend (anon key) and backend (service_role key) |

## Hosting (Phase 5, planned)

| Tool | What it is | Used for |
|------|------------|----------|
| Render | Cloud host for backend services | Running the Express proxy in production |
| Vercel | Frontend host for React/Vite apps | Running the frontend in production |
| Cloudflare | Sits in front of the app; all traffic passes through it first | DNS-level DDoS protection, optional custom domain |

## Backend npm packages

`express` (routing), `dotenv` (loads `.env`), `cors` (allows the frontend origin to call the backend), `express-rate-limit` (caps requests per IP), `@supabase/supabase-js` (database client), `csv-parse` (parses AlphaVantage's CSV catalog).

## Environment files

`.env` holds real keys and is never committed. `.env.example` holds placeholder keys and is committed, so anyone cloning knows what's required. The frontend (Vite) only exposes variables prefixed `VITE_`, read via `import.meta.env`. The backend (Node) loads every variable through dotenv, read via `process.env`.
