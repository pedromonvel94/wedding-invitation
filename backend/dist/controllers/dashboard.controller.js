import dashboardService from "../services/dashboard.service.js";
export async function getDashboardStatsController(_req, res) {
    try {
        const statsData = await dashboardService.getDashboardStats();
        res.status(200).json(statsData);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las estadísticas del dashboard",
        });
    }
}
