import { Request, Response, NextFunction } from "express";
import { verifyToken, AdminPayload } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}

/**
 * Middleware para autenticar requests mediante JWT
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Acceso denegado. Token no proporcionado.", 401));
  }

  try {
    const decoded = verifyToken(token) as AdminPayload;
    req.admin = decoded;
    next();
  } catch {
    return next(new AppError("Token inválido o expirado.", 401));
  }
};

/**
 * Middleware para restringir endpoints exclusivamente al Super Administrador (Juan Pedro Montoya)
 */
export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.admin) {
    return next(new AppError("Acceso denegado. Usuario no autenticado.", 401));
  }

  if (req.admin.role !== "SUPER_ADMIN") {
    return next(
      new AppError(
        "Acceso denegado. Esta acción está reservada únicamente para el Super Administrador.",
        403,
      ),
    );
  }

  next();
};
