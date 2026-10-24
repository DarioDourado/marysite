# CMS — Mapa de conteúdo

Convenção: **Chave CMS** = `secção.item[.filho]`. Em listas, o índice é implícito (`about.intro[]`). A secção é a chave de topo do i18next, pelo que `t('hero.title')` continua a funcionar. Tipos: `text` (texto simples), `richtext` (HTML limitado), `image`, `link`, `list` (repetível), `group` (objeto).

> Estado final da implementação: ver também as notas no fim. `contacts` (incluindo o formulário) pertence à página `site`; `about.experienceItems` substitui os três campos `experienceChildhood/Adolescence/Adults`; as áreas são `areaPages[]`, cada uma com `slug` (identificador técnico, ícone e âncora, sem lápis), `title`, `summary`, `whatIs`, `signs[]` e `help`.

## Rotas públicas

| Rota | Página CMS | Notas |
|---|---|---|
| `/` | `home` | Hero, Sobre Mim, Áreas (resumo + FAQ), Citação, Abordagem, Marcação, Contactos |
| `/areas` | `areas` | Cabeçalho + 8 áreas detalhadas |
| `/blog` | `blog` | Título, introdução, estados vazio/erro/loading (sem artigos) |
| (global) | `site` | Navbar, rodapé, WhatsApp, marca |
| `/admin/*` | — | Backoffice; não é conteúdo |

## Página `site`

| Secção | Elemento | Tipo | Chave CMS | Repetível |
|---|---|---|---|---|
| nav | Início, Sobre Mim, Abordagem, Áreas, Blog, Contactos, Marcações Online | text | `nav.home`, `nav.about`, `nav.approach`, `nav.areas`, `nav.blog`, `nav.contacts`, `nav.booking` | Não |
| brand | Logótipo (imagem) | image | `brand.logo` | Não |
| brand | Texto alternativo / nome | text | `brand.name` (“Mariline Bôto”) | Não |
| footer | Título | text | `footer.title` | Não |
| footer | Descrição | text | `footer.description` | Não |
| footer | Morada/atendimento | text | `footer.location` | Não |
| footer | Cabeçalho “Links” | text | `footer.linksTitle` | Não |
| footer | Copyright | text | `footer.copyright` | Não |
| footer | Política de Privacidade / Termos (rótulo + URL) | text+link | `footer.privacy`, `footer.terms` | Não |
| footer | Instagram, LinkedIn (URL) | link | `footer.social[]` | Sim |
| whatsapp | Texto do botão | text | `whatsapp.cta` | Não |
| whatsapp | Mensagem pré-preenchida | text | `whatsapp.message` | Não |
| whatsapp | Número (formato `351…`) | text | `whatsapp.number` | Não |
| contacts | E-mail, rótulo, WhatsApp visível, rótulo | text | `contacts.email`, `contacts.emailLabel`, `contacts.whatsapp`, `contacts.whatsappLabel` | Não |

## Página `home`

| Secção | Elemento | Tipo | Chave CMS | Repetível |
|---|---|---|---|---|
| hero | Imagem de fundo | image | `hero.background` | Não |
| hero | Foto | image | `hero.photo` | Não |
| hero | Título, subtítulo, alt da foto | text | `hero.title`, `hero.subtitle`, `hero.imageAlt` | Não |
| hero | Bem-vindo (título) | text | `hero.welcomeTitle` | Não |
| hero | Parágrafo de boas-vindas | richtext | `hero.welcomeText` | Não |
| hero | Convite | richtext | `hero.ctaInvitation` | Não |
| hero | Botão | text | `hero.cta` | Não |
| about | Título (etiqueta) | text | `about.title` | Não |
| about | Nome (h2) | text | `about.name` | Não |
| about | Foto | image | `about.photo` | Não |
| about | Introdução | richtext | `about.intro[]` | Sim |
| about | Título dos valores | text | `about.valuesTitle` | Não |
| about | Valores (cards) | text | `about.values[]` | Sim |
| about | Título/subtítulos de formação e experiência | text | `about.educationTitle`, `about.educationSubtitle`, `about.experienceSubtitle` | Não |
| about | Parágrafos de formação | richtext | `about.education[]` | Sim |
| about | Experiência: introdução, 3 bullets, conclusão | text | `about.experienceIntro`, `about.experienceChildhood`, `about.experienceAdolescence`, `about.experienceAdults`, `about.conclusion` | **Em falta na fonte** (ver inconsistências) |
| areas | Título, introdução, imagem do banner, alt, “Saber mais” | text/image | `areas.title`, `areas.intro`, `areas.banner`, `areas.imageAlt`, `areas.learnMore` | Não |
| areas | Cards (8): título, resumo | group | `areaPages[].title`, `areaPages[].summary` | Sim |
| faq | Título “Perguntas Frequentes” | text | `faq.title` | Não |
| faq | Pergunta + resposta (6) | group (text + richtext) | `faq.items[].question`, `faq.items[].answer` | Sim |
| quote | Imagem de fundo | image | `quote.background` | Não |
| quote | Frase | text | `quote.text` | Não |
| approach | Título | text | `approach.title` | Não |
| approach | Introdução | richtext | `approach.intro[]` | Sim |
| approach | Introdução dos pontos | text | `approach.pointsIntro` | Não |
| approach | Pontos (título + texto) | group | `approach.points[].title`, `approach.points[].text` | Sim |
| approach | Fecho | richtext | `approach.closing[]` | Sim |
| approach | Alt (imagem não renderizada hoje) | text | `approach.imageAlt` | Não |
| booking | Foto | image | `booking.photo` | Não |
| booking | Título, texto | text/richtext | `booking.title`, `booking.text` | Não |
| bookingForm | Rótulos, placeholders, opções de horário, botão, mensagem de sucesso | text | `bookingForm.*` | Não |
| contacts | Título, texto 1, texto 2, formulário (rótulos, botão) | text | `contacts.title`, `contacts.questions`, `contacts.reply`, `contacts.form.*` | Não |

## Página `areas`

| Secção | Elemento | Tipo | Chave CMS | Repetível |
|---|---|---|---|---|
| areasPage | Título, introdução, introdução da navegação | text | `areasPage.title`, `areasPage.intro`, `areasPage.navIntro` | Não |
| areasPage | Títulos “O que é”, “Sinais de alerta”, “Como posso ajudar” | text | `areasPage.whatIs`, `areasPage.signs`, `areasPage.help` | Não |
| areaPages | Área: `key` (slug, usado em `#id`/ícone), título | group | `areaPages[].title` | Sim |
| areaPages | O que é, Como posso ajudar | richtext | `areaPages[].whatIs`, `areaPages[].help` | Não |
| areaPages | Sinais de alerta | text | `areaPages[].signs[]` | Sim |
| (seo) | Título e descrição da página | text | SEO da página | Não |

## Página `blog`

| Secção | Elemento | Tipo | Chave CMS | Repetível |
|---|---|---|---|---|
| blog | Título, introdução, vazio, loading, erro | text | `blog.title`, `blog.intro`, `blog.empty`, `blog.loading`, `blog.error` | Não |

## SEO

Não existe SEO hoje. O CMS passa a guardar `seo_title` e `seo_description` (e imagem OG) por página e idioma, aplicados a `<title>` e `<meta name="description">`. Valores iniciais: o título e a introdução já existentes de cada página.

## Conteúdo fixo, não exposto ao CMS

Ícones (`AreaIcon`), numeração dos pontos de abordagem, classes e animações, rotas e âncoras (`#about`, `#booking-section`…), slug das áreas (identificador técnico), página de manutenção, fallbacks de imagem remotos do Pexels, lógica do formulário.

## Notas da implementação

- **Tipos de texto:** `text` (simples), `inline` (formatação inline dentro de um `<p>` já existente) e `richtext` (HTML em bloco; só as respostas do FAQ). Todo o HTML é sanitizado no servidor (nh3) e no browser (DOMPurify).
- **Ligações:** `footer.privacy`, `footer.terms` e `footer.social[]` são itens `link` (texto e URL). O URL e as descrições de imagens, placeholders e `aria-label` editam-se em «Textos escondidos».
- **Chaves não migradas** (nenhum componente as usa): `areas.list`, `areas.subtitle`, `areas.ctaText`, `approach.imageAlt`.
- **Imagens:** `hero.background`, `hero.photo`, `about.photo`, `booking.photo`, `quote.background`, `areas.banner`, `areasPage.banner`, `brand.logo`. O caminho original (`/img/...`) mantém-se como alternativa se o CMS ainda não tiver a imagem.
- **Adicionar uma área nova** cria o texto, mas o `slug` (e por isso o ícone e a âncora) tem de ser definido por quem mantém o código.

## Inconsistências encontradas

1. **Chaves usadas e nunca definidas** (renderizam a própria chave no site hoje): `about.experienceIntro`, `about.experienceChildhood`, `about.experienceAdolescence`, `about.experienceAdults`, `about.conclusion`. Não há texto fonte (nem no `.docx` de pedidos). O seed cria estes campos com o texto atualmente visível (a chave) para o site ficar visualmente idêntico, e a cliente deve preenchê-los.
2. **WhatsApp**: README indica 910 979 513; o código (`ContactSection`, `whatsapp.ts`, `Footer`, i18n) usa 965 608 731. O seed usa o número do código (o que está em produção). Valor único em `whatsapp.number`, usado também no `href`.
3. **Mortos/parciais**: `areas.list.*` (6 entradas numeradas) não é usado (as áreas vêm de `areasContent.ts`, 8 entradas); `areasPage.*` e `areasContent.ts` só existem em PT; `approach.imageAlt` não é usado.
4. **Strings fixas fora do i18n**: FAQ (6), BookingForm, Footer (títulos, copyright, links), nome “Mariline Bôto” (h2/alt), `aria-label="Toggle Menu"`. Passam a chaves CMS com o texto atual como valor PT.
5. **EN**: só existe tradução para o que está em `i18n.ts`; FAQ/BookingForm/Footer/áreas não têm EN. O seed só cria EN onde há fonte; sem EN, o i18next usa PT (`fallbackLng`).
6. **Formulários** sem envio (fora do âmbito); `alert()` hardcoded no BookingForm passa a texto CMS.
7. **Imagens**: caminhos fixos `/img/*.webp` e logótipo `/img/logo/Logotipo%20Lateral.webp`; passam a `Media` no CMS (o seed copia os ficheiros existentes), mantendo o caminho atual como fallback.
