# Architecture
 
## System diagram
 
```
┌─────────────────────────────────────────────┐
│  BROWSER — React + Vite (Vercel)            │
│    ├── Supabase SDK (anon key) ──────┐      │
│    └── fetch() to proxy ──────┐      │      │
└───────────────────────────────┼──────┼──────┘
                                │      │
                                ▼      ▼
┌──────────────────────┐   ┌──────────────────┐
│  EXPRESS PROXY       │   │  SUPABASE        │
│  (Render)            │──▶│  Postgres DB     │
│  Holds all secret    │   │  (see SCHEMA.md) │
│  API keys            │   │  Auth            │
│                      │   │  Edge Functions  │
└──────────┬───────────┘   └──────────────────┘
           │
           ▼
┌──────────────────────┐
│  EXTERNAL APIs       │
│    AlphaVantage      │
│    CoinGecko         │
│    Plaid (planned)   │
└──────────────────────┘
```
 
The proxy holds every secret key. The browser never calls an external API directly and never holds anything but the Supabase anon key. Table list intentionally omitted here to avoid duplicating `SCHEMA.md`.
 
---
 
## Current proxy routes
 
```
GET  /api/stocks/:symbol         stock price + history
GET  /api/symbols/stocks         stock symbol catalog
GET  /api/crypto/:coin_id        crypto price + history
GET  /api/crypto/:coin_id/info   crypto metadata
GET  /api/symbols/crypto         crypto symbol catalog
GET  /health                     liveness check
```
 
Plaid routes are planned for Phase 6. Route path naming may be reorganised later (see the URL-inconsistency entry in `DECISIONS.md`).
 
---
 
## Security model
 
| Key | Lives in | Scope |
|-----|----------|-------|
| Supabase anon key | Frontend `.env` | Public — RLS restricts access |
| Supabase service_role key | Backend `.env` | Bypasses all RLS — never in frontend |
| AlphaVantage / CoinGecko keys | Backend `.env` | Backend proxy only |
| Plaid secrets | Backend `.env` | Backend proxy only |
 
The proxy exists so that secret keys live only on the server. RLS protects the database for the one key that does reach the browser (anon), restricting it to the rows the logged-in user owns.
