# Database Schema
 
Table shapes. Cache freshness (TTL) is controlled in backend route code, not here, because it is tuned often during development. This file describes structure, which is stable.
 
---
 
## Table: `assets`
 
Stores all user-owned assets (stocks, crypto, real estate, custom). Single shared table across all asset classes, distinguished by `category`. Shared so total net worth can be a single query.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| user_id | uuid | none | NO | FK to auth.users |
| symbol | text | none | NO | e.g. "AAPL", "BTC" |
| name | text | none | NO | e.g. "Apple Inc." |
| category | text | none | NO | Allowed values enforced by CHECK (see below) |
| quantity | numeric | `0` | NO | Shares, coins, or units |
| avg_buy_price | numeric | `0` | NO | Cost basis per unit |
| status | text | `'hold'` | NO | Allowed values enforced by CHECK (see below) |
| acquired_at | date | none | YES | Actual purchase date (distinct from created_at) |
| created_at | timestamptz | `now()` | YES | Row creation timestamp |
 
**Constraints:** CHECK on `category` (`'stock'`, `'crypto'`, `'real_estate'`; `'custom'` planned for Phase 4) and CHECK on `status` (`'hold'`, `'to_sell'`, `'watching'`). These mirror the TypeScript unions in the frontend types.
 
**RLS:** Enabled. Users can only SELECT, INSERT, UPDATE, DELETE their own rows (`user_id = auth.uid()`).
 
---
 
## Table: `stock_price_cache`
 
Shared cache of stock prices fetched from AlphaVantage. No user ownership. Backend writes via service_role key.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| symbol | text | none | NO | UNIQUE, one cache row per ticker |
| price | numeric | none | NO | Latest known closing price |
| category | text | `''` | NO | Always "stock" since the per-class split |
| fetched_at | timestamptz | `now()` | YES | When this row was last fetched (per-row freshness) |
| raw_data | jsonb | `{}` | NO | Full AlphaVantage response as JSON |
 
**RLS:** Enabled. Authenticated users can SELECT only. Backend uses service_role key to write (bypasses RLS).
 
---
 
## Table: `stock_alphavantage_listings`
 
Symbol catalog for the stock search dropdown. Full AlphaVantage LISTING_STATUS dump. Backend-only.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| symbol | text | none | NO | UNIQUE, ticker |
| name | text | none | NO | Company / security name |
| exchange | text | none | YES | e.g. NYSE, NASDAQ |
| asset_type | text | none | YES | e.g. Stock, ETF |
| ipo_date | date | none | YES | |
| delisting_date | date | none | YES | Null if still listed |
| status | text | none | YES | "Active" or "Delisted" |
| fetched_at | timestamptz | `now()` | YES | Shared across all rows (atomic refresh) |
 
**Refresh model:** Atomic. Every row is rewritten in one upsert and shares one `fetched_at`, so the age of any row is the age of the whole table.
 
**RLS:** Enabled, no policies. Backend-only access via service_role key. Default-deny blocks the anon key.
 
---
 
## Table: `crypto_price_cache`
 
Shared cache of crypto prices and chart history fetched from CoinGecko. No user ownership. Backend writes via service_role key.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| coin_id | text | none | NO | UNIQUE, CoinGecko coin id ("bitcoin") |
| price | numeric | none | NO | Latest known price |
| fetched_at | timestamptz | `now()` | YES | When this row was last fetched (per-row freshness) |
| raw_data | jsonb | `{}` | NO | Full CoinGecko market_chart response as JSON |
 
**RLS:** Enabled, no policies. Backend-only access via service_role key.
 
---
 
## Table: `crypto_coingecko_listings`
 
Coin catalog for the crypto search dropdown. Full CoinGecko `/coins/list` dump. Backend-only.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| coin_id | text | none | NO | UNIQUE, CoinGecko coin id ("bitcoin") |
| symbol | text | none | NO | Ticker ("btc") |
| name | text | none | NO | Coin name ("Bitcoin") |
| fetched_at | timestamptz | `now()` | YES | Shared across all rows (atomic refresh) |
 
**Refresh model:** Atomic, same as `stock_alphavantage_listings`. One upsert rewrites every row with a shared `fetched_at`.
 
**RLS:** Enabled, no policies. Backend-only access via service_role key.
 
---
 
## Table: `crypto_info_cache`
 
Per-coin metadata fetched from CoinGecko `/coins/{id}` (description, market data, links, supply, genesis date). Backend-only. Long freshness window because this data is near-static.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| coin_id | text | none | NO | UNIQUE, CoinGecko coin id ("bitcoin") |
| raw_data | jsonb | `{}` | NO | Full CoinGecko `/coins/{id}` response (subset of fields) |
| fetched_at | timestamptz | `now()` | YES | When this row was last fetched (per-row freshness) |
 
**Note:** The stored blob mixes near-static fields (genesis date, description) with semi-live ones (market cap, volume). The semi-live fields are accepted as stale within the cache window.
 
**RLS:** Enabled, no policies. Backend-only access via service_role key.
 
---
 
## Table: `net_worth_snapshots`
 
Daily snapshots of a user's total portfolio value. Written by backend/Edge Function, read by frontend.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| user_id | uuid | none | NO | FK to auth.users |
| total_value | numeric | none | NO | Total net worth at snapshot time |
| snapshot_data | jsonb | `{}` | NO | Full portfolio breakdown as JSON |
| snapshot_date | date | none | NO | One entry per user per day |
| created_at | timestamptz | `now()` | YES | Row creation timestamp |
 
**Constraints:** UNIQUE on (`user_id`, `snapshot_date`), prevents duplicate daily snapshots.
 
**RLS:** Enabled. Users can only SELECT their own rows. Backend writes via service_role key.
