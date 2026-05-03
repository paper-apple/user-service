import { prisma } from "../prisma/client";
import { AuthJwtPayload } from "../types/auth.types";
import { AppError } from "../utils/AppError";

const checkUserAccess = (
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

export const getUserByIdService = async (id: number, currentUser: AuthJwtPayload) => {
  checkUserAccess(id, currentUser);

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
  };
};

export const getUsersService = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
    },
  });
};

export const blockUserService = async (id: number, currentUser: AuthJwtPayload) => {
  checkUserAccess(id, currentUser);

  return prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
};