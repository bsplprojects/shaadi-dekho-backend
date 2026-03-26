import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./modules/socket/socketHandler.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();

//  WEBSOCKET CORS (for APIs)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8080", "https://sd.bucksoftech.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//  EXPRESS CORS (for APIs)
app.use(
  cors({
    origin: ["http://localhost:8080", "https://sd.bucksoftech.com"],
    credentials: true,
  }),
);

socketHandler(io);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use("/uploads", express.static(path.join(__dirname, "../backend/uploads")));

app.use("/api", routes);
app.use(errorHandler);

export default server;
