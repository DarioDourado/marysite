const MEDIA_BASE = import.meta.env.VITE_MEDIA_BASE_URL ?? '';

/** URLs de media vêm da API como caminho relativo (`/media/x.webp`). */
export const mediaUrl = (url: string): string => (/^https?:\/\//.test(url) ? url : `${MEDIA_BASE}${url}`);
