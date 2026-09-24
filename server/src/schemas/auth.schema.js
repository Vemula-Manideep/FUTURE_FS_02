const { z } = require("zod");
const { roles } = require("../models/User");

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.email(),
    password: z.string().min(8).max(128),
    role: z.enum(roles).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({ email: z.email() }),
});

module.exports = { registerSchema, loginSchema, forgotPasswordSchema };
