import { z } from "zod";

const bodyTypeEnum = ["slim", "athletic", "average", "heavy"];
const physicalStatusEnum = ["normal", "disabled"];
const habitEnum = ["no", "occasionally", "frequently", "yes"];
const manglikEnum = ["yes", "no", "partial"];
const dietEnum = ["vegetarian", "non_vegetarian", "eggetarian", "vegan"];

export const parseJsonIfString = (schema) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, schema);

const basicDetailsSchema = z.object({
  profileFor: z.string().min(1),
  name: z.string().min(1),
  dob: z.string().datetime(),
  age: z.number().int().positive(),
  gender: z.string().min(1),
  bodyType: z.enum(bodyTypeEnum).optional(),
  physicalStatus: z.enum(physicalStatusEnum),
  height: z.string().optional(),
  weight: z.string().optional(),
  motherTongue: z.string().optional(),
  maritalStatus: z.string().min(1),
});

const lifestyleSchema = z.object({
  drinkingHabits: z.enum(habitEnum).optional(),
  smokingHabits: z.enum(habitEnum).optional(),
  diet: z.enum(dietEnum).optional(),
  description: z.string().optional(),
});

const religionSchema = z.object({
  religion: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
});

const locationSchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  citizenship: z.string().optional(),
  ancestralOrigin: z.string().optional(),
});

const professionalSchema = z.object({
  education: z.string().optional(),
  educationDetail: z.string().optional(),
  college: z.string().optional(),
  employmentSector: z.string().optional(),
  occupation: z.string().optional(),
  occupationDetail: z.string().optional(),
  organization: z.string().optional(),
  annualIncome: z.string().optional(),
  workingCity: z.string().optional(),
});

const familySchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  familyType: z.string().optional(),
  familyValues: z.string().optional(),
  familyLocation: z.string().optional(),
  brothers: z.number().int().min(0).optional(),
  sisters: z.number().int().min(0).optional(),
  about: z.string().optional(),
  status: z.string().optional(),
});

const horoscopeSchema = z.object({
  tob: z.string().datetime().optional(),
  pob: z.string().optional(),
  star: z.string().optional(),
  raasi: z.string().optional(),
  manglik: z.enum(manglikEnum).optional(),
});

export const createProfileSchema = z.object({
  basicDetails: parseJsonIfString(basicDetailsSchema),
  lifestyle: parseJsonIfString(lifestyleSchema.optional()),
  religion: parseJsonIfString(religionSchema.optional()),
  location: parseJsonIfString(locationSchema.optional()),
  professional: parseJsonIfString(professionalSchema.optional()),
  family: parseJsonIfString(familySchema.optional()),
  horoscope: horoscopeSchema.optional(),
  hobbies: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  images: z.array(z.file()).optional(),
});

export const updateProfileSchema = z.object({
  basicDetails: parseJsonIfString(basicDetailsSchema.partial()).optional(),
  lifestyle: parseJsonIfString(lifestyleSchema.partial()).optional(),
  religion: parseJsonIfString(religionSchema.partial()).optional(),
  location: parseJsonIfString(locationSchema.partial()).optional(),
  professional: parseJsonIfString(professionalSchema.partial()).optional(),
  family: parseJsonIfString(familySchema.partial()).optional(),
  horoscope: horoscopeSchema.partial().optional(),

  hobbies: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  images: z.array(z.file()).optional(),
});
