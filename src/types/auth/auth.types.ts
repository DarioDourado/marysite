import { z } from 'zod';

export const capabilitySchema = z.enum(['text', 'images', 'structure']);
export type Capability = z.infer<typeof capabilitySchema>;

export const roleSchema = z.enum(['admin', 'superuser', 'editor']);
export type Role = z.infer<typeof roleSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
  role: roleSchema,
  capabilities: z.array(capabilitySchema),
  pages: z.array(z.string()),
});
export type AuthUser = z.infer<typeof authUserSchema>;

export const sessionSchema = z.object({ accessToken: z.string().min(1), user: authUserSchema });
export const tokenSchema = z.object({ accessToken: z.string().min(1) });

export const loginSchema = z.object({
  email: z.string().min(1, 'validation.required').email('validation.email'),
  password: z.string().min(1, 'validation.required'),
});
export type LoginInput = z.infer<typeof loginSchema>;
