import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/binance-bot";

export const BINANCE_API_KEY = process.env.BINANCE_API_KEY || "";
export const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET || "";

export const BOT_SYMBOL = process.env.BOT_SYMBOL || "BTCUSDT";
export const BOT_POLL_INTERVAL_MS = process.env.BOT_POLL_INTERVAL_MS ? Number(process.env.BOT_POLL_INTERVAL_MS) : 5000;
export const BOT_BUY_DROP_PERCENT = process.env.BOT_BUY_DROP_PERCENT ? Number(process.env.BOT_BUY_DROP_PERCENT) : 2;
export const BOT_SELL_RISE_PERCENT = process.env.BOT_SELL_RISE_PERCENT ? Number(process.env.BOT_SELL_RISE_PERCENT) : 2;