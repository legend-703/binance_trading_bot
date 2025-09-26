import { fetchTickerPrice } from "../binanceClient";
import { Trade } from "../models/Trade";
import {
  BOT_SYMBOL,
  BOT_POLL_INTERVAL_MS,
  BOT_BUY_DROP_PERCENT,
  BOT_SELL_RISE_PERCENT,
} from "../config";
import { log } from "../logger";
import { percentChange } from "../utils/math";

type BotState = {
    running: boolean;
    baselinePrice?: number;
    lastBuyPrice?: number;
    positions: Array<{ buyPrice: number; qty: number; time: Date }>;
}

const state: BotState = {
    running: false,
    baselinePrice: undefined,
    lastBuyPrice: undefined,
    positions: [],
}

let intervalHandle: NodeJS.Timeout | null = null;

export function getState() {
  return { ...state };
}

export async function startBot(symbol = BOT_SYMBOL) {
    if(state.running) return false;
    state.running = true;

    log("Starting bot for", symbol, "inteval", BOT_POLL_INTERVAL_MS, "ms");

    try {
        const t = await fetchTickerPrice(symbol);
        state.baselinePrice = Number(t.price);
        log("Initial baseline price:", state.baselinePrice);
    } catch (err) {
        log("Failed to fetch baseline price:", err);
        state.baselinePrice = undefined;
    }

    intervalHandle = setInterval(async () => {
        if (!state.running) return;
        try {
            const tick = await fetchTickerPrice(symbol);
            const price = Number(tick.price);
            const baseline = state.baselinePrice ?? price;
            const dropPercent = percentChange(baseline, price) * -1;
            log(`Tick ${symbol} price=${price} baseline=${baseline} drop%=${dropPercent.toFixed(3)}`);

            if(dropPercent >= BOT_BUY_DROP_PERCENT) {
                const qty = Number((0.001).toFixed(6));
                const trade = await Trade.create({
                    symbol,
                    price,
                    qty,
                    side: "buy",
                    time: new Date(),
                    note: `Auto buy at drop ${dropPercent.toFixed(2)}% from baseline ${baseline}`,
                    simulated: true,
                });

                state.positions.push({ buyPrice: price, qty, time: new Date() });
                state.lastBuyPrice = price;
                state.baselinePrice = price;
                log("Simulated buy saved:", trade.id, "price", price);
            }

            if(state.positions.length > 0 && state.lastBuyPrice) {
                const rise = percentChange(state.lastBuyPrice, price);
                if (rise >= BOT_SELL_RISE_PERCENT) {
                    for (const pos of state.positions.splice(0)) {
                        const trade = await Trade.create({
                            symbol,
                            price,
                            qty: pos.qty,
                            time: new Date(),
                            side: "sell",
                            note: `Auto sell at rise ${rise.toFixed(2)}% from buy ${pos.buyPrice}`,
                            simulated: true,
                        });
                        log("Simulated sell saved:", trade.id, "price", price);
                    }

                    state.lastBuyPrice = undefined;
                    state.baselinePrice = price;
                }
            }
        } catch (error) {
            
        }
    }, BOT_POLL_INTERVAL_MS);

    return state;
}

export function stopBot() {
    if (intervalHandle) clearInterval(intervalHandle);
    state.running = false;
    intervalHandle = null;
    log("Bot stopped");
    return state;
}