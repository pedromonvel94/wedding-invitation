import { Request, Response } from "express";
import loginService from "../services/login.service.js";

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await loginService.loginUser(email, password);
    res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}

export default { login };
