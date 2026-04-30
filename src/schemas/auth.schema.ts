import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must contain at least 2 characters")
    .max(100, "Full name is too long"),

  birthDate: z.coerce.date({error: "Invalid date"}),
  
  email: z.email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters")
    .max(100, "Password is too long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});