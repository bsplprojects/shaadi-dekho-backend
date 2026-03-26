import express from "express";
import { isAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ContactController } from "../../modules/contact/contact.controller.js";

const router = express.Router();
router
  .route("/create")
  .post(isAuth, asyncHandler(ContactController.createContact));

  export default router;