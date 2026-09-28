import { Router } from "express";
import adminManagementController from "../controllers/admin-management.controller.js";
import { authenticateToken, requireSuperAdmin } from "../middlewares/auth.middleware.js";
const adminManagementRouter = Router();
// Endpoint público para aceptar invitación por token
adminManagementRouter.get("/admins/accept-invite/:token", adminManagementController.acceptInvite);
// Endpoints protegidos exclusivamente para el SUPER_ADMIN (Juan Pedro Montoya)
adminManagementRouter.get("/admins", authenticateToken, requireSuperAdmin, adminManagementController.listAdmins);
adminManagementRouter.post("/admins", authenticateToken, requireSuperAdmin, adminManagementController.createAdmin);
adminManagementRouter.put("/admins/:id", authenticateToken, requireSuperAdmin, adminManagementController.updateAdmin);
adminManagementRouter.delete("/admins/:id", authenticateToken, requireSuperAdmin, adminManagementController.deleteAdmin);
export default adminManagementRouter;
