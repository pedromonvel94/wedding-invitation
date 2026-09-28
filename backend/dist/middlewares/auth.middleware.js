import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";
/**
 * Middleware para autenticar requests mediante JWT
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return next(new AppError("Acceso denegado. Token no proporcionado.", 401));
    }
    try {
        const decoded = verifyToken(token);
        req.admin = decoded;
        next();
    }
    catch {
        return next(new AppError("Token inválido o expirado.", 401));
    }
};
/**
 * Middleware para restringir endpoints exclusivamente al Super Administrador (Juan Pedro Montoya)
 */
export const requireSuperAdmin = (req, res, next) => {
    if (!req.admin) {
        return next(new AppError("Acceso denegado. Usuario no autenticado.", 401));
    }
    if (req.admin.role !== "SUPER_ADMIN") {
        return next(new AppError("Acceso denegado. Esta acción está reservada únicamente para el Super Administrador.", 403));
    }
    next();
};
