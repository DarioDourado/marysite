/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base da API; vazio usa o mesmo domínio (`/api/v1`) através do proxy. */
  readonly VITE_API_BASE_URL?: string;
  /** Prefixo dos URLs de media quando a API serve os ficheiros noutro domínio. */
  readonly VITE_MEDIA_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
