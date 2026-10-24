import { z } from 'zod';
import { capabilitySchema, roleSchema } from '@/src/types/auth/index.ts';
import { PAGE_SLUGS } from '@/src/types/cms/index.ts';

export const managedUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
  role: roleSchema,
  isActive: z.boolean(),
  capabilities: z.array(capabilitySchema),
  pages: z.array(z.string()),
});
export type ManagedUser = z.infer<typeof managedUserSchema>;

const baseFormSchema = z.object({
  displayName: z.string().min(1, 'validation.required').max(120),
  role: roleSchema,
  isActive: z.boolean(),
  capabilities: z.array(capabilitySchema),
  pages: z.array(z.enum(PAGE_SLUGS)),
});

// Mesmo tipo de saída nos dois modos: na edição e-mail e password não se pedem
export const userFormSchema = (isEdit: boolean) =>
  baseFormSchema.extend({
    email: isEdit ? z.string() : z.string().min(1, 'validation.required').email('validation.email'),
    password: isEdit ? z.string() : z.string().min(10, 'validation.password').max(256),
  });

export type UserFormValues = z.infer<ReturnType<typeof userFormSchema>>;
export type CreateUserForm = UserFormValues;
export type UpdateUserForm = z.infer<typeof baseFormSchema>;

export const passwordResetSchema = z.object({ password: z.string().min(10, 'validation.password').max(256) });
export type PasswordResetForm = z.infer<typeof passwordResetSchema>;

// Predefinição por role ao criar; o superuser ajusta depois (igual à da API)
export const ROLE_DEFAULTS = {
  admin: ['text', 'images', 'structure'],
  editor: ['text'],
  superuser: [],
} as const;
