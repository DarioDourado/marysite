# Relatório final de SEO

Data: 2026-10-24 · Base: commit `d82e314` (branch `feat/creat-BE`) · Nada foi commitado.

## 1. Resumo

O site era uma SPA que entregava um HTML vazio (0,4 kB) e definia título e descrição só no browser. Não tinha `robots.txt`, `sitemap.xml`, canonical, dados estruturados, página 404 nem `noindex` na gestão, e o hero e a citação pesavam 7 MB. Tudo isto foi resolvido **sem alterar o design** (comparação pixel a pixel: ≤ 0,055 % de diferença, só reamostragem de imagens e ruído da animação do hero).

Decisão de arquitetura: o projeto declara SPA/CSR e exclui SSR/Next.js (`.agents/04-stack`). Em vez de trocar de framework, o servidor Express existente passou a injetar no HTML de cada página os metadados, os dados estruturados e um resumo em `<noscript>`, lidos do CMS (`server/seo/`). O React continua a desenhar o site exatamente como antes.

## 2. Estado por área

| Área | Estado inicial | Alterações realizadas | Estado final | Prioridade futura |
|---|---|---|---|---|
| Indexação / robots | Sem `robots.txt` (devolvia HTML 200) | `/robots.txt` dinâmico: permite tudo, bloqueia `/admin/` e `/api/`, aponta para o sitemap | ✔ | Submeter o sitemap no Google Search Console |
| Sitemap | Inexistente | `/sitemap.xml` automático (só URLs indexáveis, sem `lastmod` inventado) | ✔ `/` e `/areas`; `/blog` entra com `SEO_INDEX_BLOG=true` | Acrescentar páginas novas à tabela de rotas se forem criadas |
| Canonical | Nenhum | Absoluto por página, a partir de `SITE_URL`; mantido durante a navegação SPA | ✔ | Definir `SITE_URL` em produção |
| Duplicados / redirecionamentos | `/areas/` = `/areas`; sem www/https | 301 único (barra final + www + http→https quando `SITE_URL` e proxy estão configurados) | ✔ testado em código; **não testado com domínio real** | Confirmar em produção com `TRUST_PROXY` |
| 404 | HTTP 200 + ecrã de erro em inglês | HTTP 404 real, `noindex`, página no tema do site | ✔ | — |
| Rotas privadas | Indexáveis | `noindex, nofollow` em meta + `X-Robots-Tag` em `/admin/*` | ✔ | — |
| Metadados | Só título/descrição, no cliente | Título, descrição, canonical, `robots`, Open Graph completo, Twitter card, `lang="pt-PT"`, no HTML inicial | ✔ | Imagem de partilha 1200×630 própria |
| Conteúdo SEO | Descrições curtas/longas, títulos genéricos | Títulos 48–58 car., descrições 152–159 car. (ver `metadata-map.md`) | ✔ | Preencher texto de «Experiência Profissional»; criar artigos |
| Headings / semântica | 1 H1 por página, hierarquia correta | `aria-label` na navegação, menu móvel sem `<nav>` aninhado, etiquetas do formulário de marcação ligadas aos campos, «Saber mais» com contexto | ✔ | Fieldset/legend nas preferências de horário |
| Imagens | 7 MB em 2 imagens, sem lazy/prioridade, alt fraco | Hero 4,3 MB→221 kB; citação 2,7 MB→517 kB; logótipo 167→58 kB; lazy/`fetchpriority`; alts; limite 2400 px nos uploads | ✔ | `srcset` e dimensões exigem alterar a API |
| Desempenho | LCP móvel 41,5 s; 8 MB | LCP 5,2 s; 0,77 MB; gzip; cache; fontes em paralelo (ver `performance-report.md`) | ✔ melhorado; LCP móvel ainda > 2,5 s | Reduzir o JS principal (775 kB) |
| Links internos | Rodapé apontava a `/#areas`; 4 links `#` | Rodapé corrigido; links `#` documentados | ⚠ 4 links vazios por falta de URLs da cliente | Redes sociais, Política de Privacidade, Termos |
| Dados estruturados | Nenhum | `ProfessionalService`, `Person`, `WebSite`, `WebPage`, `BreadcrumbList`, `Service` (×8) com dados reais | ✔ implementado; **validador externo pendente** | Rich Results Test após publicar |
| SEO local | — | `areaServed` com o texto do rodapé; sem morada inventada | ⚠ limitado ao que o site diz | Morada/consultório → `LocalBusiness` + Google Business Profile |
| Testes | 58 (frontend) + 91 (API) | +21 frontend (servidor SEO, head, redirecionamentos) e +2 API (limite de imagem) | 79 frontend + 93 API a passar | — |

## 3. Problemas graves **fora do âmbito SEO** encontrados

1. ~~Os formulários de marcação e de contacto não enviam nada.~~ **Resolvido a seguir a este relatório:** os pedidos passam a ser guardados na API e aparecem em `/admin/submissions` para admin e superuser. Falta o aviso por e-mail.
2. **Texto em falta visível ao público**: na secção «Sobre Mim» aparecem as chaves `about.experienceIntro`, `about.experienceChildhood`, `about.experienceAdolescence`, `about.experienceAdults` e `about.conclusion` em vez de texto. Não foi inventado texto (é experiência profissional da cliente).
3. **`POST /api/upload` sem autenticação** em `server.ts` (código antigo anterior ao CMS) aceita ficheiros de qualquer pessoa e escreve em `public/mariline-boto.jpg`. Não foi alterado; recomenda-se removê-lo.
4. **Política de Privacidade e Termos** inexistentes (RGPD, dados de saúde em formulários).
5. **Imagem `bg-azul.webp`** referenciada no CSS e nunca fornecida (pedido 404 na consola; visualmente é um azul liso).

## 4. Ficheiros alterados

### `marysite/` (frontend e servidor)

| Ficheiro | Alteração |
|---|---|
| `server.ts` | Compressão, robots/sitemap, redirecionamento 301 canónico, HTML renderizado com SEO (dev e produção), 404 real, cache de estáticos e de `/media` |
| `server/seo/*` (novo) | `routes`, `content`, `meta`, `jsonld`, `html`, `sitemap`, `escape`, `index`, `seo.test.ts` |
| `index.html`, `src/index.css` | `lang="pt-PT"`; fontes via `<link>` + `preconnect` (em vez de `@import`) |
| `src/lib/seo/head.ts` (+ teste), `src/hooks/cms/useSeo.ts`, `useNoindex.ts`, `index.ts` | Canonical, `og:url`, robots e idioma em sincronia com a navegação; `noindex` |
| `src/pages/NotFound/*`, `src/routes/routes.config.tsx`, `src/lib/i18n.ts` | Página 404 e textos PT/EN |
| `src/components/admin/AdminShell.tsx`, `src/pages/Admin/Login/Login.tsx` | `noindex` na gestão |
| `src/components/ui/SafeImage.tsx`, `HeroSection`, `AboutSection`, `AreasSection`, `BookingSection`, `QuoteSection`, `Areas.tsx` | `loading`, `decoding`, `fetchpriority` |
| `src/components/layout/Navbar.tsx`, `Footer.tsx`, `AreasSection.tsx`, `BookingForm.tsx` | `aria-label`, `<nav>` aninhado, link do rodapé, texto de contexto, `htmlFor`/`id` |
| `vitest.config.ts`, `package.json`, `package-lock.json`, `.env.example`, `README.md` | Testes do servidor, dependência `compression`, variáveis `SITE_URL`, `SEO_INDEX_BLOG`, `TRUST_PROXY` |
| `docs/seo/*` (novo) | Estes 9 documentos |

### `marysite-api/`

| Ficheiro | Alteração |
|---|---|
| `app/services/media_service.py` | Limite de 2400 px no lado maior |
| `tests/test_media.py` | 2 testes novos |
| `app/seed_data/pages.py`, `home.py` | SEO inicial e alts novos (PT e EN) |

### Dados (base de dados do CMS, via API)

SEO das 4 páginas; alt de 2 imagens; substituição de 3 ficheiros de media (hero, citação, logótipo). Cópia dos originais em `Mariline-Web/backup-seo-imagens-originais/`.

## 5. Páginas revistas

`/` · `/areas` · `/blog` · `/admin/login` · `/admin/media` · `/admin/settings` · 404.

## 6. URLs indexáveis, `noindex` e redirecionamentos

| Tipo | URLs |
|---|---|
| Indexáveis (no sitemap) | `/` · `/areas` |
| `noindex, follow` | `/blog` (sem artigos) · qualquer URL inexistente (HTTP 404) |
| `noindex, nofollow` | `/admin/login` · `/admin/media` · `/admin/settings` (e todo `/admin/*`) |
| 301 | `/<caminho>/` → `/<caminho>`; `http://` e `www.` → domínio de `SITE_URL` (só produção com `SITE_URL`) |

## 7. Critérios de aceitação

| # | Critério | Estado |
|---|---|---|
| 1 | Todas as páginas públicas analisadas | ✔ |
| 2 | Estratégia de keywords por página | ✔ (hipóteses; sem dados de volume) |
| 3 | Title, description, H1, canonical e OG corretos nas indexáveis | ✔ verificado no HTML servido e no DOM |
| 4 | `robots.txt` e `sitemap.xml` funcionais | ✔ |
| 5 | Links internos validados | ✔ rotas internas todas 200; 4 destinos `#` por preencher |
| 6 | Imagens com alt e otimizadas | ✔ (sem `srcset`/dimensões, ver `media-audit.md`) |
| 7 | Schema implementado e validado | ⚠ implementado e validado como JSON em testes; **validadores externos pendentes** |
| 8 | Sem problemas críticos de indexação | ✔ |
| 9 | Sem títulos/descrições duplicados | ✔ |
| 10 | Design e experiência não alterados | ✔ ≤ 0,055 % de pixels (imagens reamostradas e animação do hero); logins, modo de edição, biblioteca de media e definições verificados |
| 11 | Build, lint e testes | ✔ `tsc` limpo · 79/79 testes · build OK · API 93/93 |
| 12 | Documentação | ✔ |

Verificações adicionais feitas em Chromium: HTML semântico (1 H1 por página, `main`/`nav`/`footer`), landmarks nomeados, sem erros de consola exceto o 404 de `bg-azul.webp` (ponto 3.5) e o do próprio documento 404, desktop e mobile.

## 8. Limitações e ações externas necessárias

| Ação | Quem |
|---|---|
| Definir `SITE_URL` (e `TRUST_PROXY` atrás de proxy) em produção; sem isso o canonical usa o host do pedido | Deploy |
| Testar o site publicado em Schema Markup Validator, Rich Results Test e PageSpeed Insights (não executáveis aqui: exigem URL público) | Após deploy |
| Google Search Console: verificar o domínio, submeter `sitemap.xml`, pedir indexação, acompanhar cobertura e consultas | Cliente/equipa |
| Google Business Profile (só se houver consultório físico ou área de serviço a declarar) | Cliente |
| Imagem de partilha 1200×630, URLs de Instagram/LinkedIn, Política de Privacidade, Termos, texto de «Experiência Profissional» | Cliente (CMS) |
| Aviso por e-mail quando chega um pedido novo (hoje só o contador na barra de edição) | Desenvolvimento |
| Blog: publicar artigos e depois `SEO_INDEX_BLOG=true` | Cliente |
| Backlinks (diretórios profissionais, Ordem dos Psicólogos, parcerias) e monitorização de posições | Marketing |
| Brotli no proxy/CDN de produção | Infraestrutura |
| Medições de laboratório feitas com a API local; valores reais de utilizadores só aparecem no CrUX depois de haver tráfego | — |

## 9. Melhorias futuras sugeridas (por impacto)

1. Avisar por e-mail de cada pedido novo e completar o texto em falta (conversão e credibilidade).
2. Reduzir o JavaScript principal (775 kB) para levar o LCP móvel abaixo de 2,5 s.
3. Páginas dedicadas por área (`/areas/ansiedade`, …) com conteúdo próprio, se a cliente aceitar o novo layout.
4. Publicar artigos no blog e ativar a indexação.
5. Páginas legais, redes sociais e imagem de partilha própria.
