import { authClient } from '@/src/lib/auth/session.ts';
import { publicApi } from '@/src/services/http/publicApi.ts';
import {
  submissionPageSchema,
  submissionSchema,
  type Submission,
  type SubmissionFilters,
  type SubmissionInput,
  type SubmissionPage,
  type SubmissionStatus,
} from '@/src/types/submissions/index.ts';

const PAGE_SIZE = 20;

export const submissionsTransporter = {
  /** Formulários públicos (sem sessão). */
  async submit(input: SubmissionInput): Promise<void> {
    await publicApi.post('/public/submissions', input);
  },

  async list(filters: SubmissionFilters, cursor?: string): Promise<SubmissionPage> {
    const { data } = await authClient.api.get<unknown>('/admin/submissions', {
      params: {
        kind: filters.kind || undefined,
        status: filters.status || undefined,
        q: filters.q || undefined,
        limit: PAGE_SIZE,
        cursor,
      },
    });
    return submissionPageSchema.parse(data);
  },

  /** Só o contador de novos (para o aviso na barra de edição). */
  async newCount(): Promise<number> {
    const { data } = await authClient.api.get<unknown>('/admin/submissions', { params: { limit: 1, status: 'new' } });
    return submissionPageSchema.parse(data).newCount;
  },

  async setStatus(id: string, status: SubmissionStatus): Promise<Submission> {
    const { data } = await authClient.api.patch<unknown>(`/admin/submissions/${id}`, { status });
    return submissionSchema.parse(data);
  },

  async remove(id: string): Promise<void> {
    await authClient.api.delete(`/admin/submissions/${id}`);
  },
};
