# CMS Backoffice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Backoffice com edição in-place no site público (lápis), API FastAPI + SQLite + Alembic em `marysite-api`, sem alterar o design.

**Architecture:** O CMS guarda o conteúdo como árvore (`Page → ContentSection → ContentItem` recursivo, com traduções por idioma). A API pública devolve a árvore; o frontend converte-a no mesmo formato de recursos do i18next (`addResourceBundle`), pelo que os componentes continuam a usar `t('hero.title')`. Um wrapper `<Editable>` não renderiza DOM extra sem sessão de edição.

**Tech Stack:** FastAPI, SQLAlchemy 2 async + aiosqlite, Alembic, PyJWT, pwdlib[argon2], slowapi, Pillow, nh3, python-ulid, pytest. Frontend: React 19, Vite, React Query, Axios, Zod, React Hook Form, Tiptap, DOMPurify, Vitest.

## Global Constraints

- **Design:** nunca alterar CSS, tema, tipografia, layout, animações ou markup visual público. Únicas adições: cadeado de login no rodapé; seletor de idioma só com `I18N=true`.
- `.agents` prevalece (API: `marysite-api/.agents`; frontend: `marysite/.agents`). Única exceção: SQLite em vez de SQL Server.
- API: `async def`, `response_model`, services/repositories/Depends, ULID, `StrictInputSchema`, RFC 9457 com `code`, prefixo `/api/v1`, 401 com `WWW-Authenticate: Bearer`, `limit` com `le=100`, PyJWT + pwdlib argon2, nunca `create_all()`.
- Auth: access token Bearer em memória (nunca cookie nem localStorage); refresh em cookie httpOnly, rotação, CSRF por cabeçalho `X-Requested-With: fetch` + verificação de `Origin`.
- Env: `DATABASE_URL=sqlite:///./data/app.db`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET_KEY`, `UPLOAD_DIR=./uploads`, `I18N=false`, `DEFAULT_LANG=pt`.
- Imagens: sempre convertidas para WebP (Pillow), sem EXIF, nome ULID, original nunca guardado.
- Frontend: TypeScript sem `any`, named exports, imports `@/`, hooks/transporters/types por domínio, Zod nas respostas, i18n em todo o texto novo, ConfirmDialog em ações destrutivas, componentes < 200 linhas, hooks < 100.
- Permissões: tipos `text|images|structure`; páginas `site|home|areas|blog`; `superuser` implícito com tudo e único em `/admin/settings`.
- Comentários só com o porquê, em bullets. YAGNI.

## Mapa de chaves (fidelidade)

Secção CMS = chave de topo i18next. Conversão árvore → recursos: `text|richtext` → string; `list` → array dos filhos; `group` → objeto pelos `key` dos filhos. Páginas: `site` = nav, whatsapp, contacts, footer, brand; `home` = hero, about, approach, booking, bookingForm, quote, areas, faq; `areas` = areasPage, areaPages (lista de grupos: title, summary, whatIs, help, signs[]); `blog` = blog.

## File Structure

API (`marysite-api/`): `app/config.py`, `app/database.py`, `app/models/{base,user,refresh_token,page,content,media,audit}.py`, `app/schemas/{auth,content,media,user}.py`, `app/repositories/{user,content,media,audit}_repository.py`, `app/services/{auth,content,media,user,tree}_service.py`, `app/core/{security,ulid,permissions}.py`, `app/dependencies/{database,auth}.py`, `app/routers/{auth,public,admin_content,admin_media,admin_users}.py`, `app/scripts/seed.py`, `app/seed_data/*.py`, `alembic/`, `tests/`.

Frontend (`marysite/src/`): `lib/cms/*` (client, bundle, provider), `hooks/{cms,auth,media,users}/`, `services/transporters/{cms,auth,media,users}/`, `types/{cms,auth,media,users}/`, `components/cms/*` (Editable*, ItemControls, LoginDialog, panels), `pages/Admin/{Login,Media,Settings}/`. Alterações a componentes públicos: só trocar texto/imagem por `t()`/wrapper.

---

### Task 0: Auditoria e baseline visual

**Files:** Create `docs/cms-content-map.md`; baseline em `docs/superpowers/visual-baseline/` (gitignored se grande).

- [ ] Listar rotas (`/`, `/areas`, `/blog`), todos os textos (i18n.ts, `areasContent.ts`, FAQ, BookingForm, Footer, Navbar, Home sections), imagens (`/img/*.webp`, logo), links/CTAs (WhatsApp, mailto), SEO (hoje inexistente), conteúdo fixo não exposto (ícones, números de ordem, classes).
- [ ] Assinalar inconsistências: WhatsApp README (910 979 513) vs código (965 608 731); chaves `about.experience*`/`about.conclusion` usadas e **não definidas** em i18n (hoje renderizam a chave); `areas.list` e `areasPage` mortos/parciais; `areas.title` PT sem EN para `areasPage`; alert hardcoded no BookingForm; formulários sem envio.
- [ ] Tirar screenshots baseline (desktop 1440 e mobile 390) de `/`, `/areas`, `/blog` com `npm run dev`, via navegador automatizado.
- [ ] Commit.

### Task 1: API foundation

**Files:** Modify `requirements.txt`, `.env.example`, `app/config.py`; Create `app/database.py`, `app/core/ulid.py`, `app/models/base.py`, `pytest.ini`, `tests/conftest.py`, `tests/test_config.py`.

**Produces:** `settings` com `DATABASE_URL`, `async_database_url`, `I18N`, `DEFAULT_LANG` (validado em `{pt,en}`), `locales` (`[DEFAULT_LANG]` se `I18N=false`, senão `[pt,en]`), `JWT_*`, `UPLOAD_DIR`, `MAX_UPLOAD_MB`, `COOKIE_SECURE`; `Base`, `IdMixin` (ULID str(26)), `TimestampMixin`; `get_db()` async; SQLite com `PRAGMA foreign_keys=ON` e WAL.

- [ ] Teste: `DEFAULT_LANG=fr` → `ValidationError`; `I18N=false` → `locales == ['pt']`; `I18N=true` → `['pt','en']`. Correr: falha → implementar → passa.
- [ ] Instalar deps no venv, atualizar `requirements.txt` (versões fixadas com `pip freeze` filtrado).
- [ ] Commit.

### Task 2: Modelos + migrations

**Files:** Create `app/models/*.py`, `alembic.ini`, `alembic/env.py`, `alembic/versions/0001_initial.py` (autogenerate), `tests/test_migrations.py`.

Tabelas: `users`, `profiles`, `user_capabilities`, `user_page_access`, `refresh_tokens`, `pages`, `page_translations`, `content_sections`, `content_items` (parent_id, key, kind, image_id, link_url, position, is_active, version `version_id_col`), `content_item_translations` (item_id, locale, value), `media`, `content_audit_logs`. Unicidades: `(page_id,key)` secção, `(section_id,parent_id,key)` item, `(item_id,locale)`.

- [ ] Teste: `alembic upgrade head` numa BD vazia cria todas as tabelas; `alembic check` não deteta drift; `downgrade base` funciona.
- [ ] Commit.

### Task 3: Segurança e auth

**Files:** Create `app/core/{security,permissions}.py`, `app/schemas/auth.py`, `app/repositories/user_repository.py`, `app/services/auth_service.py`, `app/dependencies/auth.py`, `app/routers/auth.py`; Modify `app/main.py`; Test `tests/test_auth.py`.

**Produces:** `hash_password/verify_password`; `create_access_token(user_id)`; `decode_access_token`; `require_user`, `require_capability(cap, page_slug_getter)`, `require_superuser`; `POST /api/v1/auth/{login,session,refresh,logout}`, `GET /auth/me` → `{id,email,displayName,role,capabilities[],pages[]}` (superuser: todas).

- [ ] Testes: login ok devolve token + cookie httpOnly; password errada 401 `INVALID_CREDENTIALS`; utilizador inativo 401; rate limit (6.º pedido → 429); refresh rota o cookie e invalida o antigo; reutilização de refresh revogado revoga a família; refresh/logout sem cabeçalho CSRF → 403; `Origin` não permitido → 403; token expirado 401 com `WWW-Authenticate: Bearer`; `/me` de editor devolve só as suas permissões.
- [ ] Implementar; passar; commit.

### Task 4: Conteúdo (público + admin)

**Files:** Create `app/schemas/content.py`, `app/repositories/{content,audit}_repository.py`, `app/services/{content,tree}_service.py`, `app/routers/{public,admin_content}.py`; Test `tests/test_content_public.py`, `tests/test_content_admin.py`.

**Produces:**
- `GET /public/config` → `{i18n, defaultLang, locales}`.
- `GET /public/pages/{slug}` → `{slug, seo:{title,description,ogImage}, sections:[{key, items:[ItemNode]}]}`; `ItemNode={id,key,kind,position,isActive,value:{<locale>:str}|null,image:{id,url,alt}|null,linkUrl,children:[ItemNode]}`; só itens ativos; só `settings.locales`.
- `GET /admin/pages/{slug}` (inclui inativos, exige acesso à página).
- `PATCH /admin/content-items/{id}` `{locale,value,version}` (capability `text`; 409 `STALE_VERSION`); `PATCH …/{id}/image` (`images`); `PATCH …/{id}/active`, `POST /admin/sections/{key}/items` (clona estrutura-molde), `DELETE`, `POST …/reorder` `{orderedIds[]}` (`structure`); `PUT /admin/pages/{slug}/seo` (`text`).
- Texto `text` sanitizado a plano; `richtext` sanitizado por nh3 com lista fechada (`p,br,strong,em,u,ul,ol,li,a[href|target|rel],h2,h3`).
- Audit log em cada escrita.

- [ ] Testes: árvore ordenada por `position`; inativo oculto no público e visível no admin; `I18N=false` não devolve `en`; editor sem `images` → 403 em imagem; editor sem acesso à página → 403; versão desatualizada 409; sanitização remove `<script>` e `onerror`; reorder persiste `position`; audit log criado.
- [ ] Implementar; passar; commit.

### Task 5: Media

**Files:** Create `app/schemas/media.py`, `app/repositories/media_repository.py`, `app/services/media_service.py`, `app/routers/admin_media.py`; Modify `app/main.py` (mount `/media` StaticFiles com `UPLOAD_DIR`); Test `tests/test_media.py`.

**Produces:** `POST /admin/media` (multipart), `GET /admin/media?q=&limit=&cursor=`, `PUT /admin/media/{id}/file` (substituir), `PATCH /admin/media/{id}` (alt_text), `DELETE /admin/media/{id}` (409 `MEDIA_IN_USE` com `references:[{page,section,path}]`). `convert_to_webp(stream) -> bytes` em threadpool.

- [ ] Testes: JPG, PNG, WEBP e AVIF de entrada → ficheiro `.webp` em disco, `mime_type=image/webp`, sem EXIF, original ausente; extensão falsa com magic bytes inválidos → 422; ficheiro > `MAX_UPLOAD_MB` → 413; corrupto → 422 e nada em disco; apagar em uso → 409 com referências; apagar livre remove ficheiro; substituir mantém o `id` e atualiza o ficheiro; sem `images` → 403.
- [ ] Implementar; passar; commit.

### Task 6: Utilizadores / configurações

**Files:** Create `app/schemas/user.py`, `app/services/user_service.py`, `app/routers/admin_users.py`; Test `tests/test_users.py`.

**Produces:** `GET/POST /admin/settings/users`, `PATCH /admin/settings/users/{id}` (nome, role, ativo, `capabilities[]`, `pages[]`), `POST …/{id}/password`. Só `superuser`. Predefinições por role ao criar. Não permite desativar/despromover o último superuser (409 `LAST_SUPERUSER`).

- [ ] Testes: admin/editor recebem 403; criar editor com predefinição; alterar permissões reflete-se em `/me`; último superuser protegido; email duplicado 409; password nova invalida refresh tokens.
- [ ] Implementar; passar; commit.

### Task 7: Seed

**Files:** Create `app/seed_data/{site,home,areas,blog}.py` (PT e EN verbatim do frontend atual, incluindo FAQ, BookingForm, Footer, Navbar, `areasContent.ts`), `app/scripts/seed.py`, `alembic/versions/0002_first_superuser.py`; Test `tests/test_seed.py`, `tests/fixtures/original_i18n.json`.

- [ ] Copiar os `.webp` atuais de `marysite/public/img` para `UPLOAD_DIR` (ULID) e criar `Media`; associar aos itens `image` (hero.background, hero.photo, about.photo, booking.photo, quote.background, areas.banner, brand.logo).
- [ ] Teste de fidelidade: bundle público PT == `original_i18n.json` para todas as chaves existentes; seed duas vezes não duplica (contagens iguais); EN presente só onde existe fonte.
- [ ] Chaves em falta (`about.experience*`, `about.conclusion`): semear o texto literal hoje visível (a chave) e listar no relatório final para a cliente preencher — não inventar conteúdo.
- [ ] `python -m app.scripts.seed` executa limpo numa BD recém-migrada; commit.

### Task 8: Frontend – base, dados e injeção no i18next

**Files:** Modify `package.json`, `vite.config.ts` (proxy `/api`,`/media`), `server.ts` (proxy opcional via `API_PROXY_TARGET`), `.env.example`, `src/lib/i18n.ts` (só init), `src/App.tsx`; Create `vitest.config.ts`, `src/types/cms/`, `src/services/transporters/cms/cmsTransporter.ts`, `src/hooks/cms/{useCmsConfig,useCmsPage}.ts`, `src/lib/cms/{bundle.ts,CmsProvider.tsx,api.ts}`, `src/lib/cms/bundle.test.ts`.

**Produces:** `buildBundle(nodes, locale) → Record<string, unknown>` (regras do mapa de chaves); `CmsProvider` carrega config + 4 páginas, injeta no i18next, define `lng=defaultLang`; `useCmsImage(path, fallback)`; `useSeo(slug)` (document.title/meta). Falha transitória (rede/5xx) → último bundle em `localStorage` (conteúdo público); 4xx de configuração → ecrã de erro.

- [ ] Testes (vitest): `buildBundle` com lista de textos → array, grupo → objeto, list de grupos → array de objetos; inativos já excluídos pela API; falha de rede usa cache; resposta malformada falha o Zod.
- [ ] Substituir `areasContent.ts` por `useAreaPages()` (mesmo shape `AreaContent`, `signs[]`), `AreaIcon` continua a usar `id`=`key` do grupo.
- [ ] Trocar strings fixas dos componentes (FAQ, BookingForm, Footer, Navbar, nomes/alts) por `t()` das novas chaves; FAQ resposta `richtext` renderizada com DOMPurify no mesmo wrapper (`div`), mantendo as classes.
- [ ] Imagens: `SafeImage src={useCmsImage('hero.background','/img/hortensias.webp')}`.
- [ ] Verificar `npm run lint` e `npm run build`; comparar screenshots com a baseline (diff pixel); commit.

### Task 9: Frontend – auth e cadeado

**Files:** Create `src/types/auth/`, `src/services/transporters/auth/authTransporter.ts`, `src/lib/auth/{authClient.ts,AuthProvider.tsx}`, `src/hooks/auth/{useAuth,useLogin,useLogout}.ts`, `src/pages/Admin/Login/Login.tsx`, `src/components/cms/LockLink.tsx`; Modify `Footer.tsx` (acrescentar `<LockLink/>`), `routes.config.tsx` (rotas `/admin/*` lazy), Test `authClient.test.ts`.

- [ ] Teste: access token só em memória; 401 → um único refresh partilhado; logout limpa cache React Query; login inválido não faz refresh.
- [ ] Cadeado: ícone `Lock` 14px, `text-foreground/30`, `aria-label` i18n, no canto inferior da barra de copyright; com sessão mostra “Sair”/“Editar”. Verificar screenshot: diferença apenas nessa área.
- [ ] Commit.

### Task 10: Frontend – modo de edição in-place

**Files:** Create `src/components/cms/{EditModeProvider,EditableText,EditableRichText,EditableImage,ItemControls,SeoPanel,ConfirmDialog,MediaPicker}.tsx`, `src/hooks/cms/{useUpdateItem,useUpdateImage,useReorderItems,useToggleItem,useCreateItem,useDeleteItem,useAdminPage}.ts`; Modify componentes públicos: envolver cada texto/imagem/lista; Tests `EditableText.test.tsx`, `ItemControls.test.tsx`.

**Produces:** `<EditableText path="hero.title" />` (sem sessão/edição → fragmento `{value}` sem DOM); `<EditableRichText path as="div">`; `<EditableImage path fallback alt className>` (sem edição → `SafeImage` idêntico); `<ItemControls path index count />`; `useCms().can('text'|'images'|'structure', pageSlug)`.

- [ ] Testes: sem edição o DOM é idêntico ao do `t()`; lápis só com permissão; clicar abre campo, Guardar chama a mutation, Cancelar repõe; 409 mostra erro; remover exige ConfirmDialog.
- [ ] Tiptap em chunk lazy (`React.lazy`), barra: negrito, itálico, sublinhado, listas, link, H2/H3; HTML sanitizado com DOMPurify antes de render.
- [ ] Editor de SEO por página; commit.

### Task 11: Frontend – páginas admin

**Files:** Create `src/pages/Admin/Media/Media.tsx`, `src/pages/Admin/Settings/Settings.tsx` (+ `UserForm`, `PermissionMatrix`), hooks/transporters/types de `media` e `users`; `RequireAuth`/`RequireSuperuser`.

- [ ] Testes: `/admin/settings` redireciona não-superuser; matriz envia `capabilities` e `pages`; biblioteca mostra erro 409 com referências.
- [ ] Commit.

### Task 12: Verificação final e documentação

**Files:** Modify `marysite/README.md`, `marysite-api/README.md`, `.env.example` (ambos); finalizar `docs/cms-content-map.md`.

- [ ] README: instalação, venv, deps, migrations, seed, criação do superuser, correr backend/frontend, proxy, deploy.
- [ ] Gates: `pytest`, `alembic upgrade head` + `python -m app.scripts.seed` em BD nova, `npm run lint`, `npm run build`, `npm test`.
- [ ] Verificação visual final (desktop/mobile, `I18N=false`, sem sessão) contra baseline; testar `I18N=true` manualmente.
- [ ] Lista de ficheiros alterados e confirmação objetiva de que o design público não mudou (exceto cadeado).
- [ ] Commit.

## Self-review (spec ↔ plano)

Idiomas/flag (T1,T4,T8); lápis e richtext (T10); roles+permissões+settings (T3,T6,T11); WebP (T5); design (T0,T8,T9,T12); migrations+seed (T2,T7); audit (T4); rate limit/CSRF (T3); media bloqueada em uso (T5). Desvio do spec: tradução do item guarda uma única coluna `value` (em vez de `title/content/link_label`), pois a árvore recursiva já distingue campos por `key`.
