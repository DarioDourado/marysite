# Inventário do website — estado inicial (antes das alterações)

Data da auditoria: 2026-10-24 · Commit base: `d82e314` · Medições feitas com Chromium (Playwright) sobre o site real ligado à API local.

## 1. Como o site funciona (resumo técnico)

| Aspeto | Estado encontrado |
|---|---|
| Stack | React 19 + Vite, **SPA com renderização no browser** (CSR). O conteúdo vem do CMS próprio (`../marysite-api`, FastAPI/SQLite) e é carregado por JavaScript depois de a página abrir. |
| HTML inicial | 0,4 kB: um `<div id="root">` vazio e o `<title>` genérico. Nenhum texto, link ou metadado específico da página. |
| Servidor | `server.ts` (Express): ficheiros estáticos + `index.html` para qualquer caminho. |
| Idiomas | Só português (`I18N=false`; inglês existe na BD mas está oculto). Sem URLs por idioma. |
| Regra do projeto (`.agents/04-stack`) | Declara SPA/CSR e diz que SSR/SSG (Next.js) está **fora do âmbito**. Por isso não se migrou de framework; o SEO foi resolvido no servidor Express existente (ver `final-seo-report.md`). |

## 2. URLs e páginas

| URL | Página | Intenção | Título atual | Meta description atual | H1 | Estado de indexação | Problemas identificados |
|---|---|---|---|---|---|---|---|
| `/` | Início (uma página longa: Hero, Sobre Mim, Áreas, Citação, Abordagem, Marcação, Contacto) | Comercial/transacional + navegacional (nome da marca) | `Mariline Bôto · Psicóloga Clínica` (33 car.) | `Aqui, cada parte de si encontra espaço para ser escutada com sensibilidade e verdade.` (86 car., é o subtítulo do hero) | «A sua singularidade merece ser vista, compreendida e cuidada.» | Indexável por omissão, mas **só depois de executar JavaScript**; sem canonical, sem `og:url`/`og:type`/`og:image`, sem Twitter card, sem JSON-LD | Metadados definidos só no cliente; descrição curta e sem keywords; `lang="pt"` (devia ser `pt-PT`); textos `about.experience*` aparecem como chaves (ver §6); imagem de fundo de 4,3 MB |
| `/areas` | Áreas de Intervenção (8 áreas: Trauma, Luto, Ansiedade, Depressão, POC, Autoestima e Identidade, Relacionamentos, Crises e Transições) | Informacional + comercial | `Áreas de Intervenção` (21 car.) | Texto de introdução da página (212 car., acima do limite de ~160) | «Áreas de Intervenção» | Igual a `/` | Título sem contexto/keyword; descrição demasiado longa; 8 secções com âncora (`/areas#trauma`…) que não são URLs próprias; banner de 1331×2000 px a ocupar 1280×917 |
| `/blog` | Blog | Informacional | `Blog` (4 car.) | `Reflexões e conteúdos sobre saúde mental, bem-estar emocional e psicoterapia.` (78 car.) | «Blog» | Indexável | **Página sem artigos** (mostra «Em breve, partilharei aqui os primeiros artigos.»): conteúdo fino; `BlogTransporter` devolve sempre `[]` |
| `/admin/login` | Entrada na gestão | Navegacional (interno) | Título genérico do site | — | «Entrar» | **Indexável** (sem `noindex`) | Página privada acessível a robôs |
| `/admin/media` | Biblioteca de imagens | Interna | Título genérico | — | (título da gestão) | Indexável até ao redirecionamento de login | Idem |
| `/admin/settings` | Utilizadores e permissões | Interna | Título genérico | — | (título da gestão) | Indexável até ao redirecionamento de login | Idem |
| `/qualquer-outra` | — | — | Título do site | — | Ecrã de erro do React Router em inglês («Unexpected Application Error! 404 Not Found») | **HTTP 200** (soft 404) e indexável | Sem página 404 real; erros na consola; sem `noindex` |
| `/robots.txt` | — | — | — | — | — | Devolve o HTML do site com HTTP 200 (`text/html`) | Não existe `robots.txt` |
| `/sitemap.xml` | — | — | — | — | — | Idem | Não existe sitemap |

Âncoras internas (não são URLs indexáveis separadas): `/#about`, `/#areas`, `/#approach`, `/#booking-section`, `/#contacts`, `/areas#trauma`, `#luto`, `#ansiedade`, `#depressao`, `#poc`, `#autoestima`, `#relacionamentos`, `#crises`.

## 3. Estrutura de headings (medida no DOM renderizado)

- `/`: 1 × H1; H2 por secção (Bem-vindo(a), Mariline Bôto, Formação e Experiência Profissional, Áreas de Intervenção, citação, A Minha Abordagem, Marcação de Consulta, Contacto, rodapé); H3 para cada área, «Perguntas Frequentes» e cabeçalhos do rodapé. Hierarquia sem saltos. ✔
- `/areas`: 1 × H1; H2 por área; H3 «O que é / Sinais de alerta / Como posso ajudar». ✔
- `/blog`: 1 × H1. ✔
- Em todas as páginas o rodapé usa um `H2` («A Sua Psicóloga Online») — nome diferente do da marca («Mariline Bôto»); ver §6.

## 4. Links

| Tipo | Quantidade (home) | Observações |
|---|---|---|
| Internos para rotas | `/`, `/areas`, `/blog` + âncoras | Navegação principal e rodapé |
| Âncoras «Saber mais» nas 8 áreas | 8 | Mesmo texto repetido em 8 links, sem contexto |
| Externos | WhatsApp (3), e-mail (1) | WhatsApp com `target=_blank` e `rel="noopener noreferrer"` ✔ |
| **Links vazios (`href="#"`)** | 4 | Instagram, LinkedIn, Política de Privacidade, Termos e Condições. O conteúdo vem do CMS e os URLs reais nunca foram preenchidos |
| Rodapé «Áreas de Intervenção» | 1 | Apontava para `/#areas` em vez da página dedicada `/areas` |
| Páginas órfãs | 0 | As 3 páginas públicas estão ligadas pela navegação |
| Ligações quebradas | 0 em rotas internas | 4 destinos `#` não levam a lado nenhum |

## 5. Imagens (8 usos, 6 ficheiros)

| Imagem | Dimensões reais | Peso | Uso | Observação |
|---|---|---|---|---|
| Fundo do hero | 6000×4002 | **4,3 MB** | Hero (acima da dobra) | Provável elemento LCP; exibida a ≤1280 px |
| Fundo da citação | 3936×3936 | **2,7 MB** | Secção abaixo da dobra | Exibida a 1280×720 |
| Logótipo | 3239×828 | 167 kB | Barra de navegação (156×40 px) | Mais de 20× maior do que o necessário |
| Fotografia (hero) | 1792×2400 | 101 kB | Hero | |
| Fotografia (sobre/marcação) | 1916×2240 | 130 kB | 2 usos | Mesmo ficheiro |
| Banner das áreas | 1331×2000 | 29 kB | 2 usos | |

Nenhuma imagem tinha `loading`, `decoding` ou `fetchpriority`. Nenhuma tinha `width`/`height` (as caixas têm proporção fixa por CSS, por isso o CLS medido é 0).

## 6. Conteúdo e problemas que **não** são técnicos

1. **Textos em falta, visíveis ao público**: `about.experienceIntro`, `about.experienceChildhood`, `about.experienceAdolescence`, `about.experienceAdults`, `about.conclusion` aparecem na página como o nome da chave (o texto nunca foi escrito). É conteúdo da cliente: **não foi inventado**; tem de ser preenchido no CMS.
2. **Os formulários não enviam nada**: o formulário de marcação mostra «Pedido de marcação enviado com sucesso!» mas só chama `alert()`; o formulário de contacto não tem `onSubmit`. Quem usa os formulários julga que contactou a psicóloga. Isto é um problema grave de conversão (fora do âmbito SEO, mas relatado).
3. **Política de Privacidade e Termos** não existem (`href="#"`). Para um serviço de saúde que recolhe dados por formulário (RGPD) são necessárias.
4. **Redes sociais** (Instagram/LinkedIn) sem URL.
5. **Nome do rodapé** «A Sua Psicóloga Online» e copyright «© 2026 A Sua Psicóloga Online» diferem da marca «Mariline Bôto». Não alterado: decisão da cliente.
6. **Localização** («Atendimento Online / Lisboa»): ambígua (só online? também presencial em Lisboa?). Usada tal como está; não se afirmou morada nem consultório.
7. `POST /api/upload` em `server.ts` aceita ficheiros **sem autenticação** e escreve em `public/mariline-boto.jpg`. É código antigo anterior ao CMS. Relatado como risco de segurança; não foi alterado nesta tarefa.

## 7. Dados estruturados, sitemap, robots, canonical, hreflang

| Item | Estado inicial |
|---|---|
| JSON-LD / Schema.org | Nenhum |
| `robots.txt` | Inexistente (devolvia HTML) |
| `sitemap.xml` | Inexistente (devolvia HTML) |
| `<link rel="canonical">` | Nenhum |
| Open Graph | Só `og:title`, `og:description` e `og:image` (esta só se houvesse imagem de partilha, e não havia), todos definidos no cliente |
| Twitter/X Card | Nenhum |
| `hreflang` | Não aplicável (um só idioma) |
| Redirecionamentos 301 | Nenhum (`/areas/` e `/areas` serviam o mesmo conteúdo; sem canonicalização www/https) |
| Página 404 | Inexistente (ecrã de erro do router com HTTP 200) |
| `noindex` em rotas privadas | Nenhum |

## 8. Dependências que afetam renderização, indexação e desempenho

- JavaScript principal de **775 kB** (250 kB gzip) + chunk da Home de 20 kB; o editor de texto rico (410 kB) só carrega em modo de edição.
- O conteúdo só aparece depois de: HTML → JS → pedidos à API (`/public/config` + 4 páginas) → render. Até lá é mostrado um bloco vazio.
- Google Fonts (DM Sans + Marcellus) carregadas por `@import` dentro do CSS: pedido encadeado a bloquear a renderização.
- Servidor sem compressão e sem cabeçalhos de cache.

## 9. Formulários, CTAs e páginas de conversão

| Elemento | Onde | Estado |
|---|---|---|
| CTA «Marque uma consulta» | Hero, página de áreas, barra de navegação | Leva a `#booking-section` ✔ |
| Formulário de marcação | `/#booking-section` | **Não envia dados** (ver §6.2); etiquetas sem ligação ao campo (`htmlFor`) |
| Formulário de contacto | `/#contacts` | **Não envia dados**; campos com `aria-label` |
| WhatsApp (botão flutuante e secção) | Todas as páginas | Funcional ✔ |
| E-mail | Contactos e rodapé | `mailto:` ✔ |
