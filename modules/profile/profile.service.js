import { ApiError } from "../../utils/apiError.js";
import Profile from "./profile.model.js";
import { generateUniqueMemberId } from "../../utils/generateMemberId.js";
import Auth from "../auth/auth.model.js";
import { calculateProfileCompletion } from "./profile.helper.js";

export class ProfileService {
  static async create(userId, data, imagePaths) {
    if (!userId) {
      throw new ApiError("User not found", 400);
    }

    const memberId = generateUniqueMemberId();

    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      throw new ApiError("Profile already exists", 400);
    }

    const profile = await Profile.create({
      ...data,
      user: userId,
      memberId,
      images: imagePaths,
    });

    return profile;
  }

  static async get(id) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }
    const profile = await Profile.findById(id);
    return profile;
  }

  static async getAll() {
    // must be paginated
    const profiles = await Profile.find({}).select(
      "memberType memberId verified user basicDetails.name basicDetails.dob basicDetails.height religion.religion location.state professional.education professional.occupation professional.annualIncome images createdAt",
    );
    return profiles;
  }

  static async update(id, data, imagePaths) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }
    const updatedProfile = await Profile.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedProfile) {
      throw new ApiError("Profile not found", 400);
    }
    return updatedProfile;
  }

  static async delete(id) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }
    const deletedProfile = await Profile.findByIdAndDelete(id);
    if (!deletedProfile) {
      throw new ApiError("Profile not found", 400);
    }
    return deletedProfile;
  }

  static async getStatus(id) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }

    const user = await Auth.findById(id);
    if (!user) {
      throw new ApiError("User not found", 400);
    }

    const profile = await Profile.findOne({
      user: id,
    }).lean();

    if (!profile) {
      throw new ApiError("Profile not found", 400);
    }

    // calculating profile completeness score along with which blocks are completed/missing
    const status = calculateProfileCompletion(profile);
    return status;
  }
}
