import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      index: true,
      sparse: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Otp", otpSchema);
