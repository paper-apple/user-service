import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

interface UserSeed {
  fullName: string;
  birthDate: Date;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
}

const prisma = new PrismaClient();

async function seedUsers(): Promise<void> {
  const users: UserSeed[] = [
    {
      fullName: 'Admin',
      birthDate: new Date('2000-01-01'),
      email: 'admin@test.com',
      password: '123456',
      role: 'ADMIN',
      isActive: true,
    },
    {
      fullName: 'Konstantin',
      birthDate: new Date('1995-05-15'),
      email: 'kostik@test.com',
      password: '123456',
      role: 'USER',
      isActive: true,
    },
    {
      fullName: 'Eduard',
      birthDate: new Date('2005-10-25'),
      email: 'ed777@test.com',
      password: '123456',
      role: 'USER',
      isActive: true,
    },
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`User ${userData.email} already exist`);
      continue;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }
}

seedUsers()