import { prisma } from '@/prisma/client';
import bcrypt from 'bcrypt';

export const createTestUser = async (overrides = {}) => {
  const hashedPassword = await bcrypt.hash('123456', 10);

  return prisma.user.create({
    data: {
      fullName: 'Gary',
      birthDate: new Date('1990-01-01'),
      email: 'gary@test.com',
      password: hashedPassword,
      role: 'USER',
      isActive: true,

      ...overrides,
    },
  });
};