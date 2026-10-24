# Auditoria de imagens e media

Todas as imagens do site vêm da biblioteca do CMS (`/media/<ULID>.webp`) ou, se o CMS não tiver a imagem, de `public/img/*.webp`. O texto alternativo de imagens de conteúdo é editável no CMS («Textos escondidos»).

| Página | Imagem | Problema | Correção | Alt text final |
|---|---|---|---|---|
| `/` (Hero) | Fundo (hortênsias) 6000×4002, **4,3 MB** | Provável elemento LCP; 20× mais pesada do que o necessário | Reduzida para 2400 px de lado maior, WebP q82: **221 kB** (-95 %); `fetchpriority="high"`, sem lazy | `""` (decorativa: o texto e a fotografia já descrevem a secção) |
| `/` (Hero) | Fotografia da Mariline 1792×2400, 101 kB | Sem prioridade de carregamento | `fetchpriority="high"` | Mariline Bôto, Psicóloga Clínica |
| `/` (Sobre Mim) | Retrato 1916×2240, 130 kB | Alt só com o nome; sem lazy | `loading="lazy"` + alt contextual | Retrato de Mariline Bôto, psicóloga clínica |
| `/` (Áreas) | Banner «mãos unidas» 1331×2000, 29 kB | Abaixo da dobra sem lazy | `loading="lazy"` | Mãos unidas sobre fundo claro (já descritivo) |
| `/` (Citação) | Fundo (flores) 3936×3936, **2,7 MB** | Peso; abaixo da dobra | 2400×2400 WebP q82: **517 kB** (-81 %); `loading="lazy"` | `""` (decorativa; a citação é texto) |
| `/` (Marcação) | Mesmo retrato | Alt repetido da secção anterior | `loading="lazy"` + alt próprio | Mariline Bôto, psicóloga clínica |
| Todas (navegação) | Logótipo 3239×828, 167 kB, mostrado a 156×40 | Excessivo para o tamanho de uso | 960×245 WebP: **58 kB** (-65 %, ainda 3× a densidade necessária em ecrãs 2×) | Mariline Bôto (nome da marca) |
| `/areas` | Banner 1331×2000, 29 kB | É a imagem do topo da página (LCP) | `fetchpriority="high"` | Mãos unidas sobre fundo claro |

## Pipeline de upload (evita que o problema volte)

`marysite-api/app/services/media_service.py`: qualquer imagem enviada ao CMS (upload ou substituição) passa a ser limitada a **2400 px no lado maior** (sem ampliar imagens pequenas) antes de converter para WebP. Dois testes novos: redução de 4800×3200 → 2400×1600 e imagem pequena inalterada. Conversão para WebP, remoção de EXIF e limites de tamanho já existiam.

## Decisões e limites

- **Dimensões (`width`/`height`)** (aplicado numa segunda ronda): a API passou a guardar as dimensões e o site usa-as nos atributos `width`/`height`. O tamanho visível continua a vir do CSS, por isso o aspeto não muda; o CLS medido passou de 0,034 para 0 no telemóvel.
- **`srcset`/`sizes`** (aplicado numa segunda ronda): a API gera variantes de 480/960/1600 px no upload e o site escolhe pelo ecrã; ver `optimization-roadmap.md`.
- **AVIF**: não usado; WebP é suficiente e universal.
- **Qualidade visual**: o hero e a citação foram comparados com capturas antes/depois (ver `performance-report.md`); sem diferença percetível.
- **Originais**: as versões originais das 3 imagens substituídas ficaram guardadas fora do repositório (cópia de segurança da sessão). Se quiser repor a qualidade máxima de uma imagem, basta fazer novo upload no CMS: o limite de 2400 px aplica-se sempre.
- **Ficheiros em `public/img/`** (`hortensias.webp` 4,3 MB, `florescimento.webp` 2,7 MB): são só *fallback* (usados se o CMS não tiver imagem) e continuam por otimizar. Não são pedidos pelo site em funcionamento normal.
- **Imagem de fundo `bg-azul.webp`**: referenciada pelo CSS (`.bg-blue-texture`, secções Sobre Mim e Abordagem) mas **o ficheiro nunca foi fornecido**. Antes o pedido recebia o `index.html` (HTTP 200); agora devolve 404 correto e aparece uma linha na consola. Visualmente nada muda (fica o azul liso). Decisão da cliente/designer: fornecer a imagem ou remover a referência.
- **Imagem de partilha (Open Graph)**: ver `metadata-map.md`.
