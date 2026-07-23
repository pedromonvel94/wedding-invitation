import jwt from "jsonwebtoken";

export interface AdminPayload {
  idAdmin: number;
  email: string;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_fallback";
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION ||
  "24h") as jwt.SignOptions["expiresIn"];

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

export function verifyToken(token: string): AdminPayload {
  return jwt.verify(token, JWT_SECRET) as AdminPayload;
}

export default {
  generateToken,
  verifyToken,
};
