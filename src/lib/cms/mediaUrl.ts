const MEDIA_BASE = import.meta.env.VITE_MEDIA_BASE_URL ?? '';

/** URLs de media vêm da API como caminho relativo (`/media/x.webp`). */
export const mediaUrl = (url: string): string => (/^https?:\/\//.test(url) ? url : `${MEDIA_BASE}${url}`);

/** Uma entrada de `srcset` (`/media/x-480.webp 480w`) com o mesmo prefixo de media que `mediaUrl`. */
export const mediaSrcSetEntry = (entry: string): string => {
  const [url = '', descriptor = ''] = entry.trim().split(/\s+/);
  return `${mediaUrl(url)} ${descriptor}`.trim();
};
