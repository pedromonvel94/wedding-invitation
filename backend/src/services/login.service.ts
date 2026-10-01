import prisma from "../config/prisma.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";

async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new AppError("Correo y contraseña son requeridos", 400);
  }

  const cleanEmail = email.trim().toLowerCase();

  const admin = await prisma.admin.findUnique({
    where: { email: cleanEmail },
  });

  if (!admin) {
    throw new AppError("Correo o contraseña incorrectos", 401);
  }

  if (!admin.active) {
    throw new AppError("Tu cuenta de administrador está desactivada. Contacta al Super Administrador.", 403);
  }

  if (!admin.password) {
    throw new AppError("Esta cuenta no tiene contraseña configurada. Contacta al Super Administrador.", 401);
  }

  const isPasswordValid = await comparePassword(password, admin.password);
  if (!isPasswordValid) {
    throw new AppError("Correo o contraseña incorrectos", 401);
  }

  // Si el admin debe cambiar contraseña (primer login), devolvemos flag pero NO el token
  if (admin.mustChangePassword) {
    return {
      success: true,
      mustChangePassword: true,
      email: admin.email,
      message: "Debes cambiar tu contraseña antes de continuar.",
    };
  }

  const token = generateToken({
    idAdmin: admin.idAdmin,
    email: admin.email,
    name: `${admin.name} ${admin.lastName || ""}`.trim(),
    role: admin.role,
  });

  return {
    success: true,
    mustChangePassword: false,
    message: "Inicio de sesión exitoso.",
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

async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  if (!email || !oldPassword || !newPassword || !confirmPassword) {
    throw new AppError("Todos los campos son requeridos", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("La nueva contraseña y su confirmación no coinciden", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("La nueva contraseña debe tener al menos 6 caracteres", 400);
  }

  const cleanEmail = email.trim().toLowerCase();

  const admin = await prisma.admin.findUnique({
    where: { email: cleanEmail },
  });

  if (!admin || !admin.active) {
    throw new AppError("Usuario no autorizado o inactivo", 401);
  }

  if (!admin.password) {
    throw new AppError("Esta cuenta no tiene contraseña configurada", 401);
  }

  const isOldPasswordValid = await comparePassword(oldPassword, admin.password);
  if (!isOldPasswordValid) {
    throw new AppError("La contraseña anterior es incorrecta", 401);
  }

  // Importar hashPassword aquí para evitar dependencia circular
  const { hashPassword } = await import("../utils/password.js");
  const newHash = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { idAdmin: admin.idAdmin },
    data: {
      password: newHash,
      mustChangePassword: false,
    },
  });

  const token = generateToken({
    idAdmin: admin.idAdmin,
    email: admin.email,
    name: `${admin.name} ${admin.lastName || ""}`.trim(),
    role: admin.role,
  });

  return {
    success: true,
    message: "Contraseña actualizada exitosamente. ¡Bienvenido al panel!",
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

export default { loginUser, changePassword };
