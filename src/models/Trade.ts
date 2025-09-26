import mongoose, { Schema, Document } from "mongoose";

export interface ITrade extends Document {
    symbol: string;
    price: number;
    qty: number;
    tradeId?: number;
    time: Date;
    side: "buy" | "sell" | "fill" | "market";
    note?: string;
    simulated: boolean;
    createdAt: Date;
}

const tradeSchema = new Schema<ITrade>({
    symbol: { type: String, required: true},
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    tradeId: Number,
    time: { type: Date, required: true },
    side: { type: String, required: true, enum: ["buy", "sell", "fill", "market"] },
    note: String,
    simulated: { type: Boolean, default: true },
}, { timestamps: true });

export const Trade = mongoose.model<ITrade>("Trade", tradeSchema);
