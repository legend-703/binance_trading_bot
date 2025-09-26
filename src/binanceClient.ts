import axios from "axios";
import { BINANCE_API_KEY } from "./config";
import { log, error } from "./logger";

const BASE = "https://api.binance.com";

export async function fetchRecentTrades(symbol: string, limit = 500) {
  try {
    const response = await axios.get(
      `${BASE}/api/v3/trades?symbol=${symbol}&limit=${limit}`
    );
    return response.data;
  } catch (err) {
    error("Error fetching recent trades:", err);
    throw err;
  }
}

export async function fetchTickerPrice(symbol: string) {
  try {
    const response = await axios.get(
      `${BASE}/api/v3/ticker/price?symbol=${symbol}`
    );
    return response.data;
  } catch (err) {
    error("Error fetching ticker price:", err);
    throw err;
  }
}

