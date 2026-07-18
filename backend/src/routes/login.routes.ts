import { Router } from "express";
import loginController from "../controllers/login.controller.js";

const loginRouter = Router();

loginRouter.post("/login", loginController.login);

export default loginRouter;
