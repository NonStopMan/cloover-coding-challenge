import "dotenv/config";
import { Role } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const userPassword = await bcrypt.hash("User12345!", 12);

  await db.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      fullName: "Admin User",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  await db.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      fullName: "Demo User",
      passwordHash: userPassword,
      role: Role.USER,
    },
  });
  const users = await db.user.findMany();
  console.log("Seeded users:", JSON.stringify(users));

  console.log(
    "Seed complete: admin@test.com / Admin123!, user@test.com / User12345!",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
