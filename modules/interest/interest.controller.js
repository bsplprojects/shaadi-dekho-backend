import { ApiResponse } from "../../utils/apiResponse.js";
import profileModel from "../profile/profile.model.js";
import { InterestServices } from "./interest.services.js";

export class InterestController {
  // Create a new interest
  static async createInterest(req, res) {
    const targetId = req.body.id;
    
    const userId = req.userId;
 
    const interest = await InterestServices.addInterest(targetId, userId);

    const profile = await profileModel
      .findById(targetId)
      .select("basicDetails location professional images religion");
    return res.json(
      new ApiResponse(201, "Interest send successfully", profile),
    );
  }

  static async getAllInterest(req, res) {
    const userId = req.userId || req.user?._id;
    console.log("UserId", userId);
    const response = await InterestServices.getAllInterest(userId);

    return res.json(
      new ApiResponse(200, "Interest fetched successfully", response),
    );
  }

  static async updateInterestStatus(req, res) {
    const userId = req.userId; // who is taking action
    const { targetUserId, status } = req.body;

    const updated = await InterestServices.updateInterestStatus(
      userId,
      targetUserId,
      status,
    );

    return res.json(new ApiResponse(200, "Interest Status updated", updated));
  }
}
