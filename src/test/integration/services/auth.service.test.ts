import app from '@/app';
import { prisma } from '@/prisma/client';
import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUser } from '../helpers/user.factory';

describe('Auth API', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /auth/register', () => {
    it('should register user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          fullName: 'Gary',
          birthDate: '1990-01-01',
          email: 'gary@test.com',
          password: '123456',
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        email: 'gary@test.com',
        fullName: 'Gary',
      });

      const userInDb = await prisma.user.findUnique({
        where: {
          email: 'gary@test.com',
        },
      });

      expect(userInDb).not.toBeNull();

      expect(userInDb?.password).not.toBe('123456');
    });

    it('should return 409 if user already exists', async () => {
      await createTestUser({});

      const response = await request(app)
        .post('/auth/register')
        .send({
          fullName: 'Gary',
          birthDate: '1990-01-01',
          email: 'gary@test.com',
          password: '123456',
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        error: 'User already exists',
        details: null,
      });
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      await createTestUser({});

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'gary@test.com',
          password: '123456',
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        token: expect.any(String),
      });
    });

    it('should return 401 for wrong password', async () => {
      await createTestUser({});

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'gary@test.com',
          password: 'wrong',
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        error: 'Invalid credentials',
        details: null,
      });
    });

    it('should return 401 if user does not exist', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'gary@test.com',
          password: '123456',
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        error: 'Invalid credentials',
        details: null,
      });
    });

    it('should return 403 if user is blocked', async () => {
      await createTestUser({
        isActive: false,
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'gary@test.com',
          password: '123456',
        });

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        error: 'User is blocked',
        details: null,
      });
    });
  });
});