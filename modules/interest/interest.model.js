import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
  {
    interestTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    interestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    seenAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false },
   
  },
  { timestamps: true },
);

export default mongoose.model("Interest", interestSchema);
