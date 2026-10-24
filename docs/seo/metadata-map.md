# Mapa de metadados (estado final)

Os títulos e descrições vivem no **CMS** (`/admin` → «SEO» de cada página) e são servidos no HTML inicial pelo servidor (`server/seo/`). O domínio vem da variável `SITE_URL` (aqui `https://<SITE_URL>`).

| URL | SEO title (car.) | Meta description (car.) | H1 | Canonical | OG image |
|---|---|---|---|---|---|
| `/` | Psicóloga Clínica Online – Psicoterapia \| Mariline Bôto (55) | Psicoterapia online com a psicóloga clínica Mariline Bôto: apoio em trauma, luto, ansiedade e depressão, com terapia cognitivo-comportamental. Marque consulta. (159) | A sua singularidade merece ser vista, compreendida e cuidada. | `https://<SITE_URL>/` | Fotografia principal (`hero.photo`) — ver nota |
| `/areas` | Áreas de Intervenção em Psicologia Clínica \| Mariline Bôto (58) | Trauma, luto, ansiedade, depressão, POC, autoestima, relacionamentos e crises de vida: conheça os sinais de alerta e como a psicoterapia online pode ajudar. (156) | Áreas de Intervenção | `https://<SITE_URL>/areas` | Idem |
| `/blog` (`noindex` por agora) | Blog de Saúde Mental e Bem-Estar \| Mariline Bôto (48) | Reflexões e conteúdos sobre saúde mental, bem-estar emocional e psicoterapia, partilhados pela psicóloga clínica Mariline Bôto. Em breve, novos artigos. (152) | Blog | `https://<SITE_URL>/blog` | Idem |
| `/admin/*` | Título da página de gestão | — | — | **Sem canonical**; `noindex, nofollow` + cabeçalho `X-Robots-Tag` | — |
| Qualquer URL inexistente | Página não encontrada · Mariline Bôto | — | Página não encontrada | **Sem canonical**; HTTP 404; `noindex, follow` + `X-Robots-Tag` | — |

Antes → depois dos títulos/descrições: ver `site-inventory.md` §2 (título/descrição inicial) e `content-changelog.md`.

## Todas as páginas indexáveis têm

`<title>` único · `meta description` única · `<link rel="canonical">` absoluto · `og:type`, `og:site_name`, `og:locale` (`pt_PT`), `og:title`, `og:description`, `og:url`, `og:image` (+ `og:image:alt`) · `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` · `<html lang="pt-PT">` · `robots: index, follow, max-image-preview:large`.

## Nota sobre a imagem de partilha

O CMS permite definir uma imagem de partilha por página (campo «og:image» no painel SEO), mas **nenhuma estava definida**. Para não ficar sem imagem, o servidor usa a fotografia principal já publicada no site (`hero.photo`, retrato 3:4) com `twitter:card=summary_large_image`. O ideal é uma imagem **1200×630** própria (por exemplo, o retrato sobre o fundo de hortênsias), carregada no CMS: assim que existir, passa a ser usada automaticamente.

## Regras de qualidade aplicadas

- Títulos 48–58 caracteres (alvo 50–60); descrições 152–159 (alvo 140–160).
- Sem repetições entre páginas, sem keyword stuffing, sem promessas (nada de «melhor», «garantido», preços ou resultados).
- Texto em português de Portugal.
- A página `site` (título «Mariline Bôto \| Psicóloga Clínica») é só a base usada se uma página não tiver SEO próprio.

## Como se mantém

1. Editar no CMS (modo de edição → «SEO»). Alterações aparecem no HTML servido em até 60 s (cache do servidor).
2. Valores iniciais em instalações novas: `marysite-api/app/seed_data/pages.py` (`SEO_SOURCES`).
