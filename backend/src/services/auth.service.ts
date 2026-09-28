import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";
import { sendOtpEmail } from "../utils/email.js";
import { sendOtpWhatsApp } from "../utils/whatsapp.js";

export class AuthService {
  /**
   * Paso 1 de Autenticación:
   * Recibe el email, verifica que el admin exista y esté activo.
   * Genera un código OTP de 6 dígitos numéricos y lo envía por correo electrónico real y WhatsApp API.
   */
  async requestLoginOtp(email: string) {
    if (!email || !email.trim()) {
      throw new AppError("El correo electrónico es requerido", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin) {
      throw new AppError("El correo no está registrado como usuario administrador autorizado", 401);
    }

    if (!admin.active) {
      throw new AppError("La cuenta de administrador se encuentra desactivada. Contacte al Super Administrador.", 403);
    }

    // Generar código numérico único de 6 dígitos (ej: 482910)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Válido por 10 minutos

    // Guardar OTP en la base de datos PostgreSQL
    await prisma.admin.update({
      where: { idAdmin: admin.idAdmin },
      data: {
        otpCode,
        otpExpiresAt,
      },
    });

    // Enviar correo electrónico real con nodemailer
    await sendOtpEmail(admin.email, otpCode);

    // Enviar mensaje de WhatsApp por API Oficial si hay número registrado
    if (admin.phoneNumber) {
      await sendOtpWhatsApp(admin.phoneNumber, otpCode);
    }

    const formattedPhone = admin.phoneNumber || "+57 (No configurado)";

    return {
      success: true,
      message: `Código de verificación de 6 dígitos enviado exitosamente a tu correo (${admin.email}).`,
      email: admin.email,
    };
  }

  /**
   * Paso 2 de Autenticación:
   * Verifica el código de 6 dígitos numéricos.
   * Si es correcto y no ha expirado, emite el JWT y otorga acceso.
   */
  async verifyLoginOtp(email: string, otpCode: string) {
    if (!email || !email.trim() || !otpCode || !otpCode.trim()) {
      throw new AppError("El correo y el código de 6 dígitos son requeridos", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin || !admin.active) {
      throw new AppError("Usuario no autorizado o inactivo", 401);
    }

    if (!admin.otpCode || !admin.otpExpiresAt) {
      throw new AppError("No se ha solicitado ningún código de verificación para este usuario", 400);
    }

    if (new Date() > admin.otpExpiresAt) {
      throw new AppError("El código de verificación de 6 dígitos ha expirado. Solicite uno nuevo.", 401);
    }

    if (admin.otpCode !== cleanOtp) {
      throw new AppError("El código de 6 dígitos introducido es incorrecto", 401);
    }

    // Limpiar el código OTP consumido de la base de datos
    await prisma.admin.update({
      where: { idAdmin: admin.idAdmin },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    // Generar token JWT firmado
    const token = generateToken({
      idAdmin: admin.idAdmin,
      email: admin.email,
      name: `${admin.name} ${admin.lastName || ""}`.trim(),
      role: admin.role,
    });

    return {
      success: true,
      message: "Autenticación exitosa. Bienvenido al panel.",
      token,
      admin: {
        idAdmin: admin.idAdmin,
        name: admin.name,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
      },
    };
  }
}

export default new AuthService();
