import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import {
  createProfileSchema,
  updateProfileSchema,
} from "../../modules/profile/profile.validation.js";
import { ProfileController } from "../../modules/profile/profile.controller.js";
import { isAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router
  .route("/new")
  .post(
    upload.array("images", 6),
    isAuth,
    validate(createProfileSchema),
    asyncHandler(ProfileController.createProfile),
  );

router.route("/status").get(isAuth, asyncHandler(ProfileController.getStatus));
router.route("/all").get(isAuth, asyncHandler(ProfileController.getAllProfile));
router.route("/:id").get(isAuth, asyncHandler(ProfileController.getProfile));

router
  .route("/:id")
  .patch(
    isAuth,
    upload.array("images", 6),
    validate(updateProfileSchema),
    asyncHandler(ProfileController.updateProfile),
  );

router
  .route("/:id")
  .delete(isAuth, asyncHandler(ProfileController.deleteProfile));

export default router;
