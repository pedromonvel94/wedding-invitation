import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../utils/app-error.js";
import type { AdminRole } from "../generated/prisma/client.js";

export interface CreateAdminInput {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  tempPassword: string;
  role?: "SUPER_ADMIN" | "ADMIN";
}

export class AdminManagementService {
  /**
   * Listar todos los administradores registrados
   */
  async listAdmins() {
    return prisma.admin.findMany({
      select: {
        idAdmin: true,
        name: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        active: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Crear un nuevo Administrador con contraseña temporal asignada por el Super Admin
   */
  async createAdmin(data: CreateAdminInput) {
    const { name, lastName, email, phoneNumber, tempPassword, role } = data;

    if (!name || !lastName || !email || !phoneNumber || !tempPassword) {
      throw new AppError("Nombre, Apellido, Correo, Teléfono y Contraseña Temporal son obligatorios", 400);
    }

    if (tempPassword.length < 6) {
      throw new AppError("La contraseña temporal debe tener al menos 6 caracteres", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verificar si el correo ya existe
    const existing = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      throw new AppError("El correo electrónico ya está registrado como administrador", 400);
    }

    // Formatear número celular con código de país +57 de Colombia si no lo incluye
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+57${formattedPhone.replace(/^57/, "")}`;
    }

    // Hashear la contraseña temporal
    const hashedPassword = await hashPassword(tempPassword);

    const newAdmin = await prisma.admin.create({
      data: {
        name: name.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        phoneNumber: formattedPhone,
        role: (role || "ADMIN") as AdminRole,
        active: true,
        password: hashedPassword,
        mustChangePassword: true, // El admin debe cambiar su contraseña en el primer login
      },
    });

    return {
      success: true,
      message: `Administrador "${newAdmin.name} ${newAdmin.lastName}" creado exitosamente. Al iniciar sesión por primera vez se le solicitará cambiar su contraseña.`,
      admin: {
        idAdmin: newAdmin.idAdmin,
        name: newAdmin.name,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        phoneNumber: newAdmin.phoneNumber,
        role: newAdmin.role,
        mustChangePassword: newAdmin.mustChangePassword,
      },
    };
  }

  /**
   * Editar datos de un Administrador
   */
  async updateAdmin(idAdmin: number, data: Partial<CreateAdminInput> & { active?: boolean; resetPassword?: string }) {
    const admin = await prisma.admin.findUnique({
      where: { idAdmin },
    });

    if (!admin) {
      throw new AppError("Administrador no encontrado", 404);
    }

    const updateData: Record<string, unknown> = {};

    if (data.name) updateData.name = data.name.trim();
    if (data.lastName) updateData.lastName = data.lastName.trim();
    if (data.email) {
      const cleanEmail = data.email.trim().toLowerCase();
      if (cleanEmail !== admin.email) {
        const existing = await prisma.admin.findUnique({
          where: { email: cleanEmail },
        });
        if (existing) {
          throw new AppError("El correo electrónico ya está registrado por otro administrador", 400);
        }
        updateData.email = cleanEmail;
      }
    }
    if (data.role) updateData.role = data.role as AdminRole;
    if (typeof data.active === "boolean") updateData.active = data.active;

    if (data.phoneNumber) {
      let formattedPhone = data.phoneNumber.trim().replace(/\s+/g, "");
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+57${formattedPhone.replace(/^57/, "")}`;
      }
      updateData.phoneNumber = formattedPhone;
    }

    // El Super Admin puede resetear la contraseña de un admin
    if (data.resetPassword) {
      if (data.resetPassword.length < 6) {
        throw new AppError("La nueva contraseña debe tener al menos 6 caracteres", 400);
      }
      updateData.password = await hashPassword(data.resetPassword);
      updateData.mustChangePassword = true;
    }

    const updated = await prisma.admin.update({
      where: { idAdmin },
      data: updateData,
    });

    return {
      success: true,
      message: "Datos de administrador actualizados exitosamente",
      admin: updated,
    };
  }

  /**
   * Eliminar un Administrador (Protegiendo al Super Admin principal)
   */
  async deleteAdmin(idAdmin: number) {
    const admin = await prisma.admin.findUnique({
      where: { idAdmin },
    });

    if (!admin) {
      throw new AppError("Administrador no encontrado", 404);
    }

    if (admin.role === "SUPER_ADMIN") {
      throw new AppError("No es posible eliminar al Super Administrador", 403);
    }

    await prisma.admin.delete({
      where: { idAdmin },
    });

    return {
      success: true,
      message: `El administrador ${admin.email} ha sido eliminado correctamente`,
    };
  }
}

export default new AdminManagementService();
