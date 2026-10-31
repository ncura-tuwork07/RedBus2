import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Crea (o actualiza) la cuenta de dirección del portal sin cargar datos de demostración.
// Uso: ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME="Nombre Apellido" npm run db:create-admin
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Dirección";

  if (!email || !password) {
    throw new Error("Faltan ADMIN_EMAIL y ADMIN_PASSWORD.");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD tiene que tener al menos 10 caracteres.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, roles: ["DIRECTIVO"], enabled: true },
    create: { email, passwordHash, name, roles: ["DIRECTIVO"] },
  });
  console.log(`Cuenta de dirección lista: ${email}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
