import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import { node, page, renderWithCms, section, text } from '@/src/test/harness.tsx';
import { Cms } from './Cms.tsx';

vi.mock('@/src/services/transporters/cms/adminCmsTransporter.ts', () => ({
  adminCmsTransporter: { patchItem: vi.fn() },
}));

const home = page('home', [section('hero', [text('title', 'Olá'), text('intro', 'a <strong>b</strong>', 'inline')])]);

describe('Cms', () => {
  beforeEach(() => {
    vi.mocked(adminCmsTransporter.patchItem).mockReset().mockResolvedValue(node('title', 'text'));
  });

  it('renders only the text, with no extra elements, outside edit mode', () => {
    const { container } = renderWithCms(<h1><Cms k="hero.title" /></h1>, { pages: [home] });
    expect(container.innerHTML).toBe('<h1>Olá</h1>');
  });

  it('renders inline formatting as elements, not as escaped markup', () => {
    const { container } = renderWithCms(<p><Cms k="hero.intro" /></p>, { pages: [home] });
    expect(container.innerHTML).toBe('<p>a <strong>b</strong></p>');
  });

  it('shows a pencil in edit mode when the user can edit text on that page', () => {
    renderWithCms(<h1><Cms k="hero.title" /></h1>, { pages: [home], edit: { enabled: true } });
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });

  it('shows no pencil without the text capability for the page', () => {
    const can = vi.fn((capability: string, slug: string) => capability === 'images' && slug === 'home');
    renderWithCms(<h1><Cms k="hero.title" /></h1>, { pages: [home], edit: { enabled: true, can } });
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
    expect(can).toHaveBeenCalledWith('text', 'home');
  });

  it('shows no pencil when edit mode is off, even for editors', () => {
    renderWithCms(<h1><Cms k="hero.title" /></h1>, { pages: [home], edit: { enabled: false } });
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
  });

  it('opens an in-place field and saves the new value with the item version', async () => {
    const user = userEvent.setup();
    renderWithCms(<h1><Cms k="hero.title" /></h1>, { pages: [home], edit: { enabled: true } });
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    const field = screen.getByRole('textbox', { name: 'Texto' });
    expect(field).toHaveValue('Olá');
    await user.clear(field);
    await user.type(field, 'Novo');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    await waitFor(() => expect(adminCmsTransporter.patchItem).toHaveBeenCalledWith('id-title-0', { version: 3, locale: 'pt', value: 'Novo' }));
  });

  it('cancel closes the field without saving', async () => {
    const user = userEvent.setup();
    renderWithCms(<h1><Cms k="hero.title" /></h1>, { pages: [home], edit: { enabled: true } });
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    await user.type(screen.getByRole('textbox', { name: 'Texto' }), 'x');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(adminCmsTransporter.patchItem).not.toHaveBeenCalled();
  });

  it('reports a save failure through notify and keeps the field open', async () => {
    const user = userEvent.setup();
    const notify = vi.fn();
    vi.mocked(adminCmsTransporter.patchItem).mockRejectedValue(new Error('boom'));
    renderWithCms(<h1><Cms k="hero.title" /></h1>, { pages: [home], edit: { enabled: true, notify } });
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    await waitFor(() => expect(notify).toHaveBeenCalledWith('error', 'admin.error.generic'));
    expect(screen.getByRole('textbox', { name: 'Texto' })).toBeInTheDocument();
  });
});
