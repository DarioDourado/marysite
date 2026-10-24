# Relatório de desempenho (Core Web Vitals de laboratório)

**Método:** Chromium headless (Playwright), build de **produção** servido por `server.ts`, API real local. 3 execuções por cenário, mediana. «Desktop»: 1280×800 sem limitação. «Mobile»: 390×844, rede Slow 4G (1,6 Mbit/s, 150 ms de latência) e CPU 4× mais lento. «Antes» = commit `d82e314` servido da mesma forma; «Depois» = estado atual.

> Dados de **laboratório** num computador local: servem para comparar antes/depois, não são dados de utilizadores reais (CrUX/PageSpeed Insights só funcionam com o site publicado). **INP** não é medível em laboratório sem interações reais; a página não tem handlers pesados nem JavaScript de terceiros, por isso o risco é baixo. **TTFB** local (~2–4 ms) não é representativo.

## Resultados

| Cenário | Métrica | Antes | Depois | Variação |
|---|---|---|---|---|
| Início, mobile Slow 4G | **LCP** | **41,5 s** | **5,2 s** | -87 % |
| Início, mobile Slow 4G | FCP | 4,9 s | 2,0 s | -59 % |
| Início, mobile Slow 4G | Dados transferidos | 8,0 MB | 0,77 MB | -90 % |
| Início, desktop | LCP | 0,86 s | 0,62 s | -27 % |
| Início, desktop | Dados transferidos | 8,0 MB | 0,77 MB | -90 % |
| Áreas, mobile Slow 4G | LCP | 5,8 s | 2,9 s | -50 % |
| Áreas, mobile Slow 4G | FCP | 4,9 s | 2,0 s | -59 % |
| Áreas | Dados transferidos | 1,0 MB | 0,36 MB | -66 % |
| Todas | **CLS** | 0,001 (desktop) / 0,034–0,045 (mobile) | idêntico | sem alteração (já «bom», < 0,1) |
| Todas | JavaScript transferido | 787 kB (sem compressão) | 258 kB (gzip) | -67 % |
| Todas | CSS transferido | 41 kB | 8 kB (gzip) | -80 % |
| Todas | Documento HTML | 0,4 kB (vazio) | 5 kB (com metadados, schema e conteúdo `<noscript>`) | +4,6 kB |

Elemento LCP: a imagem de fundo do hero na Início (antes 4,3 MB, agora 221 kB) e o banner em `/areas`.

## O que mudou e porquê

| Alteração | Efeito |
|---|---|
| Hero 4,3 MB → 221 kB; citação 2,7 MB → 517 kB; logótipo 167 → 58 kB | Maior ganho: era o que dominava o LCP e o peso total |
| Compressão gzip no servidor (`compression`) | JS 787 → 258 kB, CSS 41 → 8 kB, HTML comprimido |
| Cache: `/assets/*` e `/media/*` com `max-age=1 ano, immutable` (nomes com hash/ULID); `index.html` sempre revalidado; restantes ficheiros 1 h | Visitas repetidas sem descarregar de novo |
| Fontes Google: de `@import` no CSS para `<link>` + `preconnect` no HTML | A folha de fontes passa a ser pedida em paralelo com o CSS (antes só depois dele) |
| `fetchpriority="high"` nas imagens do topo; `loading="lazy"` + `decoding="async"` abaixo da dobra | O browser prioriza o que se vê primeiro e adia o resto |
| Limite de 2400 px nos uploads futuros do CMS | Impede que uma foto de 6000 px volte a atrasar o site |

## Verificação de que o design não mudou

Capturas de página inteira (desktop 1440 px e mobile 390 px, animações reduzidas) de `/`, `/areas` e `/blog`, antes e depois, comparadas pixel a pixel (`pixelmatch`, limiar 0,1):

| Captura | Pixels diferentes |
|---|---|
| desktop `/areas` | 0,002 % |
| desktop `/blog` | 0,013 % |
| desktop `/` | 0,054 % |
| mobile `/areas` | 0,001 % |
| mobile `/blog` | 0,005 % |
| mobile `/` | 0,055 % |

As diferenças estão **todas** nos primeiros ~600 px (hero) e no logótipo: reamostragem das imagens mais pequenas e a animação de zoom do hero (que já gerava ~0,1 % de ruído entre execuções). A inspeção visual lado a lado do hero não mostra diferença. Não há alterações de layout, cores, tipografia nem espaçamentos.

## Por fazer / oportunidades (não aplicadas)

| Oportunidade | Porquê não foi aplicada |
|---|---|
| Reduzir o JavaScript principal (775 kB / 250 kB gzip) com `manualChunks` ou carregamento diferido de `motion`/`zod` | Risco para animações e formulários; exige medição própria e testes visuais. É o maior ganho restante no LCP móvel (5,2 s ainda acima dos 2,5 s) |
| Renderizar o conteúdo no servidor (SSR/SSG) para eliminar a espera «JS → API → render» | Fora do âmbito da stack declarada em `.agents/04-stack`; exige trocar de framework |
| Pré-carregar a imagem do hero e os dados da API a partir do HTML | A URL do hero vem do CMS; possível com o servidor atual mas mexe no carregamento de conteúdo (risco de regressões) |
| Self-host das fontes | Tornaria o site independente do Google Fonts (menos 2 origens); exige descarregar os ficheiros das fontes |
| Compressão Brotli | `compression` só faz gzip; o ideal é o proxy/CDN de produção (Nginx, Cloudflare) fazer Brotli |
| Lighthouse CI no pipeline | Sem pipeline CI configurado neste projeto |
