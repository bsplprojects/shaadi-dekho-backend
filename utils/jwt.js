import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;
const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET;

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_JWT_SECRET, { expiresIn: "3h" });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_JWT_SECRET, { expiresIn: "7d" });
};
