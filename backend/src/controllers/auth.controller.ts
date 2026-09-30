import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service.js";

export class AuthController {
  /**
   * POST /api/auth/login-request
   * Solicitud inicial de correo (Paso 1)
   */
  async requestOtp(req: Request, res: Response, next: NextFunction) {
    console.log(`📥 [API LOGIN REQUEST] Incoming request from Origin: "${req.get("origin")}" | Email: "${req.body?.email}"`);
    try {
      const { email } = req.body;
      const result = await authService.requestLoginOtp(email);
      console.log(`✅ [API LOGIN REQUEST SUCCESS] Sent response for: ${email}`);
      res.json(result);
    } catch (error) {
      console.error(`❌ [API LOGIN REQUEST ERROR] Error processing login request for email "${req.body?.email}":`, error);
      next(error);
    }
  }

  /**
   * POST /api/auth/login-verify
   * Verificación del PIN numérico de 6 dígitos (Paso 2)
   */
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    console.log(`📥 [API LOGIN VERIFY] Incoming request from Origin: "${req.get("origin")}" | Email: "${req.body?.email}" | OTP: "${req.body?.otpCode}"`);
    try {
      const { email, otpCode } = req.body;
      const result = await authService.verifyLoginOtp(email, otpCode);
      console.log(`✅ [API LOGIN VERIFY SUCCESS] OTP verified for: ${email}`);
      res.json(result);
    } catch (error) {
      console.error(`❌ [API LOGIN VERIFY ERROR] Error verifying OTP for email "${req.body?.email}":`, error);
      next(error);
    }
  }
}

export default new AuthController();
