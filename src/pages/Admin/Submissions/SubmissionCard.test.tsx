import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import i18n from '@/src/lib/i18n.ts';
import type { Submission } from '@/src/types/submissions/index.ts';
import { SubmissionCard } from './SubmissionCard.tsx';

const base: Submission = {
  id: 's1', kind: 'booking', status: 'new', name: 'Ana Silva', email: 'ana@example.com', phone: '912 345 678',
  subject: null, message: 'Ansiedade no trabalho', schedule: ['morning', 'noPreference'], scheduleDetails: 'Só às terças',
  createdAt: '2026-10-24T11:57:00', statusChangedAt: null, handledByName: null,
};

const setup = (over: Partial<Submission> = {}) => {
  const onStatus = vi.fn();
  const onDelete = vi.fn();
  render(
    <I18nextProvider i18n={i18n}>
      <ul><SubmissionCard submission={{ ...base, ...over }} disabled={false} onStatus={onStatus} onDelete={onDelete} /></ul>
    </I18nextProvider>,
  );
  return { onStatus, onDelete };
};

describe('SubmissionCard', () => {
  it('shows the person, contact links, schedule and message of a booking', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Ana Silva' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ana@example.com' })).toHaveAttribute('href', 'mailto:ana@example.com');
    expect(screen.getByRole('link', { name: '912 345 678' })).toHaveAttribute('href', 'tel:912345678');
    expect(screen.getByText('Dias úteis: 10h-13h · Sem preferência de horário')).toBeInTheDocument();
    expect(screen.getByText('Ansiedade no trabalho')).toBeInTheDocument();
    expect(screen.getByText('Só às terças')).toBeInTheDocument();
    expect(screen.getByText('Marcação')).toBeInTheDocument();
  });

  it('renders message text as plain text (never as HTML)', () => {
    setup({ kind: 'contact', phone: null, message: '<img src=x onerror=alert(1)>' });
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });

  it('offers the next status for each state and asks to delete', async () => {
    const user = userEvent.setup();
    const { onStatus, onDelete } = setup();
    await user.click(screen.getByRole('button', { name: 'Marcar como lido' }));
    expect(onStatus).toHaveBeenCalledWith('s1', 'read');
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ id: 's1' }));
  });

  it('read items can be archived; archived items can be reopened', () => {
    setup({ status: 'read' });
    expect(screen.getByRole('button', { name: 'Arquivar' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Marcar como lido' })).toBeNull();
  });
});
