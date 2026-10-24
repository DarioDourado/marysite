import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RequireAuth } from './RequireAuth.tsx';
import type { AuthUser } from '@/src/types/auth/index.ts';

const auth = vi.hoisted(() => ({ value: { user: null as AuthUser | null, isLoading: false } }));
vi.mock('@/src/hooks/auth/index.ts', () => ({ useAuth: () => auth.value }));

const user = (over: Partial<AuthUser>): AuthUser => ({
  id: 'u', email: 'e@x.pt', displayName: 'E', role: 'editor', capabilities: ['text'], pages: ['home'], ...over,
});

function renderAt(guard: Parameters<typeof RequireAuth>[0]['superuserOnly'], capability?: 'images') {
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route path="/secret" element={<RequireAuth {...(guard ? { superuserOnly: true } : {})} {...(capability ? { capability } : {})}>segredo</RequireAuth>} />
        <Route path="/admin/login" element={<p>login</p>} />
        <Route path="/" element={<p>site</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  it('redirects anonymous visitors to the login page', () => {
    auth.value = { user: null, isLoading: false };
    renderAt(false);
    expect(screen.getByText('login')).toBeInTheDocument();
    expect(screen.queryByText('segredo')).not.toBeInTheDocument();
  });

  it('shows nothing while the session is being restored', () => {
    auth.value = { user: null, isLoading: true };
    renderAt(false);
    expect(screen.queryByText('login')).not.toBeInTheDocument();
    expect(screen.queryByText('segredo')).not.toBeInTheDocument();
  });

  it('keeps non-superusers out of superuser pages', () => {
    auth.value = { user: user({ role: 'admin' }), isLoading: false };
    renderAt(true);
    expect(screen.getByText('site')).toBeInTheDocument();
  });

  it('lets a superuser in', () => {
    auth.value = { user: user({ role: 'superuser' }), isLoading: false };
    renderAt(true);
    expect(screen.getByText('segredo')).toBeInTheDocument();
  });

  it('requires the capability when one is requested', () => {
    auth.value = { user: user({ capabilities: ['text'] }), isLoading: false };
    renderAt(false, 'images');
    expect(screen.getByText('site')).toBeInTheDocument();
    auth.value = { user: user({ capabilities: ['images'] }), isLoading: false };
    renderAt(false, 'images');
    expect(screen.getByText('segredo')).toBeInTheDocument();
  });

  it('keeps editors out of staff-only pages but lets admin and superuser in', () => {
    const renderStaff = () =>
      render(
        <MemoryRouter initialEntries={['/pedidos']}>
          <Routes>
            <Route path="/pedidos" element={<RequireAuth staffOnly>pedidos</RequireAuth>} />
            <Route path="/" element={<p>site</p>} />
          </Routes>
        </MemoryRouter>,
      );
    auth.value = { user: user({ role: 'editor', capabilities: ['text', 'images', 'structure'] }), isLoading: false };
    const editor = renderStaff();
    expect(screen.getByText('site')).toBeInTheDocument();
    editor.unmount();
    for (const role of ['admin', 'superuser'] as const) {
      auth.value = { user: user({ role }), isLoading: false };
      const view = renderStaff();
      expect(screen.getByText('pedidos')).toBeInTheDocument();
      view.unmount();
    }
  });
});
