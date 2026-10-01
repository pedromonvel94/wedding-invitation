import { Request, Response, NextFunction } from "express";
import adminManagementService from "../services/admin-management.service.js";

export class AdminManagementController {
  /**
   * GET /api/admins
   */
  async listAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await adminManagementService.listAdmins();
      res.json({
        success: true,
        admins,
        data: admins,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admins (Drawer + New User)
   */
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, lastName, email, phoneNumber, role, tempPassword } = req.body;
      const result = await adminManagementService.createAdmin({
        name,
        lastName,
        email,
        phoneNumber,
        role,
        tempPassword,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }


  /**
   * PUT /api/admins/:id
   */
  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const idAdmin = Number(req.params.id);
      const result = await adminManagementService.updateAdmin(idAdmin, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admins/:id
   */
  async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const idAdmin = Number(req.params.id);
      const result = await adminManagementService.deleteAdmin(idAdmin);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminManagementController();
