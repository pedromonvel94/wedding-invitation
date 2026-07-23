import prisma from "../config/prisma.js";
import { comparePassword } from "../utils/password.js";

async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; token?: string }> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return {
      success: false,
      message: "Usuario no encontrado",
    };
  }

  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Contraseña incorrecta",
    };
  }

  if (!admin.active) {
    return {
      success: false,
      message: "Usuario deshabilitado",
    };
  }

  return {
    success: true,
    message: "Login exitoso",
  };
}

export default { loginUser };

