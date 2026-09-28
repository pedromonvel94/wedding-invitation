import { Router } from "express";
import { getDashboardStatsController } from "../controllers/dashboard.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard/stats", authenticateToken, getDashboardStatsController);

export default router;
