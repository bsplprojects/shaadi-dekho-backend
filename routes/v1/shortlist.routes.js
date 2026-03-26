import express from "express";
import { isAuth } from "../../middlewares/auth.middleware.js";
import { Shortlist } from "../../modules/matches/shortlist.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.route("/new/:id").post(isAuth, asyncHandler(Shortlist.shortlistProfile));
router
  .route("/all")
  .get(isAuth, asyncHandler(Shortlist.getAllShortlistedProfile));
router;

router
  .route("/updateStatus")
  .post(isAuth, asyncHandler(Shortlist.shortlistProfile));
export default router;
