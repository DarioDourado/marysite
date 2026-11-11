import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { cmsErrorKey } from './errorKey.ts';

const failure = (status: number, code?: string) =>
  new AxiosError('x', undefined, undefined, undefined, { status, data: code ? { code } : {} } as never);

describe('cmsErrorKey', () => {
  it('maps a wrong current password to its own message', () => {
    expect(cmsErrorKey(failure(400, 'INVALID_CURRENT_PASSWORD'))).toBe('admin.error.wrongPassword');
  });

  it('keeps the existing mappings', () => {
    expect(cmsErrorKey(failure(401))).toBe('admin.error.session');
    expect(cmsErrorKey(failure(403))).toBe('admin.error.forbidden');
    expect(cmsErrorKey(failure(409, 'EMAIL_TAKEN'))).toBe('admin.error.emailTaken');
    expect(cmsErrorKey(failure(422))).toBe('admin.error.invalid');
  });

  it('never exposes server text for unknown failures', () => {
    expect(cmsErrorKey(failure(400, 'SOMETHING_ELSE'))).toBe('admin.error.generic');
    expect(cmsErrorKey(new Error('boom'))).toBe('admin.error.generic');
  });
});
