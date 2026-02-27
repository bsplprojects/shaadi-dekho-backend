import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use("/uploads", express.static(path.join(__dirname, "../backend/uploads")));

app.use("/api", routes);
app.use(errorHandler);

export default app;
