import express from "express";
import authRoutes from "./v1/auth.routes.js";
import profileRoutes from "./v1/profile.routes.js";
import interestRoutes from "./v1/interest.routes.js";
import contactRoutes from "./v1/contact.route.js";
import shortlistRoutes from "./v1/shortlist.routes.js";
import viewlistRoutes from "./v1/viewlist.routes.js";
import messageRoutes from "./v1/message.routes.js";

const router = express.Router();

router.use("/v1/profile", profileRoutes);
router.use("/v1/auth", authRoutes);
router.use("/v1/interest", interestRoutes);
router.use("/v1/contact", contactRoutes);
router.use("/v1/shortlist", shortlistRoutes);
router.use("/v1/viewlist", viewlistRoutes);
router.use("/v1/messages", messageRoutes);

export default router;
