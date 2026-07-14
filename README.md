# Walmart Retail Analytics — Ledger

A standalone, no-backend interactive analytics dashboard. SQL analysis phase, static JSON export, React + Chart.js frontend. No server, no live database — all filtering happens client-side against pre-aggregated data.

**Live demo:** _add your deployed link here_
**Dataset:** [Walmart Sales Dataset](https://github.com/saiganesh4995/walmart_sales) — 9,969 transactions, 100 branches, 98 US cities, 2019–2023.

## Problem statement

Retail analysts need to answer three questions fast: where is revenue coming from, which locations and channels perform best, and where is the business plateauing. This dashboard answers all three from a single ~10K-row transactional dataset, with the analysis fully reproducible from raw CSV to insight.

## Approach

1. **SQL analysis** (`sql/analysis_queries.sql`) — 8 queries against a SQLite-loaded copy of the dataset: monthly revenue trend, category/branch/payment breakdowns, year-over-year growth, weekday seasonality, and a KPI summary.
2. **Export** — each query result exported as a clean JSON file under `frontend/public/data/`, plus a full `transactions.json` so the frontend can re-derive every aggregate live when filters are applied.
3. **Frontend** — Vite + React + Chart.js, dark-academia "ledger" visual theme. KPI row, revenue trend line chart, category bar chart, payment donut chart, top-10 branches table, date/category filter bar, and a key-insights section.

## Key findings

See `insights.md` for the full write-up. Headlines: two categories (Fashion Accessories, Home & Lifestyle) drive ~81% of revenue; those same categories rate lower on customer satisfaction than low-volume categories; revenue has been roughly flat since 2020; the top 10 of 100 branches capture a disproportionate share of sales.

## Tech stack

SQL (SQLite) · Python/pandas (export pipeline) · React 19 · Vite · Chart.js / react-chartjs-2

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deploy

This is a static site. It deploys to GitHub Pages automatically on every push to `main` via `.github/workflows/deploy.yml`, which builds `frontend` with Vite and publishes `frontend/dist`.

One-time setup: in the repo, go to **Settings > Pages > Build and deployment** and set **Source** to **GitHub Actions**. After that, pushing to `main` builds and publishes the site with no manual steps.

To deploy elsewhere (Vercel, Netlify), just point the build command at `frontend` (`npm install && npm run build`, output directory `frontend/dist`). No environment variables or backend services required.

To preview locally after building:

```bash
cd frontend
npm run build
npm run preview
```
