# Registo de alterações de conteúdo

Princípio: o texto do site pertence à cliente e é editado no CMS. Só se alterou o que é **metadado SEO** e **texto alternativo de imagens**. Nenhum parágrafo, título visível, serviço, preço ou promessa foi alterado ou acrescentado. Todas as alterações foram feitas na base de dados do CMS (via API) **e** nos valores iniciais do seed da API, para instalações novas ficarem iguais.

| Página | Conteúdo anterior | Conteúdo novo | Motivo SEO | Keyword alvo |
|---|---|---|---|---|
| `/` · título SEO | Mariline Bôto · Psicóloga Clínica | Psicóloga Clínica Online – Psicoterapia \| Mariline Bôto | O título anterior só tinha o nome e a profissão; não indicava que a consulta é **online** nem o serviço | psicóloga clínica online; psicoterapia |
| `/` · descrição | Aqui, cada parte de si encontra espaço para ser escutada com sensibilidade e verdade. (86 car., cópia do subtítulo do hero) | Psicoterapia online com a psicóloga clínica Mariline Bôto: apoio em trauma, luto, ansiedade e depressão, com terapia cognitivo-comportamental. Marque consulta. (159) | Descrição curta, poética e sem tema; passa a dizer o que é o serviço, os temas reais e a abordagem real (TCC) e tem apelo à ação | psicoterapia online; terapia cognitivo-comportamental |
| `/areas` · título SEO | Áreas de Intervenção | Áreas de Intervenção em Psicologia Clínica \| Mariline Bôto | Título genérico e sem marca/contexto | áreas de intervenção em psicologia clínica |
| `/areas` · descrição | O meu trabalho baseia-se em abordagens terapêuticas validadas cientificamente para o(a) acompanhar na compreensão e na ultrapassagem das suas dificuldades emocionais, relacionais ou de desenvolvimento pessoal. (212 car., cortada nos resultados) | Trauma, luto, ansiedade, depressão, POC, autoestima, relacionamentos e crises de vida: conheça os sinais de alerta e como a psicoterapia online pode ajudar. (156) | Dentro do limite; lista os temas reais da página | psicóloga trauma, luto, ansiedade, depressão |
| `/blog` · título SEO | Blog | Blog de Saúde Mental e Bem-Estar \| Mariline Bôto | Título com 4 caracteres | saúde mental; bem-estar emocional |
| `/blog` · descrição | Reflexões e conteúdos sobre saúde mental, bem-estar emocional e psicoterapia. (78) | …, partilhados pela psicóloga clínica Mariline Bôto. Em breve, novos artigos. (152) | Atribuição e extensão; mantém-se verdadeira (ainda não há artigos) | saúde mental |
| Base do site (`site`) · título | Mariline Bôto | Mariline Bôto \| Psicóloga Clínica | Fallback mais descritivo | marca |
| Base do site · descrição | Apoio psicológico clínico especializado, focado na humanização e no bem-estar emocional de cada indivíduo. (105) | … Psicoterapia online com Mariline Bôto. (145) | Fallback dentro do intervalo | marca |
| `/` · alt da fotografia em «Sobre Mim» | Mariline Bôto | Retrato de Mariline Bôto, psicóloga clínica | Alt descritivo e contextual (a imagem é um retrato da profissional) | — |
| `/` · alt da fotografia em «Marcação» | Mariline Bôto | Mariline Bôto, psicóloga clínica | Idem; não repete o alt da secção anterior | — |

## Não alterado, de propósito

| Item | Razão |
|---|---|
| Textos `about.experience*` e `about.conclusion` (aparecem como o nome da chave) | O conteúdo é desconhecido; **inventar** experiência profissional seria falso. Tem de ser escrito pela cliente no CMS (Início → «Experiência Profissional») |
| Nome «A Sua Psicóloga Online» no rodapé/copyright | Decisão de marca da cliente |
| FAQ (valores 50 €/180 €, duração, Google Meet, confidencialidade) | Conteúdo comercial exato; mantém-se intacto e é indexável |
| Hero, Sobre Mim, Abordagem | Texto já relevante, natural e com as keywords do negócio |

## Textos novos no código (interface, não conteúdo da cliente)

| Onde | Texto | Motivo |
|---|---|---|
| Página 404 | «Página não encontrada» / «A página que procura não existe ou foi movida.» / «Voltar ao início» (PT e EN) | Substitui o ecrã de erro em inglês do router; passa a haver 404 real |
| `aria-label` da navegação | «Navegação principal» (PT) / «Main navigation» (EN) | Acessibilidade |
