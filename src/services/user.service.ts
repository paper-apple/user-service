import { checkAdminSelfBlock, checkUserAccess } from "../permissions/user.permissions";
import { prisma } from "../prisma/client";
import { AuthJwtPayload } from "../types/auth.types";
import { AppError } from "../utils/AppError";

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
  checkAdminSelfBlock(id, currentUser);

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("User is already blocked", 409);
  }

  return prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
};