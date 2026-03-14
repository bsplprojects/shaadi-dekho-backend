import { ApiError } from "../../utils/apiError.js";
import Profile from "./profile.model.js";
import { generateUniqueMemberId } from "../../utils/generateMemberId.js";
import Auth from "../auth/auth.model.js";
import { calculateProfileCompletion } from "./profile.helper.js";
import preferencesModel from "./preferences.model.js";
import { logger } from "../../lib/logger.js";

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
    if (profile) {
      await Auth.updateOne(
        { _id: userId },
        { $set: { onBoarded: true } },
        {
          new: true,
        },
      );
    }
    return profile;
  }
  static async get(id) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }
    const profile = await Profile.findById(id);
    return profile;
  }
  // static async getAll(userId) {
  //   // must be paginated
  //   const profiles = await Profile.find({ user: { $ne: userId } }).select(
  //     "memberType memberId verified user basicDetails.name basicDetails.dob basicDetails.height basicDetails.age religion.religion location.state professional.education professional.occupation professional.annualIncome images createdAt",
  //   );
  //   return profiles;
  // }

  static async getAll(userId) {
    // get logged in user's profile
    const myProfile = await Profile.findOne({ user: userId }).select(
      "basicDetails.gender",
    );
    if (!myProfile) {
      throw new Error("Profile not found");
    }
    const myGender = myProfile.basicDetails.gender;
    // determine opposite gender
    const oppositeGender = myGender === "male" ? "female" : "male";

    const profiles = await Profile.find({
      user: { $ne: userId },
      "basicDetails.gender": oppositeGender,
    }).select(
      "memberType memberId verified user basicDetails.name basicDetails.dob basicDetails.height basicDetails.age religion.religion location.state professional.education professional.occupation professional.annualIncome images createdAt",
    );

    return profiles;
  }
  static async update(id, data, imagePaths) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }

    const profile = await Profile.findById(id);
    if (!profile) {
      throw new ApiError("Profile not found", 400);
    }

    const mergedImages =
      imagePaths?.length > 0
        ? [...profile.images, ...imagePaths]
        : profile.images;

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { ...data, images: mergedImages },
      { new: true },
    );

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

    const status = calculateProfileCompletion(profile);
    return status;
  }
  static async getMyProfile(id) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }
    const profile = await Profile.findOne({
      user: id,
    }).lean();
    if (!profile) {
      throw new ApiError("Profile not found", 400);
    }
    return profile;
  }
  static async addHoroscope(id, body) {
    if (!id) {
      throw new ApiError("Missing id", 400);
    }
    const profile = await Profile.findOneAndUpdate(
      { user: id },
      { horoscope: body },
      { returnDocument: "after" },
    );
    if (!profile) {
      throw new ApiError("Profile not found", 400);
    }
    return profile;
  }
  static async addPreferences(userId, data) {
    if (!userId) {
      throw new ApiError("Missing userId", 400);
    }
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new ApiError("Profile not found", 400);
    }
    const preference = await preferencesModel.create({
      user: userId,
      ...data,
    });
    return preference;
  }
  static async updatePreference(userId, data) {
    if (!userId) {
      throw new ApiError("Missing userId", 400);
    }
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new ApiError("Profile not found", 400);
    }

    const updatedPreferences = await preferencesModel.findOneAndUpdate(
      { user: userId },
      { ...data },
      { new: true, upsert: true }, //create if not exist
    );
    return updatedPreferences;
  }
  static async getPreference(userId) {
    if (!userId) {
      throw new ApiError("Missing userId", 400);
    }
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new ApiError("Profile not found", 400);
    }
    const preference = await preferencesModel.findOne({ user: userId });

    if (!preference) {
      throw new ApiError("Preference not found", 404);
    }
    return preference;
  }
  static async filterMatchedProfile(filters, userId) {
    const query = {};
    console.log(filters);

    // Get logged-in user's gender
    const currentUser = await Profile.findOne({ user: userId });
    if (!currentUser) throw new Error("User profile not found");

    // Filter opposite gender only
    if (currentUser.basicDetails.gender === "male") {
      query["basicDetails.gender"] = "female";
    } else if (currentUser.basicDetails.gender === "female") {
      query["basicDetails.gender"] = "male";
    }

    // Age filter
    if (filters.minAge || filters.maxAge) {
      query["basicDetails.age"] = {};
      if (filters.minAge)
        query["basicDetails.age"].$gte = Number(filters.minAge);
      if (filters.maxAge)
        query["basicDetails.age"].$lte = Number(filters.maxAge);
    }

    // Religion filter
    if (filters.religion && filters.religion !== "any") {
      query["religion.religion"] = filters.religion;
    }

    // City filter
    if (filters.city) {
      query["location.city"] = { $regex: filters.city, $options: "i" };
    }

    // Member filter
    if (filters.memberID) {
      query["memberId"] = filters.memberID;
    }
    // Education filter
    if (filters.education && filters.education !== "any") {
      query["professional.education"] = filters.education;
    }

    // Profession filter
    if (filters.profession) {
      query["professional.occupation"] = {
        $regex: filters.profession,
        $options: "i",
      };
    }
    // console.log("Id", memberID);
    // Fetch profiles with selected fields
    const profiles = await Profile.find(query).select(
      "memberType memberId verified user basicDetails.name basicDetails.dob basicDetails.height basicDetails.age basicDetails.gender religion.religion location.state professional.education professional.occupation professional.annualIncome images createdAt",
    );

    return profiles;
  }
}
