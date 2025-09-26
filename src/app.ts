import express from "express";
import tradeRouter from "./routes/trade";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use("/api", tradeRouter);

app.get("/", (req, res) => {
  res.send("Binance Trading Bot API");
});

export default app;