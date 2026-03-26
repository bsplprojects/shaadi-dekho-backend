import mongoose from "mongoose";

const ViewListSchema = new mongoose.Schema(
  {
    viewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    // profiles I viewed
    viewedByYou: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // users who viewed me
    viewedYou: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Viewlist", ViewListSchema);
