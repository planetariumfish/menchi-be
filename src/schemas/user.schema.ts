import { Role } from "@prisma/client";
import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstname: z.optional(z.string()),
  lastname: z.optional(z.string()),
  role: z.nativeEnum(Role),
  phone: z.optional(z.string()),
  bio: z.optional(z.string()),
  password: z.string().min(8).max(32),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});
