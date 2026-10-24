# CMS Backoffice — Design

Data: 2026-10-24 · Estado: para revisão

## Objetivo

Backoffice administrativo que permite gerir todo o conteúdo público do site (textos, imagens, listas, SEO) sem alterar o design. Frontend em `marysite/`, API em `marysite-api/`.

## Regra absoluta: o design nunca é alterado

- Nenhuma alteração a CSS, tema, tipografia, cores, layout, animações, responsividade ou markup visual do site público.
- Só se troca a origem do conteúdo. Sem sessão de edição, cada componente renderiza exatamente o mesmo DOM de hoje.
- Únicas adições visuais, pedidas explicitamente: o cadeado discreto de login no rodapé e, só com `I18N=true`, o seletor de idioma. As interfaces de edição (lápis, editores, páginas `/admin/*`) só existem com sessão ativa.
- Qualquer dúvida sobre impacto visual: parar e perguntar antes de alterar.
- Verificação obrigatória em cada fase que toque no frontend: screenshots antes/depois, desktop e mobile.

## Regras aplicáveis

- `.agents` do frontend e da API prevalecem sobre o prompt original, exceto na obrigação de não alterar o design.
- Exceção única ao `.agents`: **SQLite** em vez de SQL Server.
- Auth conforme `.agents`: access token Bearer em memória + refresh cookie httpOnly (PyJWT, Argon2id via pwdlib), IDs ULID, erros RFC 9457, `StrictInputSchema`.
- Rate limit em memória (slowapi, 1 worker): exceção documentada à regra de Redis.

## Idiomas (decisão da cliente: apenas PT, EN oculto)

Variáveis de ambiente da API:

```env
I18N=false
DEFAULT_LANG=pt
```

- `I18N=false`: o site e o admin trabalham apenas em `DEFAULT_LANG`. Não há seletor de idioma e a API pública devolve só esse idioma.
- `I18N=true`: o site mostra o seletor de idioma (PT/EN) e o admin edita todos os idiomas lado a lado.
- Os dados EN são **sempre** guardados (seed inclui EN). Com `I18N=false` ficam intactos e invisíveis; o admin não os expõe nem altera.
- A API expõe `GET /api/v1/public/config` → `{ i18n, defaultLang, locales }`. O frontend (público e admin) lê-o no arranque; não há flag duplicada no frontend.
- Idiomas suportados: `pt`, `en`. `DEFAULT_LANG` fora desta lista impede o arranque da API.
- O seletor de idioma é um componente novo, renderizado só com `i18n=true`. Com `i18n=false` o site público é idêntico ao atual.

## Abordagem: conteúdo por chave, alimentado pela API

O CMS guarda cada texto com a chave i18next existente (ex. `hero.title`). No arranque o frontend carrega `GET /api/v1/public/pages/{slug}` e injeta o resultado no i18next (`addResourceBundle`). Os componentes mantêm `t('hero.title')`, logo markup e CSS não mudam. O que muda:

- `src/lib/i18n.ts` deixa de ter textos hardcoded (mantém só a inicialização).
- `areasContent.ts` e as referências a imagens passam a vir da API.
- Strings fixas dentro de componentes que devam ser editáveis passam a chaves CMS.

Descartado: reescrever secções para DTOs (maior risco para o design) e guardar um JSON único.

## Modelo de dados (SQLAlchemy 2.x, ULID, Alembic)

| Entidade | Campos principais |
|---|---|
| `User` | id, email, password_hash, role (`admin` \| `superuser` \| `editor`), is_active, timestamps |
| `Profile` | user_id (1:1), display_name, avatar_media_id (opcional), timestamps |
| `UserCapability` | user_id, capability (`text` \| `images` \| `structure`) |
| `UserPageAccess` | user_id, page_id (páginas que o utilizador pode editar) |
| `Page` | id, slug, og_image_id, timestamps |
| `PageTranslation` | page_id, locale, seo_title, seo_description |
| `ContentSection` | id, page_id, key, type, position, is_repeatable, timestamps |
| `ContentItem` | id, section_id, key, image_id, link_url, position, is_active, version, timestamps |
| `ContentItemTranslation` | item_id, locale, title, content, link_label |
| `Media` | id, filename, original_filename, mime_type, size, alt_text, storage_path, created_at |
| `ContentAuditLog` | id, admin_user_id, entity_type, entity_id, action, previous_value, new_value, created_at |
| `RefreshToken` | id, user_id, jti, expires_at, revoked_at (rotação/revogação) |

- Listas (bullets, pontos da abordagem, valores, parágrafos, áreas) são `ContentItem` ordenados por `position`.
- Cada campo tem um `kind`: `text` (título/subtítulo/botão, texto simples), `richtext` (HTML limitado e sanitizado), `image`, `link`.
- Itens compostos (ex. área: summary, whatIs, signs[], help) usam itens-filho/campos nomeados definidos no content map.
- Páginas: `site` (navbar, rodapé, contactos, WhatsApp), `home`, `areas`, `blog`.
- `position` persistido explicitamente; reordenação por endpoint dedicado.
- `version` (optimistic locking) em `ContentItem`.

## API (`marysite-api`)

Camadas existentes: `routers/` → `services/` → `repositories/` → `models/`. Prefixo `/api/v1`.

- `auth`: `login`, `refresh`, `logout`, `me` (devolve user, profile, role e permissões; + defesa CSRF no refresh por origem/cabeçalho; rate limit no login).
- `admin`: `pages`, `pages/{slug}` (inclui itens inativos, para o modo de edição), `sections`, `content-items` (CRUD, ativar/desativar, reordenar, edição de um campo isolado), `media` (upload, listar/pesquisar, substituir, alt text, apagar com bloqueio 409 + referências), `settings/users` (criar, editar, desativar utilizadores e profiles, e definir as permissões de cada um; só `superuser`).
- Permissões = **tipo de edição + páginas**, definidas por utilizador:
  - Tipos: `text` (texto e SEO), `images` (imagens e biblioteca de media), `structure` (adicionar, remover, ordenar e ativar itens de listas).
  - Páginas: `site` (navbar, rodapé, contactos), `home`, `areas`, `blog`.
  - Cada operação de escrita exige o tipo certo **e** acesso à página do conteúdo, verificado no servidor (`require_capability` + verificação de página). Ex.: um editor só com `text` na `home` não consegue mudar uma imagem nem editar `areas`.
  - `superuser` tem sempre tudo e é o único que acede às configurações. Isto é implícito, não editável, e o último superuser ativo não pode ser desativado nem despromovido.
  - `admin` e `editor` usam apenas as permissões concedidas. O role serve de predefinição ao criar: `admin` com todos os tipos e páginas, `editor` só com `text` nas páginas escolhidas. O superuser ajusta depois.
  - `GET /auth/me` devolve role, tipos e páginas, para o frontend mostrar só os lápis permitidos. Esconder é só UX.
- O lápis de uma imagem só aparece com `images`; os controlos de lista só com `structure`.
- `public`: `pages/{slug}`, `config`.
- Uploads aceites: JPG/JPEG/PNG/WEBP/AVIF. Pipeline: validar extensão, MIME declarado, magic bytes e tamanho do ficheiro (leitura em streaming com limite) → decodificar com Pillow → **converter sempre para WebP** → persistir só o WebP.
  - O original nunca é guardado. Também ficheiros já WebP são reencodados, para normalizar e remover metadados.
  - Aplica a orientação EXIF e remove todos os metadados (EXIF/GPS), por privacidade.
  - Sem redimensionar (não altera o design); limite de pixels para evitar decompression bombs.
  - Conversão em threadpool (CPU-bound, regra do `.agents`). Qualidade WebP fixa (ex. 82) numa constante.
  - Nome de ficheiro ULID com extensão `.webp`; `mime_type` é sempre `image/webp`; `size` é o do WebP final; `original_filename` é só informativo.
  - Substituir uma imagem passa pelo mesmo pipeline. Ficheiro corrompido ou que não decodifica → 422, nada é persistido.
  - Dependência nova: Pillow (suporte AVIF nativo nas versões recentes; se faltar no ambiente, o requirements fixa uma versão que o inclua).
  - `UPLOAD_DIR` fora do código, servido em `/media`.
- Sanitização de texto (nh3); audit log em criar/editar/apagar/ativar/ordenar.
- CORS restrito; `/docs` desligado em produção.

## Migrations e seed

- Alembic: migration da estrutura inicial e migration do primeiro superuser; alterações futuras por novas migrations. Nunca `create_all()`.
- `python -m app.scripts.seed` idempotente: primeiro `superuser` (de `ADMIN_EMAIL`/`ADMIN_PASSWORD`), páginas, secções, textos PT+EN, associação das imagens existentes. Reexecutável sem duplicar.

Variáveis: `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET_KEY`, `UPLOAD_DIR`, `I18N`, `DEFAULT_LANG`.

## Frontend

- Público: carregamento do conteúdo via React Query + transporter com validação Zod; fallback só para falhas transitórias (cache da última resposta), erros de configuração visíveis.

### Edição no próprio site (in-place)

- **Login:** ícone discreto (cadeado, pequeno e de baixo contraste) no rodapé abre o login. Sem sessão não existe mais nenhum elemento de admin no site público.
- **Modo de edição:** após login (com permissão), cada elemento editável mostra um lápis. Clicar torna o campo editável no local, com Guardar/Cancelar e feedback de sucesso/erro.
  - `text` (títulos, subtítulos, botões, contactos, SEO): campo de texto simples.
  - `richtext` (parágrafos longos): editor com barra de ferramentas tipo Word (negrito, itálico, sublinhado, listas, links, cabeçalhos). Biblioteca: **Tiptap** (ProseMirror), carregada em lazy loading só no modo de edição. O HTML é sanitizado no servidor (nh3) e no cliente antes de render (DOMPurify), com lista fechada de tags.
  - `image`: o lápis abre o seletor da biblioteca de media (upload, pesquisa, alt text, reutilização). Só visível com permissão `media.manage`.
  - Listas: controlos inline para adicionar, remover (ConfirmDialog), subir/descer, ativar/desativar. Itens inativos aparecem esmaecidos para quem edita e não aparecem no site público.
  - SEO por página: painel pequeno aberto a partir do modo de edição.
- **Sem alterar o design:** um wrapper `<Editable>` envolve cada texto/imagem. Sem sessão de edição renderiza exatamente os mesmos elementos de hoje (sem DOM extra); só em modo de edição acrescenta o lápis e o campo editável. A alteração aos componentes públicos limita-se a trocar o texto por este wrapper.
- **Páginas dedicadas** (lazy-loaded, fora do `Layout` público): `/admin/login`, `/admin/media` (biblioteca, com `images`) e `/admin/settings` (só `superuser`): lista de utilizadores, criar utilizador (email, nome, role, password inicial), ativar/desativar, repor password e matriz de permissões (tipos × páginas) por utilizador, com ConfirmDialog nas ações destrutivas.
- Estrutura hooks/transporters/types por domínio, Zod + RHF, textos via i18n, a11y (lápis com label e foco por teclado).
- Sessão expirada termina o modo de edição e volta ao site público, com aviso.

## Verificação do design inalterado

Screenshots antes/depois (desktop e mobile) de `/`, `/areas`, `/blog` com `I18N=false`, sem sessão; diff visual sem alterações, com a única exceção do ícone discreto de login no rodapé (pedido explícito). Nota: `server.ts` mantém o `/api/upload` legado (não alterado).

## Fases

1. `docs/cms-content-map.md` (auditoria; assinala inconsistências, ex. número de WhatsApp README vs código; chaves `about.experience*` usadas e não definidas).
2. Backend: modelos, migrations, seed, API pública + config i18n.
3. Auth, admin API, media.
4. Integração do frontend público + verificação visual.
5. Modo de edição in-place (`<Editable>`, Tiptap, seletor de media, listas) e páginas `/admin/media` e `/admin/settings`.
6. README, `.env.example`, lista de ficheiros alterados, confirmação de design inalterado.

## Testes

- API: pytest com SQLite real e migrations aplicadas; testes para auth, rate limit, authz, uploads inválidos, conversão para WebP (JPG, PNG, AVIF e WEBP de entrada saem sempre WebP, sem EXIF, e o original não fica em disco), bloqueio de media em uso, reordenação, seed idempotente, flag `I18N` (ambos os estados).
- Frontend: Vitest + Testing Library para transporters/hooks do admin e para o carregamento do conteúdo.
- Gates finais: `npm run lint`, `npm run build`, pytest, `alembic upgrade head` numa BD vazia.
