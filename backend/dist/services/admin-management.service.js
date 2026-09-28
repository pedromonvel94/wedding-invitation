import crypto from "crypto";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { sendAdminInviteEmail } from "../utils/email.js";
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
                isConfirmed: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    /**
     * Crear e invitar a un nuevo usuario Administrador desde el Drawer del Super Admin (+ New User)
     */
    async createAdminInvite(data) {
        const { name, lastName, email, phoneNumber, role } = data;
        if (!name || !lastName || !email || !phoneNumber) {
            throw new AppError("Nombre, Apellido, Correo y Número de Teléfono son obligatorios", 400);
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
        // Generar token único de invitación
        const inviteToken = crypto.randomUUID();
        const newAdmin = await prisma.admin.create({
            data: {
                name: name.trim(),
                lastName: lastName.trim(),
                email: cleanEmail,
                phoneNumber: formattedPhone,
                role: (role || "ADMIN"),
                active: true,
                isConfirmed: false,
                inviteToken,
            },
        });
        // URL del enlace de aceptación
        const inviteLink = `http://localhost:5173/accept-invite/${inviteToken}`;
        // Enviar correo electrónico real de invitación
        await sendAdminInviteEmail(newAdmin.email, `${newAdmin.name} ${newAdmin.lastName || ""}`.trim(), inviteLink);
        return {
            success: true,
            message: `Invitación enviada exitosamente a ${newAdmin.email}. Se le ha notificado por correo con el botón de aceptación.`,
            admin: newAdmin,
            inviteLink,
        };
    }
    /**
     * Aceptar invitación mediante el token único del correo
     */
    async acceptInvite(token) {
        if (!token || !token.trim()) {
            throw new AppError("Token de invitación no proporcionado", 400);
        }
        const admin = await prisma.admin.findUnique({
            where: { inviteToken: token.trim() },
        });
        if (!admin) {
            throw new AppError("El enlace de invitación es inválido o ya ha sido utilizado", 404);
        }
        const updated = await prisma.admin.update({
            where: { idAdmin: admin.idAdmin },
            data: {
                isConfirmed: true,
                inviteToken: null,
            },
        });
        return {
            success: true,
            message: "¡Invitación aceptada exitosamente! Ya estás autorizado para iniciar sesión en el panel administrativo.",
            admin: {
                idAdmin: updated.idAdmin,
                name: updated.name,
                email: updated.email,
            },
        };
    }
    /**
     * Editar datos de un Administrador (Nombre, Apellido, Correo, Celular +57, Rol, Estado)
     */
    async updateAdmin(idAdmin, data) {
        const admin = await prisma.admin.findUnique({
            where: { idAdmin },
        });
        if (!admin) {
            throw new AppError("Administrador no encontrado", 404);
        }
        const updateData = {};
        if (data.name)
            updateData.name = data.name.trim();
        if (data.lastName)
            updateData.lastName = data.lastName.trim();
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
        if (data.role)
            updateData.role = data.role;
        if (typeof data.active === "boolean")
            updateData.active = data.active;
        if (data.phoneNumber) {
            let formattedPhone = data.phoneNumber.trim().replace(/\s+/g, "");
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = `+57${formattedPhone.replace(/^57/, "")}`;
            }
            updateData.phoneNumber = formattedPhone;
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
     * Eliminar o desactivar un Administrador (Protegiendo al Super Admin principal)
     */
    async deleteAdmin(idAdmin) {
        const admin = await prisma.admin.findUnique({
            where: { idAdmin },
        });
        if (!admin) {
            throw new AppError("Administrador no encontrado", 404);
        }
        if (admin.email === "juanpemonv1994@gmail.com" || admin.role === "SUPER_ADMIN") {
            throw new AppError("No es posible eliminar ni desactivar al Super Administrador principal", 403);
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
