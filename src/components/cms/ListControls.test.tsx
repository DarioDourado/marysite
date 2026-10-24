import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import { node, page, renderWithCms, section, text } from '@/src/test/harness.tsx';
import { ListAddButton, ListItemControls } from './ListControls.tsx';

vi.mock('@/src/services/transporters/cms/adminCmsTransporter.ts', () => ({
  adminCmsTransporter: { patchItem: vi.fn(), deleteItem: vi.fn(), reorder: vi.fn(), createItem: vi.fn() },
}));

const items = [
  text('item', 'A', 'text', { position: 0 }),
  text('item', 'B', 'text', { position: 1, isActive: false }),
  text('item', 'C', 'text', { position: 2 }),
];
const about = page('home', [section('about', [node('values', 'list', { children: items })])]);
const Harness = () => (
  <ul>
    {items.map((_, i) => (
      <li key={i}>
        {i}
        <ListItemControls listPath="about.values" index={i} />
      </li>
    ))}
    <ListAddButton listPath="about.values" as="li" />
  </ul>
);

describe('list controls', () => {
  beforeEach(() => {
    for (const fn of Object.values(adminCmsTransporter)) vi.mocked(fn).mockReset().mockResolvedValue(undefined as never);
  });

  it('render nothing outside edit mode', () => {
    const { container } = renderWithCms(<Harness />, { pages: [about] });
    expect(container.querySelectorAll('[role=button]')).toHaveLength(0);
  });

  it('render nothing without the structure capability', () => {
    renderWithCms(<Harness />, { pages: [about], edit: { enabled: true, can: (c) => c === 'text' } });
    expect(screen.queryByRole('button', { name: 'Remover' })).not.toBeInTheDocument();
  });

  it('disable moving the first item up and the last one down', () => {
    renderWithCms(<Harness />, { pages: [about], edit: { enabled: true } });
    const rows = screen.getAllByRole('listitem');
    expect(within(rows[0] as HTMLElement).getByRole('button', { name: 'Subir' })).toHaveAttribute('aria-disabled', 'true');
    expect(within(rows[2] as HTMLElement).getByRole('button', { name: 'Descer' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('send the full new order, including inactive items, when moving down', async () => {
    const user = userEvent.setup();
    renderWithCms(<Harness />, { pages: [about], edit: { enabled: true } });
    await user.click(within(screen.getAllByRole('listitem')[0] as HTMLElement).getByRole('button', { name: 'Descer' }));
    await waitFor(() => expect(adminCmsTransporter.reorder).toHaveBeenCalledWith([items[1]?.id, items[0]?.id, items[2]?.id]));
  });

  it('toggle active with the current version', async () => {
    const user = userEvent.setup();
    renderWithCms(<Harness />, { pages: [about], edit: { enabled: true } });
    await user.click(within(screen.getAllByRole('listitem')[0] as HTMLElement).getByRole('button', { name: 'Desativar' }));
    await waitFor(() => expect(adminCmsTransporter.patchItem).toHaveBeenCalledWith(items[0]?.id, { version: 3, isActive: false }));
  });

  it('mark inactive items', () => {
    renderWithCms(<Harness />, { pages: [about], edit: { enabled: true } });
    expect(within(screen.getAllByRole('listitem')[1] as HTMLElement).getByText('inativo')).toBeInTheDocument();
  });

  it('never delete without confirmation', async () => {
    const user = userEvent.setup();
    renderWithCms(<Harness />, { pages: [about], edit: { enabled: true } });
    await user.click(within(screen.getAllByRole('listitem')[0] as HTMLElement).getByRole('button', { name: 'Remover' }));
    expect(adminCmsTransporter.deleteItem).not.toHaveBeenCalled();
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }));
    expect(adminCmsTransporter.deleteItem).not.toHaveBeenCalled();
    await user.click(within(screen.getAllByRole('listitem')[0] as HTMLElement).getByRole('button', { name: 'Remover' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Remover' }));
    await waitFor(() => expect(adminCmsTransporter.deleteItem).toHaveBeenCalledWith(items[0]?.id));
  });

  it('add creates an item in the same section and list', async () => {
    const user = userEvent.setup();
    renderWithCms(<Harness />, { pages: [about], edit: { enabled: true } });
    await user.click(screen.getByRole('button', { name: /Adicionar/ }));
    await waitFor(() => expect(adminCmsTransporter.createItem).toHaveBeenCalledWith('s-about', 'id-values-0'));
  });
});
