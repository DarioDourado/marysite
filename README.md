# Mariline Bôto · Psicóloga Clínica

Website de apresentação e marcação de consultas online da psicóloga clínica Mariline Bôto.

O site foi pensado para transmitir calma, acolhimento e confiança, com um visual leve em tons de azul claro e branco, e hortênsias como elemento de identidade.

## O que o site tem

**Página inicial** (uma única página, com secções por onde se navega a partir do menu):

| Secção | Do que trata |
| --- | --- |
| **Início** | Mensagem de boas-vindas, convite ao primeiro passo e botão para marcar consulta. |
| **Sobre Mim** | Apresentação da Mariline, formação e experiência profissional. |
| **Áreas de Intervenção** | Os temas em que a Mariline acompanha, e perguntas frequentes (valores, duração das sessões, como funcionam as consultas online, confidencialidade). |
| **A Minha Abordagem** | Como trabalha: as terapias em que se baseia e o que pode esperar do processo. |
| **Marcações Online** | Formulário para pedir uma consulta, com as preferências de horário. |
| **Contactos** | E-mail, WhatsApp e formulário para dúvidas. |

**Blog** (página própria, acessível pelo menu): espaço para artigos sobre saúde mental e bem-estar. Vai crescendo à medida que se publica, por isso tem uma página separada. Para já mostra a mensagem "Em breve, partilharei aqui os primeiros artigos."

## Em detalhe

- **Idiomas:** português e inglês, com troca no menu.
- **Telemóvel e computador:** o site adapta-se a qualquer ecrã.
- **Animações:** os textos e imagens aparecem com um efeito suave e discreto ao fazer scroll. No telemóvel este efeito fica desligado, para o site ser mais rápido.
- **Imagens:** fotografias, logótipo e fundos ficam na pasta `public/img`, em formato WebP (leve e rápido). Os originais em JPG/PNG ficam guardados em `public/img/jpg`, só como cópia de segurança.
- **Página de manutenção:** quando for preciso fazer alterações, o site pode ser colocado em modo de manutenção. Os visitantes veem uma página simples com o logótipo e os contactos, em vez do site.

## Gestão de conteúdo (CMS)

Todo o texto, imagem, lista e SEO do site é editado **no próprio site**, sem alterar o design. O conteúdo vive na API (`../marysite-api`, FastAPI + SQLite).

- **Entrar:** o ícone discreto do cadeado, no rodapé, abre o login. Sem sessão não há mais nada de edição no site.
- **Editar:** com sessão aparece uma barra no canto inferior esquerdo. Em «Editar», cada elemento mostra um lápis:
  - títulos, subtítulos, botões e contactos: o campo fica editável no sítio;
  - parágrafos e FAQ: abre-se um editor com negrito, itálico, sublinhado, listas, títulos e ligações;
  - imagens: o lápis abre a biblioteca (pesquisar, reutilizar ou enviar; tudo é convertido para WebP);
  - listas: adicionar, remover (com confirmação), subir/descer e ativar/desativar. Itens inativos só se veem a editar;
  - «SEO» (título e descrição da página) e «Textos escondidos» (placeholders, descrições de imagens, ligações).
- **Utilizadores e permissões:** em `/admin/settings` (só `superuser`) criam-se utilizadores e define-se, para cada um, o que pode editar (texto, imagens, listas) e em que páginas (site e rodapé, início, áreas, blog).
- **Idiomas:** com `I18N=false` na API o site é só em português. Com `I18N=true` aparece o seletor PT/EN e edita-se o idioma que estiver a ser mostrado. O inglês fica sempre guardado, mesmo escondido.
- **Biblioteca de imagens:** `/admin/media` (tipo de edição «imagens»). Uma imagem em uso não pode ser eliminada: a API indica onde está a ser usada.

Mapa completo do que é editável: [docs/cms-content-map.md](docs/cms-content-map.md).

## Desenvolvimento

Requisitos: Node 22+ e Python 3.12+.

```bash
# 1. API (outro terminal): ver marysite-api/README.md
cd ../marysite-api
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env            # definir JWT_SECRET_KEY, ADMIN_EMAIL e ADMIN_PASSWORD
alembic upgrade head
python -m app.scripts.seed
uvicorn app.main:app --reload --port 8000

# 2. Site
cd ../marysite
npm install
cp .env.example .env
npm run dev                     # http://localhost:3000
```

Em desenvolvimento o Vite reencaminha `/api/v1` e `/media` para `http://localhost:8000` (mude com `API_PROXY_TARGET`), por isso site e API partilham a origem: sem CORS e o cookie de sessão funciona. A origem do site tem de estar em `CORS_ORIGINS` da API.

Comandos: `npm run lint` (TypeScript estrito) · `npm test` (Vitest) · `npm run build`.

## Deploy

1. Publicar a API (ver `marysite-api/README.md`): `PRODUCTION=true`, `JWT_SECRET_KEY` próprio, HTTPS, volumes para `data/` e `uploads/`.
2. O site e a API têm de estar no **mesmo domínio**. Duas opções:
   - o servidor do site faz o proxy: definir `API_PROXY_TARGET=http://api:8000` (reencaminha `/api/v1` e `/media`);
   - ou um proxy à frente (nginx, Caddy, Traefik) que envia `/api/v1` e `/media` para a API e o resto para o site.
3. `npm run build` e `NODE_ENV=production npx tsx server.ts` (o `Dockerfile` já o faz).
4. Se a API ficar noutro domínio: `VITE_API_BASE_URL` e `VITE_MEDIA_BASE_URL` no build, `COOKIE_SAMESITE=none` e `CORS_ORIGINS` com o domínio do site.

## Estado atual

- Os formulários de marcação e de contacto ainda **não enviam mensagens**. Está por ligar o envio para o e-mail da Mariline.
- O **blog** ainda não tem artigos.
- Na secção **Sobre Mim**, o bloco de experiência profissional (introdução, três pontos e frase final) não tem texto: mostra-se o nome interno de cada campo até a Mariline o preencher no CMS.
- Faltam algumas imagens, que o site mostra como blocos azuis claros até serem adicionadas: hortênsias (início, abordagem e faixa "Um caminho para o florescimento do ser"), fundo azul claro e mãos (Áreas de Intervenção).
- As fotografias usadas em Sobre Mim e em Marcações Online podem ser trocadas quando a cliente decidir qual prefere.
- A ligação a Instagram e LinkedIn no rodapé, e as páginas de Política de Privacidade e Termos e Condições, ainda estão por preencher.

## Contacto

- E-mail: [marilineboto.psi@gmail.com](mailto:marilineboto.psi@gmail.com)
- WhatsApp: (+351) 910 979 513
