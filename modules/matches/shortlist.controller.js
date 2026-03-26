import { ApiResponse } from "../../utils/apiResponse.js";
import profileModel from "../profile/profile.model.js";
import { ShortlistService } from "./shortlist.service.js";

export class Shortlist {
  static async shortlistProfile(req, res) {
    const userId = req.userId; 
    
    const targetId = req.params.id; 
    
    await ShortlistService.shortlistProfile(userId, targetId);
    const profile = await profileModel
      .findById(targetId)
      .select("basicDetails location professional images religion");

    return res.json(new ApiResponse(200, "Profile shortlisted", profile));
  }

  static async getAllShortlistedProfile(req, res) {
    const userId = req.userId;
    const data = await ShortlistService.getAllShortlistedProfile(userId);
    return res.json(new ApiResponse(200, "", data));
  }

  static async updateShortlistedStatus(req, res) {
    const userId = req.userId;
    const { targetUserId, status } = req.body;

    const updated = await ShortlistService.updateShortlistStatus(
      userId,
      targetUserId,
      status,
    );
    return res.json(new ApiResponse(200, "Status updated", updated));
  }

  // static async removeProfileFromShortlist(req, res) {}

  // static async blockProfile(req, res) {}
}
