export interface AuthJwtPayload {
  userId: number;
  role: "ADMIN" | "USER";
}