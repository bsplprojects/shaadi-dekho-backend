import crypto from "crypto";

export function generateUniqueMemberId() {
  const random = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()
    .slice(0, 6);
  return `VB${random}`;
}
