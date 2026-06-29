## System Architecture

```
┌─────────────────────────────────────────────────────┐
│  BROWSER                                            │
│  React + Vite (Vercel)                              │
│  ├── Supabase SDK (anon key) ──────┐                │
│  └── fetch() to proxy ─────┐      │                 │
└─────────────────────────────┼──────┼────────────────┘
                              │      │
                              ▼      ▼
┌───────────────────────┐  ┌──────────────────────────┐
│  EXPRESS PROXY        │  │  SUPABASE                │
│  (Render)             │  │  ├── Postgres DB         │
│  ├── /api/stocks/:s   │  │  │   ├── assets          │
│  ├── /api/crypto/:c   │──│  │   ├── price_cache     │
│  ├── /api/plaid/*     │  │  │   └── net_worth_snap  │
│  │                    │  │  ├── Auth                │
│  │  Holds all secret  │  │  └── Edge Functions      │
│  │  API keys          │  │      (daily snapshots)   │
│  └────────────────────┘  └──────────────────────────┘
          │
          ▼
┌──────────────────────┐
│  EXTERNAL APIs       │
│  ├── AlphaVantage    │
│  ├── CoinGecko       │
│  └── Plaid (sandbox) │
└──────────────────────┘
```


### Security Model


| Key | Lives in | Scope |

|-----|----------|-------|

| Supabase anon key | Frontend `.env` | Public — RLS restricts access |

| Supabase service_role key | Backend `.env` | Bypasses all RLS — never in frontend |

| AlphaVantage / CoinGecko keys | Backend `.env` | Backend proxy only |

| Plaid secrets | Backend `.env` | Backend proxy only |

