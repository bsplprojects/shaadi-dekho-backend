import express from "express";
import { isAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { InterestController } from "../../modules/interest/interest.controller.js";

const router = express.Router();
router
  .route("/new")
  .post(isAuth, asyncHandler(InterestController.createInterest));

  router.route("/getAllInterest").get(isAuth, asyncHandler(InterestController.getAllInterest))
export default router;
