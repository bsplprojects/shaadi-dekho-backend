import { ApiError } from "../utils/apiError.js";

export const validate =
  (schema, property = "body") =>
  (req, _res, next) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      return next(new ApiError(message, 400));
    }
    req[property] = result.data;
    next();
  };
