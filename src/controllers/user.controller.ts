import { Response } from "express";
import {
  getUserByIdService,
  getUsersService,
  blockUserService,
} from "../services/user.service";
import { AuthRequest } from "../types/express.types";

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = Number(req.params.id); // params = body

    const result = await getUserByIdService(userId, req.user);

    res.json(result);
  } catch (error) {
    res.status(403).json({
      message: (error as Error).message,
    });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  const users = await getUsersService();
  res.json(users);
};

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = Number(req.params.id);

    const result = await blockUserService(userId, req.user);

    res.json(result);
  } catch (error) {
    res.status(403).json({
      message: (error as Error).message,
    });
  }
};