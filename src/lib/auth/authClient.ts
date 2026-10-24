import axios, { AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import { sessionSchema, tokenSchema, type AuthUser, type LoginInput } from '@/src/types/auth/index.ts';

type Request = InternalAxiosRequestConfig & { _retry?: boolean; _generation?: number };

interface Options {
  baseURL: string;
  adapter?: AxiosAdapter;
  clearPrivateData: () => void;
}

// Pedidos que usam o cookie de refresh exigem este cabeçalho (defesa CSRF da API)
const CSRF_HEADER = { 'X-Requested-With': 'fetch' };

/**
 * Cliente de sessão: access token só em memória, refresh em cookie httpOnly.
 * Adaptado de `.agents/08-auth/references/auth-client.ts` ao contrato da API:
 * `/auth/login`, `/auth/session`, `/auth/refresh`, `/auth/logout`.
 */
export function createAuthClient({ baseURL, adapter, clearPrivateData }: Options) {
  const config = {
    baseURL,
    withCredentials: true,
    timeout: 15_000,
    headers: CSRF_HEADER,
    ...(adapter ? { adapter } : {}),
  };
  const api = axios.create(config);
  const authApi = axios.create(config);
  let generation = 0;
  let accessToken: string | null = null;
  let user: AuthUser | null = null;
  let controller = new AbortController();
  let refreshFlight: Promise<string> | null = null;
  let restoreFlight: Promise<void> | null = null;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  function clearSession() {
    generation++;
    controller.abort();
    controller = new AbortController();
    refreshFlight = null;
    restoreFlight = null;
    accessToken = null;
    user = null;
    clearPrivateData();
    notify();
  }

  function requireCurrent(expected: number) {
    if (expected !== generation) throw new axios.CanceledError('Session changed');
  }

  function refresh() {
    if (refreshFlight) return refreshFlight;
    const expected = generation;
    const flight = authApi
      .post<unknown>('/auth/refresh', {}, { signal: controller.signal })
      .then(({ data }) => {
        requireCurrent(expected);
        const parsed = tokenSchema.safeParse(data);
        // /auth/refresh devolve a sessão completa; só o token interessa aqui
        const token = parsed.success ? parsed.data.accessToken : sessionSchema.parse(data).accessToken;
        accessToken = token;
        return token;
      })
      .finally(() => {
        if (refreshFlight === flight) refreshFlight = null;
      });
    refreshFlight = flight;
    return flight;
  }

  api.interceptors.request.use((request: Request) => {
    if (request._generation !== undefined) requireCurrent(request._generation);
    request._generation = generation;
    request.signal ??= controller.signal;
    if (accessToken) request.headers.set('Authorization', `Bearer ${accessToken}`);
    return request;
  });
  api.interceptors.response.use(
    (response) => {
      requireCurrent((response.config as Request)._generation ?? generation);
      return response;
    },
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) throw error;
      const request = error.config as Request;
      const expected = request._generation ?? generation;
      requireCurrent(expected);
      if (error.response?.status !== 401 || request._retry) throw error;
      request._retry = true;
      try {
        // Um 401 atrasado de um token antigo reutiliza o token já renovado
        const sent = AxiosHeaders.from(request.headers).get('Authorization');
        const token = accessToken && sent !== `Bearer ${accessToken}` ? accessToken : await refresh();
        requireCurrent(expected);
        request.headers.set('Authorization', `Bearer ${token}`);
        return api(request);
      } catch (refreshError) {
        if (expected === generation) clearSession();
        throw refreshError;
      }
    },
  );

  return {
    api,
    getAccessToken: () => accessToken,
    getUser: () => user,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    clearSession,
    async login(input: LoginInput) {
      clearSession();
      const expected = generation;
      const { data } = await authApi.post<unknown>('/auth/login', input, { signal: controller.signal });
      requireCurrent(expected);
      const session = sessionSchema.parse(data);
      accessToken = session.accessToken;
      user = session.user;
      notify();
    },
    restore() {
      if (restoreFlight) return restoreFlight;
      const expected = generation;
      const flight = authApi
        .post<unknown>('/auth/session', {}, { signal: controller.signal })
        .then(({ data }) => {
          requireCurrent(expected);
          const session = sessionSchema.parse(data);
          accessToken = session.accessToken;
          user = session.user;
          notify();
        })
        .catch((error: unknown) => {
          if (expected === generation) clearSession();
          if (!axios.isCancel(error) && !(axios.isAxiosError(error) && error.response?.status === 401)) {
            throw error;
          }
        })
        .finally(() => {
          if (restoreFlight === flight) restoreFlight = null;
        });
      restoreFlight = flight;
      return flight;
    },
    async logout() {
      const token = accessToken;
      clearSession();
      // O logout local é imediato; falha da revogação remota é mostrada pela UI
      await authApi.post('/auth/logout', {}, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    },
  };
}

export type AuthClient = ReturnType<typeof createAuthClient>;
