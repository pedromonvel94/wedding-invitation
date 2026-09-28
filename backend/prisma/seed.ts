import "dotenv/config";
import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

async function main() {
  const email = "juanpemonv1994@gmail.com";

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      name: "Juan Pedro",
      lastName: "Montoya",
      phoneNumber: "+573205832210",
      role: "SUPER_ADMIN",
      active: true,
      isConfirmed: true,
    },
    create: {
      name: "Juan Pedro",
      lastName: "Montoya",
      email,
      phoneNumber: "+573205832210",
      role: "SUPER_ADMIN",
      active: true,
      isConfirmed: true,
    },
  });

  console.log("✅ Super Admin Pedro registrado exitosamente:", admin.email);

  // Seed Admin Cata
  const cataAdmin = await prisma.admin.upsert({
    where: { email: "catalina7596@hotmail.com" },
    update: {
      name: "Cata",
      phoneNumber: "+573233973123",
      role: "ADMIN",
      active: true,
      isConfirmed: true,
    },
    create: {
      name: "Cata",
      email: "catalina7596@hotmail.com",
      phoneNumber: "+573233973123",
      role: "ADMIN",
      active: true,
      isConfirmed: true,
    },
  });

  console.log("✅ Admin Cata registrada exitosamente:", cataAdmin.email);
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
