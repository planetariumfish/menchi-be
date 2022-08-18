import { Role } from "@prisma/client";
import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string().optional(),
  role: z.nativeEnum(Role),
  phone: z.string().optional(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  password: z.string().min(8).max(32),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});
