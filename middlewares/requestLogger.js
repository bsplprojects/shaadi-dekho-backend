import { logger } from "../lib/logger.js";
export const requestLogger = (req, res, next) => {
  logger.info(`[${req.method}] : ${req.url}`);
  next();
};
