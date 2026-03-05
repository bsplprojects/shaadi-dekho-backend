import { ApiError } from "../../utils/apiError.js";
import Auth from "./auth.model.js";
import { sendEmail, sendWelcomeMail } from "../../utils/email.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { logger } from "../../lib/logger.js";
import Otp from "../auth/otp.model.js";
import crypto from "crypto";
import { generateOtp, hashOtp, sendSMS } from "../../utils/otp.js";

export class AuthService {
  static async register({ email, phone, password }) {
    if (!email && !phone) {
      throw new ApiError("Either email or phone is required", 400);
    }

    const existingUser = await Auth.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }

    const user = await Auth.create({
      email,
      phone,
      password,
    });

    if (!user) {
      throw new ApiError("Failed to create user", 400);
    }

    // generating email verification token if email exists.
    if (email) {
      const token = await user.generateEmailVerificationToken();
      const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
      await sendEmail(user.email, link);
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
    user.lastLoginAt = Date.now();
    await user.save();

    const response = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
    };

    // send welcome mail
    if (email) {
      await sendWelcomeMail(user.email);
    }

    return { response, accessToken, refreshToken };
  }

  static async login({ credential, password }) {
    if (!credential) {
      throw new ApiError("Either email or phone is required", 400);
    }

    const user = await Auth.findOne({
      $or: [{ email: credential }, { phone: credential }],
    }).select("+password");

    if (!user) {
      throw new ApiError("User not found", 400);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError("Incorrect credentials", 400);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
    user.lastLoginAt = Date.now();
    await user.save();

    const response = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      onBoarded: user.onBoarded,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
    };

    return { response, accessToken, refreshToken };
  }

  static async sendOtp(phone) {
    const user = await Auth.findOne({ phone });
    if (!user) {
      throw new ApiError("User not found", 400);
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpResponse = await Otp.create({ phone, otp: otpHash, expiresAt });
    logger.debug(otp);

    if (!otpResponse) {
      throw new ApiError("Failed to send OTP", 400);
    }

    await sendSMS(phone, otp);

    return true;
  }

  static async verifyOtp({ phone, otp }) {
    const otpResponse = await Otp.findOne({ phone }).sort({ createdAt: -1 });
    if (!otpResponse) {
      throw new ApiError("OTP not found. Please try again", 400);
    }

    if (otpResponse.attempts >= 3) {
      throw new ApiError("Too many attempts. Please try again later", 400);
    }

    if (new Date() > otpResponse.expiresAt) {
      throw new ApiError("OTP expired. Please try again", 400);
    }

    const hashed = hashOtp(otp);

    if (hashed !== otpResponse.otp) {
      otpResponse.attempts += 1;
      await otpResponse.save();
      throw new ApiError("Incorrect OTP", 400);
    }

    await Otp.deleteMany({ phone });

    const user = await Auth.findOne({ phone });
    if (!user) {
      throw new ApiError("User not found", 400);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
    user.lastLoginAt = Date.now();
    await user.save();

    const response = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      onBoarded: user.onBoarded,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
    };

    return { response, accessToken, refreshToken };
  }

  static async logout(userId) {
    const user = await Auth.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 400);
    }
    user.refreshToken = null;
    user.refreshTokenExpiry = null;
    await user.save();
    return user;
  }

  static async me(userId) {
    const response = await Auth.findById(userId);
    if (!response) {
      throw new ApiError("User not found", 400);
    }
    const user = {
      _id: response._id,
      email: response.email,
      phone: response.phone,
      isEmailVerified: response.isEmailVerified,
      lastLoginAt: response.lastLoginAt,
    };
    return user;
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError("Provide refresh token", 400);
    }

    const user = await Auth.findOne({ refreshToken });
    if (!user) {
      throw new ApiError("Invalid refresh token", 400);
    }

    if (user.refreshTokenExpiry < Date.now()) {
      throw new ApiError("Refresh token expired", 400);
    }

    const accessToken = generateAccessToken(user._id);
    const response = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
    };

    return { response, accessToken, refreshToken };
  }

  static async updateStatus({ userId, status }) {
    const response = await Auth.findById(userId);
    if (!response) {
      throw new ApiError("User not found", 400);
    }
    response.status = status;
    await response.save();

    const user = {
      _id: response._id,
      email: response.email,
      phone: response.phone,
      status: response.status,
    };

    return user;
  }

  static async verifyEmail(token) {
    if (!token) {
      throw new ApiError("Token is required", 400);
    }

    const user = await Auth.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError("Invalid token", 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    const response = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
    };

    return response;
  }
}
