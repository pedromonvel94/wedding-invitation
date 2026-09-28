import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";
async function loginUser(email, password) {
    const admin = await prisma.admin.findUnique({
        where: { email },
    });
    if (!admin) {
        return {
            success: false,
            message: "Usuario no encontrado",
        };
    }
    if (!admin.active) {
        return {
            success: false,
            message: "Usuario deshabilitado",
        };
    }
    const token = generateToken({
        idAdmin: admin.idAdmin,
        email: admin.email,
        name: admin.name,
        role: admin.role,
    });
    return {
        success: true,
        message: "Login exitoso",
        token,
    };
}
export default { loginUser };
