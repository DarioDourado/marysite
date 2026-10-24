import { createElement, type ReactNode } from 'react';
import { sanitizeInline } from './sanitize.ts';

const toReact = (node: Node, key: number): ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (!(node instanceof HTMLElement)) return null;
  const tag = node.tagName.toLowerCase();
  const props: Record<string, string> = { key: String(key) };
  if (tag === 'a') {
    props.href = node.getAttribute('href') ?? '#';
    if (node.getAttribute('target') === '_blank') {
      props.target = '_blank';
      props.rel = 'noopener noreferrer';
    }
  }
  if (tag === 'br') return createElement('br', props);
  return createElement(tag, props, ...Array.from(node.childNodes, toReact));
};

/** Texto simples (sem markup) devolve a string tal como está, para o DOM ficar igual ao original. */
export function renderInline(html: string): ReactNode {
  if (!html.includes('<') && !html.includes('&')) return html;
  return Array.from(sanitizeInline(html).childNodes, toReact);
}
