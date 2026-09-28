import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_fallback";
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION ||
    "24h");
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
export default {
    generateToken,
    verifyToken,
};
