/**
 * Script de inicialización del Super Administrador.
 *
 * SEGURIDAD: Este archivo NO contiene ningún dato personal ni contraseñas.
 * Todos los datos se leen desde las variables de entorno del archivo .env (nunca subido al repositorio).
 *
 * Variables requeridas en .env:
 *   SUPER_ADMIN_EMAIL      - Correo del Super Admin
 *   SUPER_ADMIN_NAME       - Nombre del Super Admin
 *   SUPER_ADMIN_LASTNAME   - Apellido del Super Admin
 *   SUPER_ADMIN_PHONE      - Teléfono del Super Admin (formato +57XXXXXXXXXX)
 *   SUPER_ADMIN_PASSWORD   - Contraseña inicial del Super Admin (se hashea con bcrypt)
 *
 * Uso:
 *   npm run seed
 */
import "dotenv/config";
import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const name = process.env.SUPER_ADMIN_NAME;
  const lastName = process.env.SUPER_ADMIN_LASTNAME;
  const phoneNumber = process.env.SUPER_ADMIN_PHONE;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !name || !password) {
    console.error("❌ Error: Variables de entorno requeridas no encontradas.");
    console.error("   Asegúrate de definir en tu .env:");
    console.error("   SUPER_ADMIN_EMAIL, SUPER_ADMIN_NAME, SUPER_ADMIN_PASSWORD");
    process.exit(1);
  }

  const hashedPassword = await hashPassword(password);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      name,
      lastName: lastName || null,
      phoneNumber: phoneNumber || null,
      role: "SUPER_ADMIN",
      active: true,
      password: hashedPassword,
      mustChangePassword: false,
    },
    create: {
      email,
      name,
      lastName: lastName || null,
      phoneNumber: phoneNumber || null,
      role: "SUPER_ADMIN",
      active: true,
      password: hashedPassword,
      mustChangePassword: false,
    },
  });

  console.log(`✅ Super Admin inicializado correctamente: ${admin.email}`);
  console.log(`   Nombre: ${admin.name} ${admin.lastName || ""}`);
  console.log(`   Rol: ${admin.role}`);
  console.log(`   Puedes iniciar sesión en /admin/login con las credenciales configuradas.`);
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
