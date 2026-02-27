import app from "./index.js";
import { connectDb } from "./database/connection.js";
import { logger } from "./lib/logger.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDb();
  app.listen(PORT, () => {
    logger.info(`🗄️ Server is running on port ${PORT}`);
  });
}

startServer();
