import express from "express";
import { Trade } from "../models/Trade";
import { getState, startBot, stopBot } from "../bot/tradingBot";
import { log } from "../logger";

const router = express.Router();

router.get("/trades/recent", async (req, res) => {
  const limit = Number(req.query.limit) || 50;
  try {
    const trades = await Trade.find().sort({ time: -1 }).limit(limit).lean();
    res.json({ success: true, trades });
  } catch (err: any) {
    log("Failed fetching trades", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/bot/start", async (req, res) => {
  try {
    const state = await startBot();
    res.json({ success: true, state });
  } catch (err: any) {
    log("Failed to start bot", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/bot/stop", (req, res) => {
  try {
    const state = stopBot();
    res.json({ success: true, state });
  } catch (err: any) {
    log("Failed to stop bot", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/bot/status", (req, res) => {
  try {
    const state = getState();
    res.json({ success: true, state });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const trades = await Trade.find().sort({ time: 1 }).lean();
    // very simple PnL simulation: match buys and sells FIFO
    let pnl = 0;
    const stack: Array<{ price: number; qty: number }> = [];
    for (const t of trades) {
      if (t.side === "buy") {
        stack.push({ price: t.price, qty: t.qty });
      } else if (t.side === "sell") {
        let qtyToSell = t.qty;
        while (qtyToSell > 0 && stack.length > 0) {
          const lot = stack[0];
          const used = Math.min(lot.qty, qtyToSell);
          pnl += used * (t.price - lot.price);
          lot.qty -= used;
          qtyToSell -= used;
          if (lot.qty === 0) stack.shift();
        }
      }
    }
    res.json({ success: true, pnl });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;