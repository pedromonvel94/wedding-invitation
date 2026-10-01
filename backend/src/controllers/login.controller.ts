import { Request, Response, NextFunction } from "express";
import loginService from "../services/login.service.js";

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await loginService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const result = await loginService.changePassword(email, oldPassword, newPassword, confirmPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default { login, changePassword };
