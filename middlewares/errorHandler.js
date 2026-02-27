import { ApiError } from "../utils/apiError.js";
import { logger } from "../lib/logger.js";

export const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  if (!(err instanceof ApiError)) {
    logger.error(err.stack);
    err = new ApiError(err.message || "Internal Server Error", 500);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    statusCode: err.statusCode,
    stack: isProd ? undefined : err.stack,
  });
};
