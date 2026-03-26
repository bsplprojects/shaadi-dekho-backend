import profileModel from "../profile/profile.model.js";
import Viewlist from "./viewedlist.model.js";

export class ViewlistService {
  // only for one side user detail to view list

  // static async viewlistProfile(byId, id) {
  //   // byId = viewer
  //   // id = profile being viewed
  //   console.log("ById", byId);
  //   console.log("Id", id);
  //   let alreadyViewedListIds = await Viewlist.findOne({
  //     viewedBy: byId,
  //   });

  //   // console.log("alreadyViewedProfile", alreadyViewedListIds);

  //   if (!alreadyViewedListIds) {
  //     const response = await Viewlist.create({
  //       viewedBy: byId,
  //       viewIds: [{ id: id }],
  //     });
  //     return { response };
  //   }
  //   //  Check if already viewed
  //   const exists = alreadyViewedListIds.viewIds.some(
  //     (item) => item.id.toString() === id.toString(),
  //   );

  //   if (exists) {
  //     return { response: alreadyViewedListIds };
  //   }
  //   alreadyViewedListIds.viewIds.push({ id: id });
  //   await alreadyViewedListIds.save();

  //   return { response: alreadyViewedListIds };
  // }

  static async viewlistProfile(userId, targetProfileId) {
    if (!userId || !targetProfileId) return;

    //  STEP 1: Convert profileId → userId
    const profile = await profileModel.findById(targetProfileId);

    if (!profile) return;

    const targetUserId = profile.user;

    if (userId.toString() === targetUserId.toString()) return;

    const now = new Date();

    // STEP 2: Ensure documents exist
    await Viewlist.updateOne(
      { viewedBy: userId },
      { $setOnInsert: { viewedBy: userId } },
      { upsert: true },
    );

    await Viewlist.updateOne(
      { viewedBy: targetUserId },
      { $setOnInsert: { viewedBy: targetUserId } },
      { upsert: true },
    );

    // STEP 3: viewedByYou
    const res1 = await Viewlist.updateOne(
      { viewedBy: userId, "viewedByYou.userId": targetUserId },
      { $set: { "viewedByYou.$.viewedAt": now } },
    );

    if (res1.matchedCount === 0) {
      await Viewlist.updateOne(
        { viewedBy: userId },
        { $push: { viewedByYou: { userId: targetUserId, viewedAt: now } } },
      );
    }

    // STEP 4: viewedYou
    const res2 = await Viewlist.updateOne(
      { viewedBy: targetUserId, "viewedYou.userId": userId },
      { $set: { "viewedYou.$.viewedAt": now } },
    );

    if (res2.matchedCount === 0) {
      await Viewlist.updateOne(
        { viewedBy: targetUserId },
        { $push: { viewedYou: { userId: userId, viewedAt: now } } },
      );
    }
  }
  
  // static async getAllViewedListProfile(id) {
  //   const doc = await Viewlist.findOne({ viewedBy: id });
  //   if (!doc || !doc.viewIds.length) {
  //     return [];
  //   }
  //   const profileIds = doc.viewIds.map((item) => item.id);
  //   const profiles = await profileModel
  //     .find({ _id: { $in: profileIds } })
  //     .select("basicDetails location professional images religion");

  //   return profiles;
  // }

  // Fetch all viewed profiles for a user
  static async getAllViewedListProfile(userId) {
    const doc = await Viewlist.findOne({ viewedBy: userId });

    // console.log("Doc found:", doc);

    if (!doc) {
      return {
        viewedByYou: [],
        viewedYou: [],
      };
    }

    const viewedByYouIds = doc.viewedByYou.map((v) => v.userId.toString());
    const viewedYouIds = doc.viewedYou.map((v) => v.userId.toString());

    console.log("viewedByYouIds:", viewedByYouIds);
    console.log("viewedYouIds:", viewedYouIds);

    const allIds = [...new Set([...viewedByYouIds, ...viewedYouIds])];

    const profiles = await profileModel
      .find({ user: { $in: allIds } }) // IMPORTANT FIX
      .select("basicDetails location professional images religion user");

    const map = new Map(profiles.map((p) => [p.user.toString(), p]));

    return {
      viewedByYou: viewedByYouIds.map((id) => map.get(id)).filter(Boolean),
      viewedYou: viewedYouIds.map((id) => map.get(id)).filter(Boolean),
    };
  }
}
