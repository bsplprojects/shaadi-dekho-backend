import { ApiResponse } from "../../utils/apiResponse.js";
import profileModel from "../profile/profile.model.js";
import { ViewlistService } from "./viewedlist.services.js";

export class ViewList {
  // static async viewedProfile(req, res) {
  //   const id = req.params.id;
  //   console.log("id", id);
  //   const userId = req.userId;
  //   console.log("UserId", userId);
  //   const { response } = await ViewlistService.viewlistProfile(userId, id);

  //   return res.json(new ApiResponse(200, "Profile viewed", response));
  // }

  // static async getAllViewedProfile(req, res) {
  //   const userId = req.userId;
  //   const ids = await ViewlistService.getAllViewedListProfile(userId);
  //   return res.json(new ApiResponse(200, "", ids));
  // }

  // User views another profile
  static async viewedProfile(req, res) {
    const userId = req.userId; // logged-in user
    const targetId = req.params.id; // profile being viewed

    // Add the view to DB
    await ViewlistService.viewlistProfile(userId, targetId);

    // Fetch the profile details
    const profile = await profileModel
      .findById(targetId)
      .select("basicDetails location professional images religion");

    return res.json(new ApiResponse(200, "Profile fetched", profile));
  }

  // Get all viewed profiles (Viewed By You + Viewed You)
  static async getAllViewedProfile(req, res) {
    const userId = req.userId;
    const data = await ViewlistService.getAllViewedListProfile(userId);
    return res.json(new ApiResponse(200, "", data));
  }
}
