import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema(
  {
    ageRange: {
      min: {
        type: Number,
   
      },
      max: {
        type: Number,
     
      },
    },
    heightRange: {
      min: {
        type: Number,
       
      },
      max: {
        type: Number,
     
      },
    },
    maritalStatus: {
      type: String,
      enum: ["any", "never_married", "divorced", "widowed"],
    },
    bodyType: {
      type: String,
      enum: ["any", "slim", "average", "athletic", "heavy"],
    },
    religion: {
      type: String,
      enum: ["any", "hindu", "muslim", "christian", "sikh", "jain", "buddhist"],
    },
    caste: {
      type: String,
    },
    motherTongue: {
      type: String,
      // enum: [
      //   "Any",
      //   "Hindi",
      //   "Urdu",
      //   "Marathi",
      //   "Punjabi",
      //   "Bhojpuri",
      //   "Khortha",
      //   "Tamil",
      //   "Kannada",
      //   "Telugu",
      //   "Orriya",
      //   "Gujrati",
      //   "Bengoli",
      // ],
    },
    minimumEducation: {
      type: String,
      // enum: ["Any", "Bachelor's", "Master's", "PhD", "Professional Degree"],
    },
    preferedOccupation: {
      type: String,
    },
    minimumAnnualIncome: {
      type: String,
      // enum: [
      //   "Any",
      //   "0-3 Lakh",
      //   "3-5 Lakh",
      //   "5-10 Lakh",
      //   "10-20 Lakh",
      //   "20-50 Lakh",
      //   "50 Lakh+",
      // ],
    },
    preferedLocation: {
      type: String,
    },
    diet: {
      type: String,
      // enum: ["Any", "Vegetarian", "Non-Vegitarian", "Eggitarian"],
    },
    smoking: {
      type: String,
      // enum: ["Doesn't Matter", "Non-Smoker", "Occasional"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true },
);

preferencesSchema.index({ maritalStatus: 1 });
preferencesSchema.index({ religion: 1 });
preferencesSchema.index({ caste: 1 });
preferencesSchema.index({ minimumAnnualIncome: 1 });
preferencesSchema.index({ diet: 1 });

export default mongoose.model("Preference", preferencesSchema);
