# Páginas legais: Política de Privacidade e Termos e Condições

Data: 2026-11-11 · Estado: aprovado em conversa (design); a aguardar revisão do spec escrito.

## Objetivo

Acrescentar duas páginas públicas, `/privacidade` e `/termos`, com o texto guardado no CMS (editável no backoffice pela cliente), em português e inglês. As ligações já existentes no rodapé passam a apontar para elas.

Fora de âmbito: permissões do admin nas Configurações (tem spec próprio, a seguir a este) e qualquer alteração ao design das páginas existentes.

## Restrição absoluta

O design do site público não pode mudar (ver memória `feedback_never-change-design`). As páginas novas reutilizam classes e componentes que já existem; nenhum componente existente é alterado a nível visual. O rodapé não muda no código, só os URLs no CMS.

## Decisões

| Tema | Decisão |
|---|---|
| Onde vive o texto | CMS, como páginas novas `privacy` e `terms` (padrão de `home`, `areas`, `blog`) |
| Rotas | `/privacidade`, `/termos` |
| Idiomas | PT e EN seedados; o EN fica oculto enquanto `I18N=false` |
| Origem do texto | Rascunho redigido por mim; a cliente ou um jurista revê antes de publicar |
| Dados em falta | Marcadores visíveis `[NIF]`, `[Morada]`, etc. no texto, a preencher no backoffice |
| SEO | Indexáveis, no sitemap, com title/description editáveis no CMS |

## Arquitetura

### API (`marysite-api`)

- `app/models/page.py`: `PAGE_SLUGS` passa a `("site", "home", "areas", "blog", "privacy", "terms")`.
- `app/seed_data/legal.py` (novo): `PT` e `EN` com, por página, as secções `privacy` e `terms`. Cada uma tem `title`, `updated` (data da última atualização), `intro` (`Inline`) e `body` (`Rich`, HTML em bloco com `h2`, `h3`, `p`, `ul`, `ol`, `strong`, `a`, as únicas tags que o sanitizer deixa passar).
- `app/seed_data/pages.py`: registar as duas páginas em `PAGES` e o SEO inicial em `SEO_SOURCES` (título até ~60 caracteres, descrição entre ~140 e ~160, em PT e EN).
- Não há migração de schema: o seed cria o que falta e nunca reescreve o que já foi editado.
- Passo adicional no seed: nos itens `footer.privacy` e `footer.terms`, trocar o `link_url` para `/privacidade` e `/termos` **só se ainda for `#`**, para não desfazer edição da cliente. Sem isto a base já existente ficaria com as ligações antigas, porque o seed não reescreve itens existentes.
- Permissões por página: utilizadores já existentes não recebem acesso automático às páginas novas. O superuser atribui-o em Configurações. Quem for criado a partir daqui recebe todas as páginas por omissão (comportamento atual).

### Frontend (`marysite`)

- `src/types/cms/cms.types.ts`: `PAGE_SLUGS` acrescenta `privacy` e `terms`.
- `src/lib/cms/loadContent.ts`: `cacheSchema` acrescenta as duas páginas e `CACHE_KEY` passa a `cms:content:v2`. Uma cache v1 antiga é simplesmente ignorada.
- `src/pages/Legal/LegalPage.tsx` (novo): componente partilhado, recebe o `slug` (`privacy` ou `terms`), que é ao mesmo tempo o prefixo da secção do CMS e o slug de SEO. Estrutura:
  - `<section className="pt-12 md:pt-14 min-h-screen bg-muted">`, o fundo que as Áreas usam atrás dos cartões (com `bg-surface` o cartão não se destacava);
  - cabeçalho com `h1` (mesmas classes do `h1` do Blog), data «Última atualização» e introdução;
  - corpo num cartão com as classes do cartão das Áreas (`bg-surface rounded-tile border border-line shadow-card`), com `RichHtml` (editável com o lápis) e `max-w-3xl`.
- `src/pages/Legal/Privacy.tsx` e `Terms.tsx` (novos): wrappers finos que chamam `useSeo('privacy' | 'terms')` e `LegalPage`.
- `src/routes/routes.config.tsx`: duas rotas `lazy` dentro do `Layout`, antes do `*`.
- Rodapé (`Footer.tsx`): sem alterações. Os links passam a `/privacidade` e `/termos` por dados. Como o rodapé usa `<a href>` para estes dois, a navegação faz um carregamento completo da página (funciona; o servidor trata do pedido).

### Servidor de SEO (`server/seo`)

- `routes.ts`: `slug` passa a incluir `'privacy' | 'terms'`; acrescentar `{ path: '/privacidade', slug: 'privacy', indexable: true }` e `{ path: '/termos', slug: 'terms', indexable: true }`. O sitemap e a classificação de rotas usam esta lista, por isso o resto segue.
- `meta.ts`: o tipo do slug em `imageFor` alarga-se aos novos.
- `html.ts`: o `noscript` ganha um corpo para as páginas legais (`h1`, introdução e o corpo em HTML, já sanitizado na API).
- `jsonld.ts`: o nome do `BreadcrumbList` passa a usar o título da página legal em vez do ramo `blog.title`; o `WebPage` mantém-se.
- `content.ts` já percorre `PAGE_SLUGS`, por isso carrega as páginas novas sem alteração.

## Conteúdo do rascunho (PT e EN)

**Política de Privacidade (RGPD)**
1. Responsável pelo tratamento: Mariline Bôto, contactos (e-mail e WhatsApp do CMS), `[NIF]`, `[Morada]`.
2. Dados recolhidos: formulários de marcação e de contacto (nome, e-mail, telefone se pedido, mensagem), guardados na base de dados do site e visíveis só a admin e superuser; contacto por WhatsApp ou e-mail iniciado pelo utilizador.
3. Finalidades e fundamento de licitude: responder a pedidos e marcar consultas (diligências pré-contratuais e consentimento).
4. Conservação: `[prazo de conservação]`.
5. Destinatários e subcontratantes: alojamento do site e da API (`[fornecedor]`); sem venda de dados nem partilha para marketing.
6. Direitos do titular: acesso, retificação, apagamento, limitação, oposição, portabilidade, retirar o consentimento; como exercê-los por e-mail.
7. Reclamação à CNPD (cnpd.pt).
8. Cookies e armazenamento local: **sem cookies de rastreio, analytics ou publicidade**. O site usa `localStorage` do navegador apenas para a preferência de idioma e uma cópia do conteúdo do site (desempenho); a área de gestão usa ainda um cookie técnico de sessão (`refresh_token`, HttpOnly) só para quem inicia sessão.
9. Segurança, menores, alterações à política e data da última atualização.

**Termos e Condições**
1. Identificação e âmbito (uso do site e dos serviços).
2. Natureza do serviço: consultas de psicologia clínica online; o site é informativo e **não substitui atendimento de urgência** (112 e SNS 24: 808 24 24 24).
3. Marcações, `[política de cancelamento e faltas]` e `[honorários e pagamento]`.
4. Sigilo e deontologia (Ordem dos Psicólogos Portugueses; `[n.º de cédula]`).
5. Propriedade intelectual dos conteúdos do site.
6. Limitação de responsabilidade (conteúdo informativo, disponibilidade do site, ligações externas).
7. Proteção de dados: remissão para a Política de Privacidade.
8. Lei aplicável e foro, Livro de Reclamações Eletrónico (livroreclamacoes.pt) e resolução alternativa de litígios, alterações aos termos e data.

Os marcadores entre parênteses retos ficam em texto visível. O texto é um rascunho informativo e não aconselhamento jurídico; a revisão antes de publicar é obrigatória e fica registada no relatório final.

## Ordem de deploy (crítica)

O frontend carrega todas as páginas de `PAGE_SLUGS` no arranque; se for publicado antes de a API ter `privacy` e `terms`, o pedido devolve 404 e o site falha. Ordem obrigatória:
1. Publicar a API com o `PAGE_SLUGS` novo e correr `python -m app.scripts.seed`.
2. Só depois publicar o frontend e o servidor de SEO.

## Testes e verificação

- **pytest (API):** o seed cria as duas páginas com PT e EN e o SEO; é idempotente (segunda execução não cria nada nem reescreve edição); o passo dos links do rodapé só troca `#` e deixa intactos URLs já editados; `GET /public/pages/privacy` e `/terms` respondem com as secções esperadas.
- **vitest (frontend):** `loadContent` com `cacheSchema` v2; render de `Privacy` e `Terms` com conteúdo mockado (título, corpo sanitizado, sem tags fora da lista); rotas registadas.
- **vitest (servidor de SEO):** `classify('/privacidade')` e `/termos` devolvem `public`; o sitemap inclui as duas; `noscript` e breadcrumb corretos.
- **Visual (Chromium, desktop e mobile):** páginas novas e rodapé; Home, Áreas e Blog antes e depois, para confirmar que nada mudou.
- **Gates:** `npm run lint`, `npm test`, `npm run build` no frontend; `pytest` na API.

## Riscos

- Texto legal não revisto por jurista: mitigado por marcadores visíveis e pela revisão obrigatória antes de publicar.
- Ordem de deploy: mitigada pelo passo explícito acima.
- Utilizadores existentes sem acesso às páginas novas no CMS: o superuser atribui em Configurações.
