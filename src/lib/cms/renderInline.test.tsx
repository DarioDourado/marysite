import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderInline } from './renderInline.tsx';

const html = (value: string) => {
  const { container } = render(<p>{renderInline(value)}</p>);
  return container.innerHTML;
};

describe('renderInline', () => {
  it('renders plain text with no extra DOM', () => {
    expect(html('Olá, mundo')).toBe('<p>Olá, mundo</p>');
  });

  it('renders allowed inline formatting', () => {
    expect(html('a <strong>b</strong> <em>c</em> <u>d</u>')).toBe('<p>a <strong>b</strong> <em>c</em> <u>d</u></p>');
  });

  it('decodes entities as text', () => {
    expect(html('Tom &amp; Jerry')).toBe('<p>Tom &amp; Jerry</p>');
  });

  it('drops scripts, event handlers and javascript: links', () => {
    const out = html('<script>alert(1)</script><a href="javascript:alert(1)" onclick="x()">l</a><img src=x onerror=1>');
    expect(out).not.toMatch(/script|onclick|onerror|javascript:|<img/);
  });

  it('adds noopener to links opened in a new tab', () => {
    expect(html('<a href="https://x.pt" target="_blank">x</a>')).toContain('rel="noopener noreferrer"');
  });
});
