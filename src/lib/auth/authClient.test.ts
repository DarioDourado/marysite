import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAuthClient } from './authClient.ts';

const user = { id: 'u1', email: 'a@b.pt', displayName: 'A', role: 'editor', capabilities: ['text'], pages: ['home'] };
type Reply = { status: number; data?: unknown };
type Handler = (config: InternalAxiosRequestConfig) => Reply | Promise<Reply>;

function setup(routes: Record<string, Handler>) {
  const calls: string[] = [];
  const adapter: AxiosAdapter = async (config) => {
    const key = `${config.method} ${config.url}`;
    calls.push(key);
    const handler = routes[key];
    if (!handler) throw new Error(`unexpected request ${key}`);
    const { status, data } = await handler(config);
    const response = { data, status, statusText: '', headers: {}, config };
    if (status >= 200 && status < 300) return response;
    throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, null, response);
  };
  const clearPrivateData = vi.fn();
  const client = createAuthClient({ baseURL: '/api/v1', adapter, clearPrivateData });
  return { client, calls, clearPrivateData };
}

const session = { accessToken: 'tok1', user };

describe('auth client', () => {
  beforeEach(() => window.localStorage.clear());

  it('keeps the access token in memory only', async () => {
    const { client } = setup({ 'post /auth/login': () => ({ status: 200, data: session }) });
    await client.login({ email: 'a@b.pt', password: 'x' });
    expect(client.getAccessToken()).toBe('tok1');
    expect(client.getUser()?.displayName).toBe('A');
    expect(JSON.stringify({ ...window.localStorage })).not.toContain('tok1');
    expect(JSON.stringify({ ...window.sessionStorage })).not.toContain('tok1');
  });

  it('sends the CSRF header on auth calls', async () => {
    let header: unknown;
    const { client } = setup({
      'post /auth/login': (config) => {
        header = config.headers.get('X-Requested-With');
        return { status: 200, data: session };
      },
    });
    await client.login({ email: 'a@b.pt', password: 'x' });
    expect(header).toBe('fetch');
  });

  it('a failed login never triggers a refresh', async () => {
    const { client, calls } = setup({ 'post /auth/login': () => ({ status: 401 }) });
    await expect(client.login({ email: 'a@b.pt', password: 'bad' })).rejects.toBeTruthy();
    expect(calls).toEqual(['post /auth/login']);
    expect(client.getUser()).toBeNull();
  });

  it('concurrent 401s share one refresh and each request is retried once', async () => {
    let refreshes = 0;
    const { client, calls } = setup({
      'post /auth/login': () => ({ status: 200, data: session }),
      'post /auth/refresh': async () => {
        refreshes++;
        return { status: 200, data: { accessToken: 'tok2' } };
      },
      'get /a': (config) => (config.headers.get('Authorization') === 'Bearer tok2' ? { status: 200, data: 'a' } : { status: 401 }),
      'get /b': (config) => (config.headers.get('Authorization') === 'Bearer tok2' ? { status: 200, data: 'b' } : { status: 401 }),
    });
    await client.login({ email: 'a@b.pt', password: 'x' });
    const [a, b] = await Promise.all([client.api.get('/a'), client.api.get('/b')]);
    expect([a.data, b.data]).toEqual(['a', 'b']);
    expect(refreshes).toBe(1);
    expect(calls.filter((c) => c === 'get /a')).toHaveLength(2);
    expect(client.getAccessToken()).toBe('tok2');
  });

  it('clears the session and private data when refresh fails', async () => {
    const { client, clearPrivateData } = setup({
      'post /auth/login': () => ({ status: 200, data: session }),
      'post /auth/refresh': () => ({ status: 401 }),
      'get /a': () => ({ status: 401 }),
    });
    await client.login({ email: 'a@b.pt', password: 'x' });
    clearPrivateData.mockClear();
    await expect(client.api.get('/a')).rejects.toBeTruthy();
    expect(client.getUser()).toBeNull();
    expect(client.getAccessToken()).toBeNull();
    expect(clearPrivateData).toHaveBeenCalled();
  });

  it('restore without a valid cookie ends logged out without throwing', async () => {
    const { client } = setup({ 'post /auth/session': () => ({ status: 401 }) });
    await expect(client.restore()).resolves.toBeUndefined();
    expect(client.getUser()).toBeNull();
  });

  it('restore loads the user from the session cookie', async () => {
    const { client } = setup({ 'post /auth/session': () => ({ status: 200, data: session }) });
    await client.restore();
    expect(client.getUser()?.id).toBe('u1');
  });

  it('logout clears locally first and revokes remotely', async () => {
    const { client, calls, clearPrivateData } = setup({
      'post /auth/login': () => ({ status: 200, data: session }),
      'post /auth/logout': () => ({ status: 204 }),
    });
    await client.login({ email: 'a@b.pt', password: 'x' });
    clearPrivateData.mockClear();
    await client.logout();
    expect(calls.at(-1)).toBe('post /auth/logout');
    expect(client.getUser()).toBeNull();
    expect(clearPrivateData).toHaveBeenCalled();
  });

  it('rejects a malformed login response', async () => {
    const { client } = setup({ 'post /auth/login': () => ({ status: 200, data: { accessToken: 'x' } }) });
    await expect(client.login({ email: 'a@b.pt', password: 'x' })).rejects.toBeTruthy();
    expect(client.getUser()).toBeNull();
  });
});
