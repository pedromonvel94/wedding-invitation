import prisma from "../config/prisma.js";

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

  if (admin.password !== password) {
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
