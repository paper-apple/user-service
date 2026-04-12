import { prisma } from "../prisma/client";

export const getUserByIdService = async (id: number, currentUser: any) => {
  if (currentUser.role !== "ADMIN" && currentUser.userId !== id) {
    throw new Error("Access denied");
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
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

export const blockUserService = async (id: number, currentUser: any) => {
  if (currentUser.role !== "ADMIN" && currentUser.userId !== id) {
    throw new Error("Access denied");
  }

  return prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
};