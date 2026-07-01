# Net Worth Tracker

A full-stack personal finance dashboard that tracks net worth across stocks, crypto, real estate, and custom assets in one place. Live market prices, a clean portfolio view, and secure per-user data.

<!-- Screenshot of the dashboard here -->
<!-- ![Dashboard overview](path/to/image) -->

## Live demo

- App: <!-- link once deployed -->
- Demo login: <!-- click demo account button -->

## Features

- Track holdings across multiple asset classes: stocks, crypto, real estate, and custom entries.
- Live prices pulled from market data providers. Cached, so loads are fast and API use stays low.
- Per-asset detail with historical price charts.
- Secure accounts: each user sees only their own portfolio, enforced at the database layer.
- Responsive layout that works on desktop and mobile.

<!-- Portfolio list, asset detail, add-asset form. -->
| Portfolio | Asset detail | Add asset |
| --- | --- | --- |
| <!-- ![Portfolio](path/to/image) --> | <!-- ![Detail](path/to/image) --> | <!-- ![Add](path/to/image) --> |

## Tech stack

**Frontend**
- React with TypeScript
- Vite
- React Router
- Recharts for price charts
- Supabase JS client (auth and data)

**Backend**
- Node with Express
- TypeScript, run with tsx

**Data and infrastructure**
- Supabase (PostgreSQL, Auth, Row Level Security)
- Market data from AlphaVantage (stocks) and CoinGecko (crypto)

## Architecture

One pattern repeats for every asset class: **proxy, cache, display.**

- The browser holds only the public Supabase key and never calls a market API directly.
- A small Express server holds the secret keys. It fetches prices and caches each response with a freshness window. A cache hit skips the external call, so the app stays fast.
- Portfolio data is read straight from Supabase. Row-level security filters rows on the server, so a query with no user filter still returns only the logged-in user's data.
- Authentication is a Supabase session: the token lives in the browser and the database checks it on every query.

<!-- embed or link a simple architecture diagram -->
For the full design, schema, and decision log, see the [docs](docs/) folder.

## Getting started

This is two separate Node projects: the frontend at the repository root and the backend in `backend/`. Each has its own dependencies and its own `.env`.

### Prerequisites

- Node.js 18 or newer
- A Supabase project (free tier is enough)
- API keys for AlphaVantage and CoinGecko

### 1. Frontend

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

Runs on http://localhost:5173

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

Runs on http://localhost:3001

The frontend `.env` holds only the public Supabase URL and key. All secret keys stay in the backend `.env` and never reach the browser.

## Project status

Active work in progress, built in phases. Current focus and completed milestones are tracked in the project docs.
