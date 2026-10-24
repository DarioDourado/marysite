import DOMPurify from 'dompurify';

const INLINE_TAGS = ['strong', 'em', 'u', 'a', 'br'];
const RICH_TAGS = [...INLINE_TAGS, 'p', 'ul', 'ol', 'li', 'h2', 'h3'];
const ATTRS = ['href', 'target', 'rel'];

// O servidor já sanitiza; isto é a segunda barreira antes de qualquer HTML chegar ao DOM
export const sanitizeInline = (html: string): DocumentFragment =>
  DOMPurify.sanitize(html, { ALLOWED_TAGS: INLINE_TAGS, ALLOWED_ATTR: ATTRS, RETURN_DOM_FRAGMENT: true });

export const sanitizeRich = (html: string): string =>
  DOMPurify.sanitize(html, { ALLOWED_TAGS: RICH_TAGS, ALLOWED_ATTR: ATTRS });
