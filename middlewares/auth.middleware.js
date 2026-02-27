import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

export const isAuth = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new ApiError("Unauthorized", 401);
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new ApiError("Unauthorized", 401);
  }
};
