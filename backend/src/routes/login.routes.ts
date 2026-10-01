import { Router } from "express";
import loginController from "../controllers/login.controller.js";

const loginRouter = Router();

// POST /api/auth/login — Inicio de sesión con correo y contraseña
loginRouter.post("/auth/login", loginController.login);

// POST /api/auth/change-password — Cambio de contraseña (primer login o voluntario)
loginRouter.post("/auth/change-password", loginController.changePassword);

export default loginRouter;
