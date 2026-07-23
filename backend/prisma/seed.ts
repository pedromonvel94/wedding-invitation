import "dotenv/config";
import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

async function main() {
  const email = "admin@wedding.com";
  const rawPassword = "AdminPassword123!";
  const hashedPassword = await hashPassword(rawPassword);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      active: true,
    },
    create: {
      name: "Administrador Principal",
      email,
      password: hashedPassword,
      active: true,
    },
  });

  console.log("✅ Admin de prueba asegurado:", admin.email);
  console.log("🔑 Contraseña en texto plano para pruebas:", rawPassword);
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
