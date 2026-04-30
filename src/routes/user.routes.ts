import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import {
  getUserById,
  getUsers,
  blockUser,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { userIdSchema } from "../schemas/user.schema";

export const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Access denied
 */
userRouter.get(
  "/:id",
  authMiddleware,
  validate(userIdSchema, "params"),
  getUserById
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getUsers
);

/**
 * @swagger
 * /users/{id}/block:
 *   patch:
 *     summary: Block user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User blocked
 */
userRouter.patch(
  "/:id/block",
  authMiddleware,
  validate(userIdSchema, "params"),
  blockUser
);