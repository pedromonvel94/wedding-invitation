import prisma from "../config/prisma.js";

async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; token?: string }> {
  const adminEmail = await prisma.admin.findUnique({
    where: { email },
  });

  if (!adminEmail) {
    return {
      success: false,
      message: "Usuario no encontrado",
    };
  }

  if (adminEmail.password !== password) {
    return {
      success: false,
      message: "Contraseña incorrecta",
    };
  }

  return {
    success: true,
    message: "Login exitoso",
  };
}
