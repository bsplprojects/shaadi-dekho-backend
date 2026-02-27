import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
});

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: isProd
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
  transports: [new winston.transports.Console()],
});
