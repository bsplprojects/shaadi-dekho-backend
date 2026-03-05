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
import { rateLimit } from "express-rate-limit";

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

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

// LOGIN VIA OTP
router.route("/phone").post(
  // otpLimiter,
  // validate(phoneSchema),
  asyncHandler(AuthController.sendOtp),
);

// VERIFY OTP
router.route("/otp").post(
  // otpLimiter,
  asyncHandler(AuthController.verifyOtp),
);

// PROFILE ROUTE
router.route("/me").get(isAuth, asyncHandler(AuthController.me));

// LOGOUT ROUTE
router.route("/logout").post(isAuth, asyncHandler(AuthController.logout));

// REFRESH ROUTE
router.route("/refresh").post(asyncHandler(AuthController.refresh));

// VERIFY EMAIL
router.route("/verify-email").post(asyncHandler(AuthController.verifyEmail));

export default router;
