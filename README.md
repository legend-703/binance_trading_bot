# Binance Trading Bot (TypeScript + Express + MongoDB)

Simple demo trading bot for interview/live-coding practice.
It polls Binance public API for ticker price and simulates buys/sells
based on percent drop/rise thresholds, storing simulated trades in MongoDB.

## Features
- Polls Binance public ticker
- Simulates buy/sell orders with a configurable strategy
- Stores trades in MongoDB via Mongoose
- Express API to start/stop bot, list trades, and show basic PnL
- Uses TypeScript

## Setup

1. Clone repo
2. `cp .env.example .env` and edit values (MONGODB_URI required)
3. `npm install`
4. Development: `npm run dev` (uses ts-node-dev)
5. Visit `http://localhost:4000` and API docs:
   - `POST /api/bot/start` — start bot
   - `POST /api/bot/stop` — stop bot
   - `GET /api/bot/status` — status
   - `GET /api/trades/recent?limit=50` — recent stored trades
   - `GET /api/stats` — basic PnL simulation

## Environment
See `.env.example`. For production or real trading, provide BINANCE_API_KEY & BINANCE_API_SECRET
and implement signed order placement logic carefully (not included).

## Demo flow for live coding interview
- Start server: `npm run dev`
- Start bot (POST /api/bot/start) and show logs as the bot polls and writes simulated trades
- Show `GET /api/trades/recent` with the stored simulated buy/sell entries
- Show `GET /api/stats` (PnL) to analyze strategy performance
- Walk through code: decision making in `bot/tradingBot.ts`, persistence in `models/Trade.ts`
- Discuss: limitations, how you'd add real order placement, rate-limiting, websockets, error handling, backtesting

## Notes
- This demo **does not** place real orders. It's safe for interview/coding test.
- For production trading, you must implement signed endpoints, order tracking, reconciliation, risk controls,
  proper error retries, idempotency keys, and regulatory/financial checks.
