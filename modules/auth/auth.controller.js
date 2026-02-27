import { AuthService } from "./auth.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export class AuthController {
  // REGISTER
  static async register(req, res) {
    const { email, phone, password } = req.body;
    const {
      response: user,
      accessToken,
      refreshToken,
    } = await AuthService.register({ email, phone, password });
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 3 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json(new ApiResponse(200, "Registered successfully", user));
  }

  // LOGIN
  static async login(req, res) {
    const { email, phone, password } = req.body;
    const {
      response: user,
      accessToken,
      refreshToken,
    } = await AuthService.login({
      email,
      phone,
      password,
    });
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 3 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json(new ApiResponse(200, "Logged in successfully", user));
  }

  // LOGOUT
  static async logout(req, res) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    const user = await AuthService.logout(req.userId);
    return res.json(new ApiResponse(200, "Logged out successfully"));
  }

  // PROFILE
  static async me(req, res) {
    const user = await AuthService.me(req.userId);
    return res.json(new ApiResponse(200, "User fetched successfully", user));
  }

  // REFRESH TOKEN
  static async refresh(req, res) {
    const refresh = req.cookies?.refreshToken;
    const { response: user, accessToken } = await AuthService.refresh(refresh);
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 3 * 60 * 60 * 1000,
    });
    return res.json(new ApiResponse(200, "User refreshed successfully", user));
  }

  // UPDATE STATUS
  static async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
      throw new ApiError("Id is required", null, 400);
    }
    const user = await AuthService.updateStatus({
      userId: id,
      status,
    });
    return res.json(new ApiResponse(200, "Status updated successfully", user));
  }

  // VERIFY EMAIL
  static async verifyEmail(req, res) {
    const token = req.query.token;
    const user = await AuthService.verifyEmail(token);
    return res.json(new ApiResponse(200, "Verified successfully", user));
  }
}
