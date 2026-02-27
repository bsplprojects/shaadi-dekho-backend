import express from "express";
import authRoutes from "./v1/auth.routes.js";
import profileRoutes from "./v1/profile.routes.js";

const router = express.Router();

router.use("/v1/profile", profileRoutes);
router.use("/v1/auth", authRoutes);

export default router;
