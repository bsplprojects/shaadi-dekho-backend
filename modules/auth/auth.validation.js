import { z } from "zod";

const emptyToUndefined = (val) => (val === "" ? undefined : val);

const emailSchema = z.preprocess(
  emptyToUndefined,
  z.email("Invalid email address").toLowerCase().trim().optional(),
);

const credentialSchema = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .regex(
      /^((?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}|^[6-9]\d{9})$/,
      "Invalid email or phone number",
    )
    .optional(),
);

export const phoneSchema = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .regex(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      "Invalid phone number",
    )
    .optional(),
);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");

export const registerSchema = z
  .object({
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email"],
  });

export const loginSchema = z
  .object({
    credential: credentialSchema.optional(),
    password: passwordSchema,
  })
  .refine((data) => data.credential, {
    message: "Either email or phone is required",
    path: ["credential"],
  });

export const updateStatusSchema = z.object({
  status: z.enum(["active", "blocked", "deleted"]),
});

export const otpSchema = z.object({
  phone: z.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),
  otp: z.string().optional(),
});
