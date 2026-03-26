import { ApiError } from "../../utils/apiError.js";
import profileModel from "../profile/profile.model.js";
import Shortlist from "./shortlist.model.js";

export class ShortlistService {
  static async shortlistProfile(userId, targetProfileId) {
    if (!userId || !targetProfileId) return;

    const profile = await profileModel.findById(targetProfileId);

    if (!profile) return;

    const targetUserId = profile.user;

    if (userId.toString() === targetUserId.toString()) return;

    const now = new Date();

    await Shortlist.updateOne(
      { shortlistedBy: userId },
      { $setOnInsert: { shortlistedBy: userId } },
      { upsert: true },
    );

    await Shortlist.updateOne(
      { shortlistedBy: targetUserId },
      { $setOnInsert: { shortlistedBy: targetUserId } },
      { upsert: true },
    );

    const res1 = await Shortlist.updateOne(
      { shortlistedBy: userId, "shortlistedByYou.userId": targetUserId },
      {
        $set: {
          "shortlistedByYou.$.shortlistedAt": now,
          "shortlistedByYou.$.status": "shortlisted",
        },
      },
    );

    if (res1.matchedCount === 0) {
      await Shortlist.updateOne(
        { shortlistedBy: userId },
        {
          $push: {
            shortlistedByYou: {
              userId: targetUserId,
              shortlistedAt: now,
              status: "shortlisted",
            },
          },
        },
      );
    }

    const res2 = await Shortlist.updateOne(
      { shortlistedBy: targetUserId, "shortlistedYou.userId": userId },
      {
        $set: {
          "shortlistedYou.$.shortlistedAt": now
        
        },
      },
    );

    if (res2.matchedCount === 0) {
      await Shortlist.updateOne(
        { shortlistedBy: targetUserId },
        {
          $push: {
            shortlistedYou: {
              userId: userId,
              shortlistedAt: now,
             
            },
          },
        },
      );
    }
  }

  // Get all profiles shortlisted by a user
  static async getAllShortlistedProfile(userId) {
    //  Find the shortlist document for the user
    const doc = await Shortlist.findOne({ shortlistedBy: userId });

    if (!doc) {
      return {
        shortlistedByYou: [],
        shortlistedYou: [],
      };
    }

    const shortlistedByYouIds = doc.shortlistedByYou.map((v) =>
      v.userId.toString(),
    );
    const shortlistedYouIds = doc.shortlistedYou.map((v) =>
      v.userId.toString(),
    );

    // console.log("shortlistedByYouIds:", shortlistedByYouIds);
    // console.log("shortlistedYouIds:", shortlistedYouIds);

    const allIds = [...new Set([...shortlistedByYouIds, ...shortlistedYouIds])];

    const profiles = await profileModel
      .find({ user: { $in: allIds } }) // IMPORTANT FIX
      .select("basicDetails location professional images religion user");

    const map = new Map(profiles.map((p) => [p.user.toString(), p]));
    //merge profile + status
    const shortlistedByYou = doc.shortlistedByYou
      .map((v) => {
        const profile = map.get(v.userId.toString());
        if (!profile) return null;
        return {
          ...profile.toObject(),
          status: v.status,
          shortlistedAt: v.shortlistedAt,
        };
      })
      .filter(Boolean);

    const shortlistedYou = doc.shortlistedYou
      .map((v) => {
        const profile = map.get(v.userId.toString());
        if (!profile) return null;
        return {
          ...profile.toObject(),
          status: v.status,
          shortlistedAt: v.shortlistedAt,
        };
      })
      .filter(Boolean);

    return {
      shortlistedByYou,
      shortlistedYou,
    };
  }

  static async updateShortlistStatus(userId, targetUserId, status) {
    const now = new Date();

    const userObj = new mongoose.Types.ObjectId(userId);
    const targetObj = new mongoose.Types.ObjectId(targetUserId);

    // ✅ 1. Update YOUR document (you received interest)
    const res1 = await Shortlist.updateOne(
      {
        shortlistedBy: userObj,
        "shortlistedYou.userId": targetObj,
      },
      {
        $set: {
          "shortlistedYou.$.status": status,
          "shortlistedYou.$.shortlistedAt": now,
        },
      },
    );

    // ✅ 2. Update OTHER USER document (they sent interest)
    const res2 = await Shortlist.updateOne(
      {
        shortlistedBy: targetObj,
        "shortlistedByYou.userId": userObj,
      },
      {
        $set: {
          "shortlistedByYou.$.status": status,
          "shortlistedByYou.$.shortlistedAt": now,
        },
      },
    );

    console.log("res1:", res1);
    console.log("res2:", res2);

    return { targetUserId, status };
  }

  // static async removeProfileFromShortlist(id) {}
  // static async blockProfile(id) {}
}
