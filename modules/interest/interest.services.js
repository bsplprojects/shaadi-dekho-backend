import mongoose from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import Interest from "../interest/interest.model.js";
import profileModel from "../profile/profile.model.js";
export class InterestServices {
  static async addInterest(targetProfileId, userId) {
    if (!userId || !targetProfileId) return;
    
    const profile = await profileModel.findById(targetProfileId);
    
    if (!profile) return;
    const targetUserId = profile.user;
  

    if (userId.toString() === targetUserId.toString()) return;

    const now = new Date();

    await Interest.updateOne(
      { interestedBy: userId },
      { $setOnInsert: { interestedBy: userId } },
      { upsert: true },
    );

    await Interest.updateOne(
      { interestedBy: targetUserId },
      { $setOnInsert: { interestedBy: targetUserId } },
      { upsert: true },
    );
    const res1 = await Interest.updateOne(
      { interestedBy: userId, "interestedByYou.userId": targetUserId },
      { $set: { "interestedByYou.$.interestedAt": now } },
    );

    if (res1.matchedCount === 0) {
      await Interest.updateOne(
        { interestedBy: userId },
        {
          $push: {
            interestedByYou: {
              userId: targetUserId,
              interestedAt: now,
              status: "pending",
            },
          },
        },
      );
    }

    const res2 = await Interest.updateOne(
      { interestedBy: targetUserId, "interestedToYou.userId": userId },
      { $set: { "interestedToYou.$.interestedAt": now } },
    );

    if (res2.matchedCount === 0) {
      await Interest.updateOne(
        { interestedBy: targetUserId },
        {
          $push: {
            interestedToYou: {
              userId: userId,
              interestedAt: now,
              status: "pending",
            },
          },
        },
      );
    }
  }

  static async getAllInterest(userId) {
    if (!userId) return { interestedByYou: [], interestedToYou: [] };

    // Find the user's interest document
    const doc = await Interest.findOne({ interestedBy: userId });

    if (!doc) {
      return {
        interestedByYou: [],
        interestedToYou: [],
      };
    }

    // Extract userIds
    const byYouIds = doc.interestedByYou.map((v) => v.userId.toString());
    const toYouIds = doc.interestedToYou.map((v) => v.userId.toString());

    // Get all related profiles from DB
    const allIds = [...new Set([...byYouIds, ...toYouIds])];

    const profiles = await profileModel
      .find({ user: { $in: allIds } })
      .select("basicDetails location professional images religion user");

    // Map profiles by userId
    const map = new Map(profiles.map((p) => [p.user.toString(), p]));

    // Merge profile + status
    const interestedByYou = doc.interestedByYou
      .map((v) => {
        const profile = map.get(v.userId.toString());
        if (!profile) return null;
        return {
          ...profile.toObject(),
          status: v.status,
          interestedAt: v.interestedAt,
        };
      })
      .filter(Boolean);

    const interestedToYou = doc.interestedToYou
      .map((v) => {
        const profile = map.get(v.userId.toString());
        if (!profile) return null;
        return {
          ...profile.toObject(),
          status: v.status,
          interestedAt: v.interestedAt,
        };
      })
      .filter(Boolean);

    return { interestedByYou, interestedToYou };
  }

  // interest.service.js
  static async updateInterestStatus(userId, targetUserId, status) {
    const now = new Date();

    const userObj = new mongoose.Types.ObjectId(userId);
    const targetObj = new mongoose.Types.ObjectId(targetUserId);

    // ✅ 1. Update YOUR document (you received interest)
    const res1 = await Interest.updateOne(
      {
        interestedBy: userObj,
        "interestedToYou.userId": targetObj,
      },
      {
        $set: {
          "interestedToYou.$.status": status,
          "interestedToYou.$.interestedAt": now,
        },
      },
    );

    // ✅ 2. Update OTHER USER document (they sent interest)
    const res2 = await Interest.updateOne(
      {
        interestedBy: targetObj,
        "interestedByYou.userId": userObj,
      },
      {
        $set: {
          "interestedByYou.$.status": status,
          "interestedByYou.$.interestedAt": now,
        },
      },
    );

    console.log("res1:", res1);
    console.log("res2:", res2);

    return { targetUserId, status };
  }
}
