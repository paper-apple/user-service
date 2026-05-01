export interface JwtPayload {
  userId: number;
  role: "ADMIN" | "USER";
}