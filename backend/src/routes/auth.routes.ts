import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

// Paso 1: Solicitar OTP por email
authRouter.post("/auth/login-request", authController.requestOtp);

// Paso 2: Verificar OTP de 6 dígitos
authRouter.post("/auth/login-verify", authController.verifyOtp);

export default authRouter;
