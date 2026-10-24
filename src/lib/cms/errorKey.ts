import axios from 'axios';

/** Mensagem nossa para cada falha da API; nunca texto vindo do servidor. */
export const cmsErrorKey = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return 'admin.error.generic';
  const status = error.response?.status;
  const code = (error.response?.data as { code?: string } | undefined)?.code;
  if (status === 401) return 'admin.error.session';
  if (status === 403) return 'admin.error.forbidden';
  if (status === 409 && code === 'STALE_VERSION') return 'admin.error.stale';
  if (status === 409 && code === 'MEDIA_IN_USE') return 'admin.error.mediaInUse';
  if (status === 409 && code === 'LAST_SUPERUSER') return 'admin.error.lastSuperuser';
  if (status === 409 && code === 'EMAIL_TAKEN') return 'admin.error.emailTaken';
  if (status === 413) return 'admin.error.tooLarge';
  if (status === 415) return 'admin.error.unsupportedType';
  if (status === 422) return 'admin.error.invalid';
  return 'admin.error.generic';
};
