import mongoose from "mongoose";
import { logger } from "../lib/logger.js";

export async function connectDb() {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri);
    logger.info("🛢️ Connected to database");
  } catch (error) {
    console.log(`Error connecting to database: ${error}`);
    process.exit(1);
  }
}
