import { ApiResponse } from "../../utils/apiResponse.js";
import { InterestServices } from "./interest.services.js";

export class InterestController {
  // Create a new interest
  static async createInterest(req, res) {
    const { id } = req.body;
    const userId = req.userId;
    const interest = await InterestServices.addInterest(id, userId);
    return res.json(
      new ApiResponse(201, "Interest send successfully", interest),
    );
  }

  static async getAllInterest(req, res) {
    const userId = req.userId || req.user?._id; 
    const response = await InterestServices.getAllInterest(userId);

    return res.json(
      new ApiResponse(200, "Interest fetched successfully", response),
    );
  }
}
