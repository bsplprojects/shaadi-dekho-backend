import mongoose from "mongoose";

const ShortListSchema = mongoose.Schema(
  // {
  //   ids: [
  //     {
  //       id: String,
  //     },
  //   ],
  //   shortlistedBy: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Auth",
  //   },
  // },

  {
    shortlistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    // profiles I viewed
    shortlistedByYou: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
        },
        shortlistedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["shortlist", "shortlisted", "remove"],
          default: "shortlist",
        },
      },
    ],

    // users who viewed me
    shortlistedYou: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
        },
        shortlistedAt: {
          type: Date,
          default: Date.now,
        },
    
      },
    ],
  },
  { timestamps: true },
);
const Shortlist = new mongoose.model("Shortlist", ShortListSchema);
export default Shortlist;
