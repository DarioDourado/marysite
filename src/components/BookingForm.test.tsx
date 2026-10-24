import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BookingForm } from './BookingForm.tsx';
import { page, renderWithCms, section, text } from '@/src/test/harness.tsx';

const submit = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/transporters/submissions/index.ts', () => ({ submissionsTransporter: { submit } }));

const pages = [
  page('home', [
    section('bookingForm', [
      text('name', '', 'group'), text('submit', 'Pedir Marcação'), text('success', 'Pedido enviado!'),
      text('scheduleTitle', 'Preferência'), text('morning', 'Manhã'), text('afternoon', 'Tarde'), text('noPreference', 'Sem preferência'),
    ]),
  ]),
];

const fill = async () => {
  const user = userEvent.setup();
  await user.type(document.getElementById('booking-name') as HTMLElement, 'Ana Silva');
  await user.type(document.getElementById('booking-email') as HTMLElement, 'ana@example.com');
  await user.type(document.getElementById('booking-phone') as HTMLElement, '912345678');
  await user.type(document.getElementById('booking-reason') as HTMLElement, 'Ansiedade');
  await user.click(screen.getByLabelText('Tarde'));
  await user.click(screen.getByLabelText('Manhã'));
  return user;
};

describe('BookingForm', () => {
  afterEach(() => {
    submit.mockReset();
    vi.restoreAllMocks();
  });

  it('sends the request to the API, confirms and clears the form', async () => {
    submit.mockResolvedValue(undefined);
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    renderWithCms(<BookingForm />, { pages });
    const user = await fill();
    await user.click(screen.getByRole('button', { name: 'Pedir Marcação' }));

    await waitFor(() => expect(alert).toHaveBeenCalledWith('Pedido enviado!'));
    expect(submit).toHaveBeenCalledWith({
      kind: 'booking', name: 'Ana Silva', email: 'ana@example.com', phone: '912345678', message: 'Ansiedade',
      schedule: ['morning', 'afternoon'], scheduleDetails: '', website: '',
    });
    expect((document.getElementById('booking-name') as HTMLInputElement).value).toBe('');
  });

  it('keeps what was typed and warns when sending fails', async () => {
    submit.mockRejectedValue(new Error('network'));
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    renderWithCms(<BookingForm />, { pages });
    const user = await fill();
    await user.click(screen.getByRole('button', { name: 'Pedir Marcação' }));

    await waitFor(() => expect(alert).toHaveBeenCalledWith(expect.stringContaining('Não foi possível enviar')));
    expect((document.getElementById('booking-name') as HTMLInputElement).value).toBe('Ana Silva');
  });
});
