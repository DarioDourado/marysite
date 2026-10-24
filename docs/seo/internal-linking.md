# Arquitetura de links internos

## Mapa atual

```
/ (Início)
├── navegação principal ─► /, /#about, /areas, /#approach, /blog, /#contacts, /#booking-section (botão)
├── cartões «Saber mais» ──► /areas#trauma … /areas#crises (8)
├── CTA «Marque uma consulta» ─► #booking-section
└── rodapé ─► /, /#about, /areas, /#booking-section, /blog
/areas
├── índice de âncoras ─► #trauma … #crises (8)
├── CTA final ─► /#booking-section
└── navegação e rodapé (iguais)
/blog
└── navegação e rodapé (iguais)
```

Todas as 3 páginas públicas recebem links da navegação principal e do rodapé: **não há páginas órfãs**. Não foram encontradas ligações quebradas entre rotas.

## Alterações feitas

| Problema | Alteração | Efeito visual |
|---|---|---|
| Rodapé «Áreas de Intervenção» apontava para `/#areas` (secção resumida da Home) enquanto a navegação aponta para `/areas` | Passou a apontar para `/areas` | Nenhum |
| 8 links «Saber mais» idênticos, sem contexto para robôs e leitores de ecrã | Acrescentado texto só para leitores de ecrã (`sr-only`): «Saber mais — Trauma», etc. | Nenhum (o texto visível é o mesmo) |
| Duas navegações sem nome (`<nav>` dentro de `<nav>` no menu móvel) | A principal tem `aria-label` («Navegação principal»); o menu móvel passou a `<div>` dentro dela | Nenhum |
| Conteúdo e links só existiam depois de executar JavaScript | `<noscript>` no HTML inicial com o conteúdo principal e links para `/`, `/areas`, `/blog` | Nenhum (o `<noscript>` não se vê com JavaScript ativo) |

## Pendentes (precisam de decisão ou conteúdo da cliente)

| Item | Estado | O que falta |
|---|---|---|
| Instagram, LinkedIn, Política de Privacidade, Termos e Condições | `href="#"` (4 links vazios) | URLs reais / páginas legais. Não se inventaram. Quando existirem, o schema passa a incluir as redes em `sameAs` automaticamente |
| Links contextuais dentro do texto (ex.: de «Sobre Mim» para `/areas`) | Não existem | Edição de conteúdo no CMS; evitam-se links artificiais |
| Ligação da página de áreas para a abordagem (`/#approach`) | Não existe | Opcional; alteração de conteúdo |
| Âncoras `/areas#slug` | Funcionam, mas o Google trata-as como a mesma URL | Páginas por área (ver `keyword-strategy.md`) |
