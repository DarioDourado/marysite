import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import i18n from '@/src/lib/i18n.ts';
import { PermissionMatrix } from './PermissionMatrix.tsx';

const setup = (props: Partial<Parameters<typeof PermissionMatrix>[0]> = {}) => {
  const onChange = vi.fn();
  void i18n.changeLanguage('pt');
  render(
    <I18nextProvider i18n={i18n}>
      <PermissionMatrix capabilities={['text']} pages={['home']} onChange={onChange} disabled={false} {...props} />
    </I18nextProvider>,
  );
  return onChange;
};

describe('PermissionMatrix', () => {
  it('reflects the granted capabilities and pages', () => {
    setup();
    expect(screen.getByRole('checkbox', { name: 'Texto' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Imagens' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Início' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Blog' })).not.toBeChecked();
  });

  it('adds a capability keeping the pages', async () => {
    const onChange = setup();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Imagens' }));
    expect(onChange).toHaveBeenCalledWith({ capabilities: ['text', 'images'], pages: ['home'] });
  });

  it('removes a page keeping the capabilities', async () => {
    const onChange = setup();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Início' }));
    expect(onChange).toHaveBeenCalledWith({ capabilities: ['text'], pages: [] });
  });

  it('is disabled for a superuser, who always has everything', () => {
    setup({ disabled: true });
    expect(screen.getByRole('checkbox', { name: 'Texto' })).toBeDisabled();
    expect(screen.getByText('O superuser tem sempre acesso a tudo.')).toBeInTheDocument();
  });
});
