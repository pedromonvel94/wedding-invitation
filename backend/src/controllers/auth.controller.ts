import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service.js";

export class AuthController {
  /**
   * POST /api/auth/login-request
   * Solicitud inicial de correo (Paso 1)
   */
  async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.requestLoginOtp(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login-verify
   * Verificación del PIN numérico de 6 dígitos (Paso 2)
   */
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otpCode } = req.body;
      const result = await authService.verifyLoginOtp(email, otpCode);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
