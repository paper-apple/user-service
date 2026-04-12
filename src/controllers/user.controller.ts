import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getUserByIdService,
  getUsersService,
  blockUserService,
} from "../services/user.service";

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.params.id); // params = body

    const result = await getUserByIdService(userId, req.user);

    res.json(result);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  const users = await getUsersService();
  res.json(users);
};

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const result = await blockUserService(userId, req.user);

    res.json(result);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};