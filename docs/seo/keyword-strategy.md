# Estratégia de keywords e intenção de pesquisa

**Base:** apenas o que o site já diz. Serviço real: psicoterapia clínica **online** (Google Meet) com a psicóloga Mariline Bôto (OPP n.º 28131), baseada em Terapias Cognitivo-Comportamentais de 2.ª e 3.ª geração (TCC, ACT, Terapia Focada no Esquema), com especialização em trauma e luto. Público: adultos com sofrimento emocional que procuram acompanhamento psicológico em português. Localização declarada no site: «Atendimento Online / Lisboa».

> **Limitação:** não havia acesso a Google Search Console, Keyword Planner nem outra ferramenta de volumes. As keywords abaixo são **hipóteses fundamentadas no conteúdo** e na forma como se pesquisa este serviço em português. Devem ser validadas com dados reais (ver «Ações externas» no relatório final).

## Keyword por página

| Página | Keyword principal | Keywords secundárias | Intenção | Tipo de página | Prioridade |
|---|---|---|---|---|---|
| `/` | psicóloga clínica online | psicoterapia online; consulta de psicologia online; marcar consulta de psicologia; terapia cognitivo-comportamental; Mariline Bôto | Comercial / transacional; navegacional para o nome da marca | Página de serviço + apresentação (landing) | Alta |
| `/areas` | áreas de intervenção em psicologia clínica | psicóloga trauma; psicóloga luto; psicóloga ansiedade; psicóloga depressão; perturbação obsessivo-compulsiva (POC); autoestima; relacionamentos; crises de vida | Informacional → comercial (quem reconhece os sinais e decide marcar) | Hub de serviços (8 temas) | Alta |
| `/blog` | saúde mental e bem-estar emocional | psicoterapia; artigos de psicologia | Informacional | Listagem de artigos | Baixa até haver artigos (hoje `noindex`) |

### Evitar canibalização

- `/` fala do **serviço e da profissional** (consulta online, abordagem, marcar). `/areas` fala dos **problemas** (trauma, luto, ansiedade…). Os títulos e descrições seguem essa separação: nenhuma das duas usa a keyword principal da outra como título.
- A secção «Áreas» da Home resume as 8 áreas e liga para `/areas#<área>`; não repete o texto longo (`whatIs`, `signs`, `help`), que só existe em `/areas`.
- `/blog` não compete com nenhuma: fica fora do índice até ter conteúdo próprio.

## Variações semânticas já presentes no texto (usadas sem forçar)

psicoterapia / psicólogo(a) clínico(a) / consulta online / acompanhamento psicológico / saúde mental / bem-estar emocional / regulação emocional / TCC, ACT, Terapia Focada no Esquema / trauma psicológico / luto / ansiedade / depressão / POC / autoestima.

## Local

O site declara «Atendimento Online / Lisboa». Não há morada nem consultório descritos, por isso **não** se criaram páginas de cidade nem se afirmou atendimento presencial. «Lisboa» aparece apenas onde o site já o diz (rodapé → `areaServed` no schema). Se existir consultório físico, a cliente deve dizê-lo no CMS (morada, horário) e só então faz sentido `LocalBusiness` com morada e ligação a Google Business Profile.

## Oportunidades não implementadas (e porquê)

| Ideia | Porquê não foi feita |
|---|---|
| Uma página própria por área (`/areas/ansiedade`, `/areas/luto`…) para captar pesquisas específicas | Exige novas rotas e um novo layout de página (alteração de design) e conteúdo novo e distinto por área; fica como recomendação para decisão da cliente |
| Artigos de blog sobre perguntas frequentes (ex.: «terapia online funciona?») | Conteúdo clínico tem de ser escrito pela psicóloga |
| Página «Marcar consulta» com URL própria | A marcação é uma secção da Home; separar mudaria a estrutura |
