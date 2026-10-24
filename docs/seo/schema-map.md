# Dados estruturados (Schema.org JSON-LD)

Gerados no servidor (`server/seo/jsonld.ts`) a partir do conteúdo **real** do CMS, num único bloco `@graph` por página. Nada é inventado: sem avaliações, preços, disponibilidade, morada, certificações ou redes sociais inexistentes.

| Tipo | Páginas | Dados usados (origem) | Observações |
|---|---|---|---|
| `ProfessionalService` (`#business`) | `/`, `/areas`, `/blog` | nome, descrição do rodapé, e-mail, telefone (WhatsApp, normalizado para `+351…`), `areaServed` = «Atendimento Online / Lisboa» (texto do rodapé), logótipo, fotografia, `knowsAbout` = títulos das 8 áreas, `sameAs` | `sameAs` só inclui URLs `http(s)` reais; hoje as redes sociais têm `#`, por isso a propriedade é omitida |
| `Person` (`#person`) | idem | nome, `jobTitle` «Psicóloga Clínica», fotografia, `worksFor` | Sem `sameAs`/credenciais (OPP n.º está no texto, mas não se estruturou para não criar um identificador mal formado) |
| `WebSite` (`#website`) | idem | url, nome, idioma `pt-PT`, `publisher` | Sem `SearchAction` (o site não tem pesquisa) |
| `WebPage` | idem | url canónica, título e descrição SEO, `isPartOf`, `about`, imagem principal | |
| `BreadcrumbList` | `/areas`, `/blog` | Início › Áreas de Intervenção / Blog | |
| `Service` (×8) | `/areas` | título, resumo, URL com âncora (`/areas#trauma`…), `provider` | Um por área, com os textos visíveis |

## Avaliados e **não** implementados

| Tipo | Razão |
|---|---|
| `FAQPage` | As respostas do FAQ só entram no DOM depois de abertas (acordeão); marcar como FAQ conteúdo que não está visível na página viola as regras do Google. O Google também limita FAQ rich results a sites oficiais de saúde/governo. Sem ganho, com risco |
| `LocalBusiness` com morada | Não existe morada nem consultório no site |
| `Article` / `BlogPosting` | O blog não tem artigos |
| `AggregateRating` / `Review` | Não existem avaliações (proibido inventar) |
| `Offer` / preços | O FAQ menciona valores (50 € / 180 €) mas apenas em texto livre; estruturá-los comprometeria a cliente se mudarem |
| `ImageObject` isolado | Coberto por `primaryImageOfPage` |

## Validação

| Verificação | Estado |
|---|---|
| JSON válido, `<` escapado, um só `<script>` por página | ✔ coberto por testes (`server/seo/seo.test.ts`) |
| Sem schemas duplicados ou conflitantes (um só grafo, ids estáveis `#business`, `#person`, `#website`, `#webpage`) | ✔ |
| Conteúdo do schema = conteúdo visível (nome, e-mail, telefone, áreas, títulos) | ✔ por construção (mesma fonte do CMS) |
| **Schema Markup Validator / Rich Results Test** (validator.schema.org, search.google.com/test/rich-results) | ⏳ **Pendente**: são serviços externos que exigem o site publicado num URL público; não foi possível executá-los neste ambiente. Executar após o deploy |
