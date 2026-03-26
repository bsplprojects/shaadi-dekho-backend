import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuth } from "../../middlewares/auth.middleware.js";
import { ViewList } from "../../modules/matches/viewedlist.controller.js";

const router = express.Router();

router.route("/new/:id").post(isAuth, asyncHandler(ViewList.viewedProfile));
router.route("/all").get(isAuth, asyncHandler(ViewList.getAllViewedProfile));

export default router;
