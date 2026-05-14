import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { User } from '@prisma/client';
import { prisma } from '@/prisma/client';
import { getUserByIdService, getUsersService, blockUserService } from '../../../services/user.service';
import { AuthJwtPayload } from '@/types/auth.types';

vi.mock('@/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const mockUser: User = {
  id: 1,
  fullName: 'Gary',
  birthDate: new Date('1990-01-01'),
  email: 'gary@test.com',
  password: 'hashedPassword',
  role: 'USER',
  isActive: true,
};

const adminUser: AuthJwtPayload = {
  userId: 999,
  role: 'ADMIN',
};

const regularUser: AuthJwtPayload = {
  userId: 1,
  role: 'USER',
};

const anotherUser: AuthJwtPayload = {
  userId: 2,
  role: 'USER',
};

describe('User Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getUserByIdService', () => {
    it('should allow admin to get any user', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);

      const result = await getUserByIdService(1, adminUser);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        role: mockUser.role,
        isActive: mockUser.isActive,
      });
    });

    it('should allow user to get himself', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);

      const result = await getUserByIdService(1, regularUser);

      expect(result.id).toBe(mockUser.id);
    });

    it('should throw if user tries to access another user', async () => {
      const result = getUserByIdService(1, anotherUser);

      await expect(result).rejects.toMatchObject({
        message: 'Access denied',
        status: 403,
      });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(null);

      const result = getUserByIdService(1, adminUser);

      await expect(result).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });
    });
  });

  describe('getUsersService', () => {
    it('should return users list', async () => {
      (prisma.user.findMany as Mock).mockResolvedValue([mockUser]);

      const result = await getUsersService();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      });

      expect(result).toEqual([mockUser]);
    });
  });

  describe('blockUserService', () => {
    it('should allow user to block himself', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);
      (prisma.user.update as Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      const result = await blockUserService(1, regularUser);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false },
      });

      expect(result.isActive).toBe(false);
    });

    it('should allow admin to block another user', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);
      (prisma.user.update as Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      const result = await blockUserService(1, adminUser);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.isActive).toBe(false);
    });

    it('should throw if user tries to block another user', async () => {
      const result = blockUserService(1, anotherUser);

      await expect(result).rejects.toMatchObject({
        message: 'Access denied',
        status: 403,
      });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw if admin tries to block himself', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);

      const result = blockUserService(999, adminUser);

      await expect(result).rejects.toMatchObject({
        message: 'Admin cannot block himself',
        status: 403,
      });

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw 404 if user does not exist', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(null);

      const result = blockUserService(1, adminUser);

      await expect(result).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw 409 if user is already blocked', async () => {
      const blockedUser = { ...mockUser, isActive: false };

      (prisma.user.findUnique as Mock).mockResolvedValue(blockedUser);

      const result = blockUserService(1, adminUser);

      await expect(result).rejects.toMatchObject({
        message: 'User is already blocked',
        status: 409,
      });

      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});