import { ProfileService } from "./profile.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { logger } from "../../lib/logger.js";
import mongoose from "mongoose";

const BASE_URL = process.env.BASE_URL || "https://sdbackend.bucksoftech.com";

export class ProfileController {
  static async createProfile(req, res) {
    const body = req.body;
    const files = req.files;
    const imagePaths = files.map(
      (file) => `${BASE_URL}/uploads/${file.filename}`,
    );
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
    const profiles = await ProfileService.getAll(req.userId);
    let response =
      profiles.length > 0
        ? "Profiles fetched successfully"
        : "No profiles found";
    return res.json(new ApiResponse(200, response, profiles));
  }

  static async updateProfile(req, res) {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const body = req.body;
    const files = req.files;
    let imagePaths = [];
    if (files) {
      imagePaths = files.map((file) => `${BASE_URL}/uploads/${file.filename}`);
    }
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

  static async getMyProfile(req, res) {
    const profile = await ProfileService.getMyProfile(req.userId);
    return res.json(
      new ApiResponse(200, "Profile fetched successfully", profile),
    );
  }

  static async addHoroscope(req, res) {
    const profile = await ProfileService.addHoroscope(req.userId, req.body);
    return res.json(
      new ApiResponse(200, "Horoscope added successfully", profile),
    );
  }
}
