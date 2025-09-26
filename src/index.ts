import mongoose from "mongoose";
import app from "./app";
import { MONGODB_URI, PORT } from "./config";
import { log } from "./logger";

async function main() {
    log("Connecting to mongo", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    log("Connected to mongo");
    app.listen(PORT, () => {
        log(`Server listening on port ${PORT}`);
    });
};

main().catch((err) => {
  console.error("Fatal start error", err);
  process.exit(1);
});