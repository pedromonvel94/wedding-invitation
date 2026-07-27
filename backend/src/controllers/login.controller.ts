import { Request, Response, NextFunction } from "express";
import loginService from "../services/login.service.js";

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  try {
    const result = await loginService.loginUser(email, password);
    res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    next(error);
  }
}

export default { login };

