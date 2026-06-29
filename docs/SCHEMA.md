# Database Schema

 
---
 
## Table: `assets`
 
Stores all user-owned assets (stocks, crypto, real estate, custom). Single shared table across all asset classes, distinguished by `category`.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| user_id | uuid | none | NO | FK to auth.users |
| symbol | text | none | NO | e.g. "AAPL", "BTC" |
| name | text | none | NO | e.g. "Apple Inc." |
| category | text | none | NO | "stock", "crypto", "real_estate", "custom" |
| quantity | numeric | `0` | NO | Shares, coins, or units |
| avg_buy_price | numeric | `0` | NO | Cost basis per unit |
| status | text | `'hold'` | NO | "hold", "to_sell", "watching" |
| acquired_at | date | none | YES | Actual purchase date (distinct from created_at) |
| created_at | timestamptz | `now()` | YES | Row creation timestamp |
 
**RLS:** Enabled. Users can only SELECT, INSERT, UPDATE, DELETE their own rows (`user_id = auth.uid()`).
 
---
 
## Table: `stock_price_cache`
 
Shared cache of stock prices fetched from AlphaVantage. No user ownership, all authenticated users can read. Backend writes via service_role key.
 
| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| id | uuid | `gen_random_uuid()` | NO | Primary key |
| symbol | text | none | NO | UNIQUE, one cache row per ticker |
| price | numeric | none | NO | Latest known closing price |
| category | text | `''` | NO | Always "stock" since the split |
| fetched_at | timestamptz | `now()` | YES | When price was last fetched |
| raw_data | jsonb | `{}` | NO | Full AlphaVantage response as JSON |
 
**RLS:** Enabled. Authenticated users can SELECT only. Backend uses service_role key to write (bypasses RLS).
 
---
 
## Table: `stock_alphavantage_listings`
 
Symbol catalog for the stock search dropdown. Full AlphaVantage LISTING_STATUS dump, refreshed atomically on a 30-day TTL. Backend-only.
 
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
| fetched_at | timestamptz | `now()` | YES | Shared timestamp across all rows (atomic refresh) |
 
**RLS:** Enabled, no policies. Backend-only access via service_role key. Default-deny blocks the anon key.
 
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
 
