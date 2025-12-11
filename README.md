# Serverless Market Heatmap

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-8a2be2?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Serverless-232f3e?logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/serverless/)
[![Status](https://img.shields.io/badge/status-alpha-blue)](#)

Real-time financial dashboard that visualizes the Golden Cross trading strategy across the S&P 100. Data is produced by an event-driven AWS serverless pipeline and consumed by a React/Vite frontend.

![Dashboard preview]()

## Overview

- Fan-out serverless ETL calculates SMA50 vs SMA200, RSI, volume, and strategy return for 100+ tickers.
- Aggregated snapshots are written to S3 as a static JSON feed to minimize frontend latency and cost.
- Frontend renders a heatmap, treemap, sentiment gauge, watchlist, and time-travel playback of historical signals.

## Key Features

- Cloud pipeline
  - EventBridge triggers an orchestrator Lambda hourly.
  - Orchestrator fan-outs 100 ticker jobs to SQS; Lambda workers fetch Yahoo Finance (v7/v8) and Wikipedia metadata.
  - Aggregator Lambda compiles DynamoDB results into a single `market-data-historical.json` on S3.
- Market analytics
  - Golden/Death Cross detection with strategy return since signal.
  - SMA50 vs SMA200, RSI(14), volume, and 52-week context.
  - Sentiment gauge summarizing bullish vs bearish distribution.
- Frontend experience
  - Interactive heatmap and market-cap treemap.
  - Watchlist with local persistence.
  - Historical playback via time-travel slider; snapshot label displayed throughout the UI.
  - Stock detail modal with mini trend chart.

## Architecture (ETL → UX)

1) Trigger: EventBridge schedules orchestrator Lambda.  
2) Fan-out: 100 ticker messages queued in SQS; Lambda workers execute in parallel.  
3) Extract/Transform: Workers call Yahoo (price + fundamentals) and Wikipedia (bios); Pandas computes indicators.  
4) Load: Worker writes results to DynamoDB.  
5) Aggregate: Aggregator Lambda scans DynamoDB and emits `market-data-historical.json` to S3.  
6) Visualize: React app fetches the S3 JSON feed and renders treemap, grid, and sentiment views.

## Tech Stack

- Frontend: React 19, Vite 6, TypeScript, Tailwind CSS, Recharts, Lucide icons.
- Data feed: Static JSON on Amazon S3 (`market-data-historical.json`).
- Cloud (upstream): AWS Lambda, SQS, DynamoDB, EventBridge, S3. Python with Pandas/Numpy/Requests/Boto3 for ETL.

## Getting Started

Prerequisites: Node.js (LTS recommended).

```bash
cd /Users/mc/Desktop/MarketMatrix
npm install
npm run dev
```

Then open http://localhost:5173.

## Configuration

- Data source: The UI currently reads from `https://signalgrid-ui-2025.s3.eu-north-1.amazonaws.com/market-data-historical.json`.  
  To point at your own feed, update `DATA_URL` in `src/services/marketData.ts`.
- Styling and layout: Tailwind classes live alongside components; adjust in `src/components` as needed.

## Project Structure

- `src/App.tsx` — view orchestration, sentiment stats, view toggles.  
- `src/services/marketData.ts` — fetch and normalize historical + live snapshots.  
- `src/components/*` — UI primitives (header, treemap, cards, modal, time-travel footer).  
- `src/hooks/*` — market data state, filters, and watchlist persistence.  
- `src/utils/analytics.ts` — sentiment calculation.

## Scripts

- `npm run dev` — start Vite dev server.  
- `npm run build` — production build.  
- `npm run preview` — preview the production build locally.

## Contributing Workflow (suggested)

- Branch per feature: `feature/time-travel`, `feature/treemap`, `chore/data-source`.  
- Keep commits small and scoped; prefer fast-forward merges to maintain a linear history.  
- Tag meaningful milestones (for example, `v0.1-ui`, `v0.2-time-travel`, `v0.3-treemap`).
