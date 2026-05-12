import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { prisma } from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../../services/auth.service';
import { User } from '@prisma/client';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../../prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
  }
}));

const email = 'gary@test.com';
const password = '123456';

const registerData = {
  email,
  password,
  fullName: 'Gary',
  birthDate: new Date('1990-01-01'),
};

const mockUser: User = {
  ...registerData,
  id: 1,
  role: 'USER',
  isActive: true,
};

describe('Auth Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(null);
      (bcrypt.hash as Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as Mock).mockResolvedValue(mockUser);

      const result = await registerUser(registerData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerData.email }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          fullName: registerData.fullName,
          birthDate: registerData.birthDate,
          email: registerData.email,
          password: 'hashedPassword',
          role: 'USER',
          isActive: true,
        },
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
      });
    });

    it('should throw error if user already exists', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);

      await expect(registerUser(registerData)).rejects.toMatchObject({
        message: 'User already exists',
        status: 409,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerData.email }
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as Mock).mockResolvedValue(true);
      (jwt.sign as Mock).mockReturnValue('jwt-token');
      process.env.JWT_SECRET = 'secret';

      const result = await loginUser(email, password);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: mockUser.id,
          role: mockUser.role,
        },
        'secret',
        { expiresIn: '1h' }
      );
      expect(result).toEqual({ token: 'jwt-token' });
    });

    it('should throw error if user not found', async () => {
      const email = 'gary@test.com';
      const password = '123456';

      (prisma.user.findUnique as Mock).mockResolvedValue(null);

      await expect(loginUser(email, password)).rejects.toMatchObject({
        message: 'Invalid credentials',
        status: 401,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error if user is blocked', async () => {
      (prisma.user.findUnique as Mock).mockResolvedValue({
        ...mockUser,
        isActive: false
      });

      await expect(loginUser(email, password)).rejects.toMatchObject({
        message: 'User is blocked',
        status: 403,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(loginUser(email, password)).rejects.toMatchObject({
        message: 'Invalid credentials',
        status: 401,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error if JWT_SECRET is not configured', async () => {
      const email = 'john@example.com';
      const password = 'password123';

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      delete process.env.JWT_SECRET;

      await expect(loginUser(email, password)).rejects.toMatchObject({
        message: 'JWT_SECRET is required',
        status: 500,
      });
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});