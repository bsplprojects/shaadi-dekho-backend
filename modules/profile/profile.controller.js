import { ProfileService } from "./profile.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { logger } from "../../lib/logger.js";

export class ProfileController {
  static async createProfile(req, res) {
    const body = req.body;
    const files = req.files;
    const imagePaths = files.map((file) => `/uploads/${file.filename}`);
    const profile = await ProfileService.create(req.userId, body, imagePaths);
    return res.json(
      new ApiResponse(201, "Profile created successfully", profile),
    );
  }

  static async getProfile(req, res) {
    const id = req.params.id;
    const profile = await ProfileService.get(id);
    if (!profile) {
      return res.json(new ApiResponse(200, "Profile not found", profile));
    }
    return res.json(
      new ApiResponse(200, "Profile fetched successfully", profile),
    );
  }

  static async getAllProfile(req, res) {
    const profiles = await ProfileService.getAll();
    let response =
      profiles.length > 0
        ? "Profiles fetched successfully"
        : "No profiles found";
    return res.json(new ApiResponse(200, response, profiles));
  }

  static async updateProfile(req, res) {
    const id = req.params.id;
    const body = req.body;
    const files = req.files;
    const imagePaths = files.map((file) => `/uploads/${file.filename}`);
    const profile = await ProfileService.update(id, body, imagePaths);
    return res.json(
      new ApiResponse(200, "Profile updated successfully", profile),
    );
  }

  static async deleteProfile(req, res) {
    const id = req.params.id;
    const profile = await ProfileService.delete(id);
    return res.json(
      new ApiResponse(200, "Profile deleted successfully", profile),
    );
  }

  static async getStatus(req, res) {
    const id = req.userId;
    const status = await ProfileService.getStatus(id);
    return res.json(
      new ApiResponse(200, "Status fetched successfully", status),
    );
  }
}
