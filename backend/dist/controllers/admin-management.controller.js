import adminManagementService from "../services/admin-management.service.js";
export class AdminManagementController {
    /**
     * GET /api/admins
     */
    async listAdmins(req, res, next) {
        try {
            const admins = await adminManagementService.listAdmins();
            res.json({
                success: true,
                admins,
                data: admins,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/admins (Drawer + New User)
     */
    async createAdmin(req, res, next) {
        try {
            const { name, lastName, email, phoneNumber, role } = req.body;
            const result = await adminManagementService.createAdminInvite({
                name,
                lastName,
                email,
                phoneNumber,
                role,
            });
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/admins/accept-invite/:token
     */
    async acceptInvite(req, res, next) {
        try {
            const token = String(req.params.token);
            const result = await adminManagementService.acceptInvite(token);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/admins/:id
     */
    async updateAdmin(req, res, next) {
        try {
            const idAdmin = Number(req.params.id);
            const result = await adminManagementService.updateAdmin(idAdmin, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/admins/:id
     */
    async deleteAdmin(req, res, next) {
        try {
            const idAdmin = Number(req.params.id);
            const result = await adminManagementService.deleteAdmin(idAdmin);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
export default new AdminManagementController();
