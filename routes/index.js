import express from "express";
import authRoutes from "./v1/auth.routes.js";
import profileRoutes from "./v1/profile.routes.js";
import interestRoutes from "./v1/interest.routes.js";

const router = express.Router();

router.use("/v1/profile", profileRoutes);
router.use("/v1/auth", authRoutes);
router.use("/v1/interest", interestRoutes);

export default router;
