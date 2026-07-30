import { Request, Response, NextFunction } from "express";
import { verifyToken, AdminPayload } from "../utils/jwt.js";

// Extender la interfaz Request de Express para incluir los datos del Admin autenticado
export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acceso denegado. Token no proporcionado.",
    });
  }

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado.",
    });
  }
}
