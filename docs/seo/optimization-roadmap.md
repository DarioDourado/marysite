# Segunda auditoria SEO: o que ainda se pode otimizar

> **Atualização:** os pontos 3 (fontes), 4 (JavaScript), 5 (imagens por ecrã) e 6 (favicon) da secção 1 foram aplicados no mesmo dia. Resultados medidos no fim do documento («Depois dos pontos 3, 4, 5 e 6»). Os pontos 1 e 2 (pré-carregar a imagem do hero e embutir o conteúdo do CMS no HTML) continuam por fazer.

Data: 2026-10-24 · Depois das alterações descritas em `final-seo-report.md` · Medido com **Lighthouse** (Chrome for Testing, build de produção local, API local; rede e CPU móveis simuladas pelo Lighthouse).

## Resultado atual

| Página | Perfil | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | FCP | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | Mobile | **70** | 96 | 96 | **100** | 6,2 s | 3,6 s | 0 |
| `/areas` | Mobile | **81** | 95 | 96 | **100** | 4,2 s | 2,8 s | 0 |
| `/` | Desktop | **96** | 96 | 96 | **100** | 1,3 s | 0,7 s | 0,001 |

SEO técnico está completo (100/100 nas auditorias do Lighthouse). O que sobra é sobretudo **velocidade no telemóvel** (o ponto fraco), alguns detalhes de acessibilidade e trabalho de conteúdo/autoridade que não é código.

## 1. Código, sem mudança visual (por ordem de impacto)

| # | Otimização | Evidência (Lighthouse) | Ganho estimado* | Esforço | Risco |
|---|---|---|---|---|---|
| 1 | **Pré-carregar a imagem principal a partir do servidor** (`<link rel="preload" as="image" fetchpriority="high">` do fundo do hero em `/` e do banner em `/areas`, já que o servidor conhece o URL pelo CMS) | «LCP request discovery»: a imagem do LCP **não é descobrível no HTML inicial**, só depois de o JavaScript e a API responderem | -0,3 a -0,8 s no LCP móvel | Baixo | Baixo |
| 2 | **Embutir o conteúdo do CMS no HTML** (`<script type="application/json">`, ~14 kB gzip para as 4 páginas) e usá-lo como dados iniciais; a API continua a ser consultada para atualizar | Hoje a página fica vazia até: HTML → JS → 5 pedidos à API. É a maior parte do FCP de 3,6 s. Também torna o site resistente a uma falha momentânea da API | -0,5 a -1,0 s no FCP/LCP móvel | Médio | Médio (cache do servidor de 60 s: uma edição no CMS pode demorar até 1 min a aparecer na primeira carga; o modo de edição não é afetado) |
| 3 | **Alojar as fontes no próprio servidor** (DM Sans e Marcellus em WOFF2, `preload`, `font-display: swap`). São as mesmas fontes, sem alteração visual | «Render-blocking»: a folha de fontes do Google bloqueia ~**0,9 s** no móvel (poupança total estimada 1,35 s em `/`) | -0,6 a -0,9 s no FCP móvel; menos 2 origens externas (RGPD: sem pedidos ao Google) | Baixo–médio | Baixo |
| 4 | **Reduzir o JavaScript principal** (251 kB gzip; o Lighthouse indica ~125 kB não usados na primeira carga). Composição por código-fonte: react-dom 21 %, react-router 16 %, **zod 14 %**, **motion 18 %**, axios 6,5 %, react-query 7,6 %, tailwind-merge 4 %, dompurify 3 %. Hipóteses: `LazyMotion` com `domAnimation` (em vez de `motion` completo), carregar `dompurify` só quando se abre uma resposta do FAQ, `zod/mini` | `unused-javascript` | -40 a -100 kB gzip; ~-0,5 s de TTI no móvel | Médio | Médio (animações e validação de respostas da API; exige testes visuais) |
| 5 | **Imagens redimensionadas por ecrã** (`srcset`): gerar no upload variantes de 480/960/1600 px. As fotos do hero e de «Sobre Mim» têm ~1800–1900 px de largura mas aparecem a 256–320 px | `image-delivery`: **349 kB** a poupar em `/` | -300 kB por visita à Início | Médio (muda a API e o armazenamento) | Baixo |
| 6 | **Favicon** (`/favicon.ico` devolve 404 e não há `<link rel="icon">`). O Google mostra o favicon nos resultados de pesquisa; é também a única linha de erro da consola além de `bg-azul.webp` | `errors-in-console` | Melhor aspeto nos resultados; consola limpa | Baixo | Baixo, mas **precisa de um ícone aprovado** (pode recortar-se a hortênsia do logótipo) |
| 7 | **`width`/`height` no logótipo** (única imagem sem dimensões) | `unsized-images` | Sem efeito medido (CLS já é 0) | Médio (a API não guarda dimensões) | Baixo |
| 8 | `bg-azul.webp` em falta (404) | consola | Consola limpa | Baixo | Decisão: enviar a imagem ou remover a referência no CSS |
| 9 | `theme-color` e `site.webmanifest` | — | Marginal | Baixo | Baixo |

\* Estimativas por arredondamento dos números do Lighthouse e da cadeia de pedidos; **não foram medidas depois de aplicadas**. Combinar 1+2+3 deve levar o LCP móvel da Início de ~6 s para perto de 3–4 s; chegar abaixo de 2,5 s exige também o ponto 4.

## 2. Acessibilidade (efeito indireto em SEO) — precisa de decisão de design

O Lighthouse falha apenas o contraste de cor. **Não foi alterado** porque são cores do design (regra: não mudar o design).

| Elemento | Contraste atual | Mínimo AA | Nota |
|---|---|---|---|
| Botão «Marque uma consulta» (branco sobre `#3E7BB3`) | 4,47:1 | 4,5:1 | Falha por 0,03. Escurecer o azul um tom impercetível (ex.: `#3B78B0`) resolve |
| Botão «Falar no WhatsApp» (branco sobre `#25D366`) | **1,98:1** | 4,5:1 | Verde de marca do WhatsApp; para passar teria de ser um verde bem mais escuro ou texto escuro |
| Rodapé: copyright, Política de Privacidade, Termos (`#8E8D8E` sobre branco) | 3,27:1 | 4,5:1 | Texto a 50 % de opacidade |

## 3. Conteúdo e autoridade (não é código)

| Prioridade | Ação | Porquê |
|---|---|---|
| Alta | **Uniformizar o nome da marca.** O site usa «Mariline Bôto» nos títulos e no logótipo, mas o rodapé e o copyright dizem «A Sua Psicóloga Online» | O Google associa nome, site e pessoa; nomes diferentes enfraquecem a identidade da entidade nos resultados |
| Alta | Escrever o texto em falta de «Experiência Profissional» (hoje aparecem os nomes dos campos) | Conteúdo visível e indexável de má qualidade; falta de credibilidade (E-E-A-T, conteúdo de saúde) |
| Alta | Publicar **Política de Privacidade** e **Termos**, e tratar o consentimento nos formulários | Obrigação legal (dados de saúde) e sinal de confiança; hoje são links vazios |
| Alta | **Imagem de partilha 1200×630** no CMS | Pré-visualizações em WhatsApp, Facebook, LinkedIn |
| Média | Páginas próprias por área (`/areas/ansiedade`, `/areas/luto`…) com conteúdo único e links a partir da Início | Cada tema tem pesquisa própria («psicóloga ansiedade online»); hoje as 8 áreas partilham uma só URL. Exige novas páginas (decisão de design e conteúdo) |
| Média | Blog com artigos reais, depois `SEO_INDEX_BLOG=true` | Tráfego informacional; hoje o blog fica fora do índice |
| Média | Indicar de forma verificável a inscrição profissional (OPP n.º 28131), por exemplo com ligação à consulta pública da Ordem dos Psicólogos | Confiança e E-E-A-T |
| Média | Redes sociais com URL real | Passam para `sameAs` no schema |
| Baixa | Testemunhos/avaliações **reais** com consentimento (nunca inventados) | Prova social; só então faria sentido `Review`/`AggregateRating` |
| Baixa | Google Business Profile, se houver consultório ou área de serviço a declarar | Pesquisa local |

## 4. Infraestrutura e ações externas

- Definir `SITE_URL` e `TRUST_PROXY` em produção e confirmar os redirecionamentos 301 com o domínio real.
- **Brotli e HTTP/2/3** no proxy ou CDN (o Express só faz gzip). Um CDN (por exemplo Cloudflare) também aproxima as imagens do utilizador.
- Google Search Console: verificar o domínio, submeter `sitemap.xml`, acompanhar cobertura, Core Web Vitals e consultas reais.
- Rich Results Test e Schema Markup Validator no site publicado (não corríveis sem URL público).
- PageSpeed Insights/CrUX depois de existir tráfego: os números reais de utilizadores podem diferir dos de laboratório.

## 5. O que **não** vale a pena fazer agora

| Ideia | Razão |
|---|---|
| Migrar para Next.js/SSR | A regra do projeto (`.agents/04-stack`) exclui-o; o servidor já entrega metadados, schema e conteúdo em `<noscript>`; o Google renderiza JavaScript |
| `FAQPage` em schema | As respostas só existem no DOM depois de abertas, e o Google limita os resultados de FAQ a sites oficiais de saúde/governo |
| Marcação `Review`/`AggregateRating` sem avaliações reais | Seria inventar dados |
| Mais keywords nos textos | O texto já cobre os temas de forma natural; acrescentar arriscaria keyword stuffing |

## Sugestão de ordem

1. Itens 1, 2 e 3 (mesmo pacote: carregamento inicial), com nova medição antes/depois e comparação pixel a pixel.
2. Favicon e imagem de partilha (assim que houver o ficheiro aprovado).
3. Itens 4 e 5 (peso de JavaScript e imagens por ecrã).
4. Decisão de design sobre o contraste.
5. Conteúdo: marca, texto de experiência, páginas legais, páginas por área.

## Depois dos pontos 3, 4, 5 e 6 (medido)

| Página | Perfil | Desempenho antes → depois | LCP | FCP | CLS |
|---|---|---|---|---|---|
| `/` | Mobile | 70 → **82** | 6,2 s → 4,2 s | 3,6 s → 2,5 s | 0 → 0 |
| `/areas` | Mobile | 81 → **88** | 4,2 s → 3,5 s | 2,8 s → 2,5 s | 0 → 0 |
| `/` | Desktop | 96 → **99** | 1,3 s → 0,9 s | 0,7 s → 0,6 s | 0,001 → 0 |

SEO 100 · Acessibilidade 96/95 · Boas práticas 96 → 100 em `/areas` (o `/favicon.ico` já não dá 404; na Início ainda aparece o 404 de `bg-azul.webp`).

Medição própria (Chromium, Slow 4G, CPU 4×, mediana de 3): Início móvel **LCP 5,2 → 3,0 s**, transferência 790 → **434 kB**, imagens 506 → 86 kB, CLS 0,034 → 0. Desktop: FCP 304 → 88 ms, LCP 624 → 412 ms.

| Ponto | O que foi feito | Resultado |
|---|---|---|
| 3. Fontes | DM Sans (variável, com `opsz`) e Marcellus em WOFF2 em `public/fonts/`, declaradas em `src/fonts.css`, `font-display: swap`, `preload` das duas do primeiro ecrã, cache imutável de 1 ano. Já não há pedidos ao Google | Sem recursos que bloqueiem a renderização a terceiros; texto idêntico (diferença de pixels ≤ 0,03 %, sem qualquer reflow) |
| 4. JavaScript | `motion` passou a `LazyMotion` + `domAnimation` (componentes `m`): 42 → 28 kB gzip. Bibliotecas (React + router, motion, dados) separadas em ficheiros próprios (`vendor-*`) para ficarem em cache entre versões do site. JS inicial: 251 → ~237 kB gzip; «JavaScript não usado» 127 → 83 kB | Ganho modesto: o grosso é o React (92 kB) e as bibliotecas de dados (77 kB: react-query, axios, zod, i18next). Reduzir mais exigiria trocar essas bibliotecas (ver nota abaixo) |
| 5. Imagens por ecrã | A API gera no upload variantes de 480/960/1600 px (só quando poupam ≥ 15 % de largura), guarda largura e altura (migração `0004`) e devolve `width`, `height` e `srcset`. O site usa `srcset` + `sizes` por imagem e `width`/`height` (inclui o logótipo). As 6 imagens existentes foram tratadas com `python -m app.scripts.backfill_media`; o seed e as substituições/eliminações também tratam as variantes | Imagens a carregar na Início móvel: 506 → 86 kB; «imagens sem dimensões» e «entrega de imagens» resolvidos (349 → 66 kB) |
| 6. Favicon | Ícone recortado do logótipo existente (cérebro + flores): `favicon.ico` (16/32/48), `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `site.webmanifest` e `<link>` no HTML | 404 resolvido; o Google já pode mostrar o ícone nos resultados. **Rever o desenho**: é uma aguarela clara, fica pouco contrastado a 16–32 px; um ícone mais forte pode substituir estes ficheiros sem mexer no código |

**Nota sobre o JavaScript (4):** não foi possível ir mais longe sem trocar bibliotecas que o projeto usa por regra (`zod` para validar respostas, `axios`, `react-query`, `dompurify`). O DOMPurify tem de estar no carregamento inicial porque os textos «inline» do CMS passam por ele logo no primeiro ecrã. As opções que restam são mais invasivas: migrar para `zod/mini`, substituir `axios` por `fetch` no site público, ou separar do carregamento inicial o código do modo de edição (≈ 7 kB gzip).

**Ainda por fazer:** pontos 1 e 2 (pré-carregar o hero e embutir o conteúdo no HTML), que são os que mais baixam o LCP móvel; contraste de cor (decisão de design); texto/conteúdo da cliente.
