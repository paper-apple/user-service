import request from 'supertest';
import { beforeEach, afterAll, describe, expect, it } from 'vitest';
import { createTestUser } from '../helpers/user.factory';
import app from '@/app';
import { prisma } from '@/prisma/client';
import { generateTestToken } from '../helpers/token';

describe('Users API', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('GET /users/:id', () => {
    it('should return user profile for owner', async () => {
      const user = await createTestUser();

      const token = generateTestToken({
        userId: user.id,
        role: user.role,
      });

      const response = await request(app)
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: true,
      });
    });

    it('should return 403 if wrong token', async () => {
      const user1 = await createTestUser({
        email: 'user1@test.com',
      });

      const user2 = await createTestUser({
        email: 'user2@test.com',
      });

      const token = generateTestToken({
        userId: user1.id,
        role: 'USER',
      });

      const response = await request(app)
        .get(`/users/${user2.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        error: 'Access denied',
        details: null,
      });
    });

    it('should return 401 without token', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get(`/users/${user.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /users', () => {
    it('should return all users for admin', async () => {
      await createTestUser({
        email: 'user1@test.com',
      });

      await createTestUser({
        email: 'user2@test.com',
      });

      const admin = await createTestUser({
        email: 'admin@test.com',
        role: 'ADMIN',
      });

      const token = generateTestToken({
        userId: admin.id,
        role: 'ADMIN',
      });


      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(3);
    });
  });

  describe('PATCH /users/:id/block', () => {
    it('should block user successfully', async () => {
      const admin = await createTestUser({
        email: 'admin@test.com',
        role: 'ADMIN',
      });

      const user = await createTestUser({
        email: 'user@test.com',
      });

      const token = generateTestToken({
        userId: admin.id,
        role: 'ADMIN',
      });

      const response = await request(app)
        .patch(`/users/${user.id}/block`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      const updatedUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      expect(updatedUser?.isActive).toBe(false);
    });

    it('should prevent admin self-block', async () => {
      const admin = await createTestUser({
        email: 'admin@test.com',
        role: 'ADMIN',
      });

      const token = generateTestToken({
        userId: admin.id,
        role: 'ADMIN',
      });

      const response = await request(app)
        .patch(`/users/${admin.id}/block`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        error: 'Admin cannot block himself',
        details: null,
      });
    });

    it('should return 409 when trying to block an already blocked user', async () => {
      const admin = await createTestUser({
        email: 'admin@test.com',
        role: 'ADMIN',
      });
      
      const token = generateTestToken({
        userId: admin.id,
        role: 'ADMIN',
      });

      const user = await createTestUser({
        email: 'user@test.com',
      });

      await request(app)
        .patch(`/users/${user.id}/block`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const response = await request(app)
        .patch(`/users/${user.id}/block`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('User is already blocked');
    });
  });
});