import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@test.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await prisma.user.create({
      data: {
        fullName: "Admin",
        birthDate: new Date("2000-01-01"),
        email: "admin@test.com",
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("Admin created");
  }
}

main();