import { prisma } from '@/prisma/client';
import { afterAll, afterEach, beforeEach, vi } from 'vitest';
  
afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});