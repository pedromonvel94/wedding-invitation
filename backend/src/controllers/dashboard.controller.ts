import type { Request, Response } from "express";
import dashboardService from "../services/dashboard.service.js";

export async function getDashboardStatsController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const statsData = await dashboardService.getDashboardStats();
    res.status(200).json(statsData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las estadísticas del dashboard",
    });
  }
}
