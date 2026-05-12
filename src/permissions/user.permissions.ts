import { AuthJwtPayload } from "../types/auth.types";
import { AppError } from "../utils/AppError";

export const checkUserAccess = (
  targetUserId: number,
  currentUser: AuthJwtPayload
) => {
  if (
    currentUser.role !== "ADMIN" &&
    currentUser.userId !== targetUserId
  ) {
    throw new AppError("Access denied", 403);
  }
};

export const checkAdminSelfBlock = (
  targetUserId: number,
  currentUser: AuthJwtPayload
) => {
  const isAdmin = currentUser.role === "ADMIN";
  const isSelf = currentUser.userId === targetUserId;

  if (isAdmin && isSelf) {
    throw new AppError("Admin cannot block himself", 403);
  }
};