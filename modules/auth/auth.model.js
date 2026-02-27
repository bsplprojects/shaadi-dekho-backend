import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      sparse: true,
    },
    phone: {
      type: String,
      index: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpiry: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
    lastLoginAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

// hash password
authSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// compare password
authSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generating email verification token
authSchema.methods.generateEmailVerificationToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = resetToken;
  this.emailVerificationTokenExpiry = Date.now() + 3600000; // 1 hour
  return resetToken;
};

export default mongoose.model("Auth", authSchema);
