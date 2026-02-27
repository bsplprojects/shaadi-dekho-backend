import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
      index: true,
    },

    basicDetails: {
      profileFor: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      dob: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      bodyType: {
        type: String,
        enum: ["slim", "athletic", "average", "heavy"],
      },
      age: {
        type: Number,
        required: true,
      },
      physicalStatus: {
        type: String,
        enum: ["normal", "disabled"],
        required: true,
      },
      height: {
        type: String,
      },
      weight: {
        type: String,
      },
      motherTongue: {
        type: String,
      },
      maritalStatus: {
        type: String,
        required: true,
      },
    },

    lifestyle: {
      drinkingHabits: {
        type: String,
        enum: ["no", "occasionally", "frequently", "yes"],
      },
      smokingHabits: {
        type: String,
        enum: ["no", "occasionally", "frequently", "yes"],
      },
      diet: {
        type: String,
        enum: ["vegetarian", "non_vegetarian", "eggetarian", "vegan"],
      },
      description: {
        type: String,
      },
    },

    religion: {
      religion: String,
      caste: String,
      subCaste: String,
    },

    location: {
      country: String,
      city: String,
      state: String,
      citizenship: String,
      ancestralOrigin: String,
    },

    professional: {
      education: String,
      educationDetail: String,
      college: String,
      employmentSector: String,
      occupation: String,
      occupationDetail: String,
      organization: String,
      annualIncome: String,
      workingCity: String,
    },

    family: {
      fatherName: String,
      fatherOccupation: String,
      motherName: String,
      motherOccupation: String,
      familyType: String,
      familyValues: String,
      familyLocation: String,
      brothers: Number,
      sisters: Number,
      about: String,
      status: String,
    },

    horoscope: {
      tob: Date,
      pob: String,
      star: String,
      raasi: String,
      manglik: {
        type: String,
        enum: ["yes", "no", "partial"],
      },
    },

    hobbies: [String],
    interests: [String],
    images: [String],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    memberType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  { timestamps: true },
);

profileSchema.index({ "basicDetails.gender": 1 });
profileSchema.index({ "basicDetails.maritalStatus": 1 });
profileSchema.index({ "basicDetails.physicalStatus": 1 });

profileSchema.index({ "basicDetails.dob": 1 });

profileSchema.index({ "religion.religion": 1 });
profileSchema.index({ "religion.caste": 1 });

profileSchema.index({ "location.country": 1 });
profileSchema.index({ "location.state": 1 });
profileSchema.index({ "location.city": 1 });

profileSchema.index({ "professional.education": 1 });
profileSchema.index({ "professional.occupation": 1 });
profileSchema.index({ "professional.employmentSector": 1 });

profileSchema.index({ user: 1 }, { unique: true });

profileSchema.index({
  "religion.religion": 1,
  "location.city": 1,
  "basicDetails.dob": 1,
  "basicDetails.maritalStatus": 1,
});

export default mongoose.model("Profile", profileSchema);
