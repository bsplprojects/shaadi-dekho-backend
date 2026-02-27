import express from "express";
import { AuthController } from "../../modules/auth/auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  updateStatusSchema,
} from "../../modules/auth/auth.validation.js";
import { isAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// UPDATE STATUS ROUTE
router
  .route("/update/:id")
  .put(
    isAuth,
    validate(updateStatusSchema),
    asyncHandler(AuthController.updateStatus),
  );

// REGISTER ROUTE
router
  .route("/register")
  .post(validate(registerSchema), asyncHandler(AuthController.register));

// LOGIN ROUTE
router
  .route("/login")
  .post(validate(loginSchema), asyncHandler(AuthController.login));

// PROFILE ROUTE
router.route("/me").get(isAuth, asyncHandler(AuthController.me));

// LOGOUT ROUTE
router.route("/logout").post(isAuth, asyncHandler(AuthController.logout));

// REFRESH ROUTE
router.route("/refresh").get(asyncHandler(AuthController.refresh));

// VERIFY EMAIL
router.route("/verify-email").post(asyncHandler(AuthController.verifyEmail));

export default router;
