import mongoose from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import InterestModel from "../interest/interest.model.js";
import profile from "../profile/profile.model.js";
export class InterestServices {
  static async addInterest(to, by) {
    if (!to) {
      throw new ApiError("Missing InterestedTo ID ", 400);
    }
    if (!by) {
      throw new ApiError("Missing InterestedBy ID ", 400);
    }

    const toId = mongoose.Types.ObjectId.createFromHexString(to);

    const existingInterest = await InterestModel.findOne({
      interestTo: toId,
      interestedBy: by,
    });
    if (existingInterest) {
      throw new ApiError("Interest already sent", 400);
    }

    const interest = await InterestModel.create({
      interestTo: to,
      interestedBy: by,
    });
    return interest;
  }

  // Fetch all interests sent by this user, including full 'interestTo' profile
  static async getAllInterest(userID) {
    const interests = await InterestModel.find({
      interestedBy: userID,
      isDeleted: false,
    })
      .populate(
        "interestTo",
        "basicDetails.name basicDetails.age basicDetails.city",
      ) // populate all needed fields
      .populate("interestedBy", "basicDetails.name") // optional, if you want sender info too
      .sort({ createdAt: -1 });

    // Format for frontend
    const formatted = interests.map((i) => ({
      _id: i._id,
      type: "sent",
      status: i.status,
      name: i.interestTo?.basicDetails?.name || "Unknown",
      age: i.interestTo?.basicDetails?.age || 0,
      city: i.interestTo?.basicDetails?.city || "Unknown",
      initials: i.interestTo?.basicDetails?.name
        ? i.interestTo.basicDetails.name
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "NA",
    }));

    return formatted;
  }
  // static async getAllReceivedInterest(userID) {
  //   const interests = await InterestModel.find({
  //     interestTo: userID,
  //     isDeleted: false,
  //   })
  //     .populate(
  //       "interestTo",
  //       "basicDetails.name basicDetails.age basicDetails.city",
  //     ) // populate all needed fields
  //     .populate("interestedBy", "basicDetails.name") // optional, if you want sender info too
  //     .sort({ createdAt: -1 });

  //   // Format for frontend
  //   const formatted = interests.map((i) => ({
  //     _id: i._id,
  //     type: "sent",
  //     status: i.status,
  //     name: i.interestedBy?.basicDetails?.name || "Unknown",
  //     age: i.interestedBy?.basicDetails?.age || 0,
  //     city: i.interestedBy?.basicDetails?.city || "Unknown",
  //     initials: i.interestedBy?.basicDetails?.name
  //       ? i.interestedBy.basicDetails.name
  //           .split(" ")
  //           .map((n) => n[0])
  //           .join("")
  //       : "NA",
  //   }));

  //   return formatted;
  // }
}
