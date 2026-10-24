import { z } from 'zod';
import { authClient } from '@/src/lib/auth/session.ts';
import { managedUserSchema, type CreateUserForm, type ManagedUser, type UpdateUserForm } from '@/src/types/users/index.ts';

const BASE = '/admin/settings/users';

export const usersTransporter = {
  async list(): Promise<ManagedUser[]> {
    const { data } = await authClient.api.get<unknown>(BASE);
    return z.array(managedUserSchema).parse(data);
  },

  async create(input: CreateUserForm): Promise<ManagedUser> {
    // A API recusa campos que não conhece (isActive só existe na edição)
    const { email, displayName, role, password, capabilities, pages } = input;
    const { data } = await authClient.api.post<unknown>(BASE, { email, displayName, role, password, capabilities, pages });
    return managedUserSchema.parse(data);
  },

  async update(id: string, input: UpdateUserForm): Promise<ManagedUser> {
    const { data } = await authClient.api.patch<unknown>(`${BASE}/${id}`, input);
    return managedUserSchema.parse(data);
  },

  async resetPassword(id: string, password: string): Promise<void> {
    await authClient.api.post(`${BASE}/${id}/password`, { password });
  },
};
