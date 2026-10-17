export interface AreaContent {
  id: string;
  title: string;
  summary: string;
  whatIs: string;
  signs: string[];
  help: string;
}

export const areasContent: AreaContent[] = [
  {
    id: 'trauma',
    title: 'Trauma',
    summary: 'Aprenda a libertar o impacto das memórias do passado no seu presente.',
    whatIs:
      'O trauma ocorre quando vivencia uma ou várias experiências avassaladoras que ultrapassam a sua capacidade de processamento emocional no momento. Podem ser acontecimentos pontuais ou vivências prolongadas ao longo do seu desenvolvimento, cujas memórias e sensações continuam presas no presente.',
    signs: [
      'Memórias intrusivas, pesadelos ou sensação de reexperienciar o evento (flashbacks);',
      'Estado constante de hipervigilância, sobressalto ou reatividade emocional;',
      'Evitamento ativo de conversas, locais, pessoas ou pensamentos associados ao passado;',
      'Sensação de entorpecimento emocional, desconexão (dissociação) ou incapacidade de sentir afeto;',
      'Crenças negativas e rígidas sobre si ou sobre o mundo ("não estou seguro(a)", "não posso confiar em ninguém").',
    ],
    help:
      'Recorro a abordagens terapêuticas validadas cientificamente para o tratamento do trauma (como a Terapia de Processamento Cognitivo ou a Exposição Prolongada). Num ambiente seguro e estruturado, ajudo o seu cérebro a reprocessar as memórias dolorosas, desensibilizando o impacto emocional do passado para que deixe de reagir como se o perigo continuasse a acontecer hoje.',
  },
  {
    id: 'luto',
    title: 'Luto',
    summary: 'Acolha a dor da perda e reorganize a sua vida ao seu próprio ritmo.',
    whatIs:
      'O luto é a resposta natural e individual à perda de alguém ou de algo significativo (a morte de um familiar ou amigo, um término relacional, a perda de um emprego ou uma transição drástica). Torna-se um desafio quando o processo de adaptação bloqueia e a dor impede a reorganização da vida.',
    signs: [
      'Dificuldade em aceitar a realidade da perda ou sensação prolongada de choque e torpor;',
      'Dor emocional intensa e persistente que não atenua com o passar do tempo;',
      'Sentimentos avassaladores de culpa, raiva ou solidão profunda;',
      'Isolamento social e desconexão das rotinas diárias;',
      'Sensação de que a vida perdeu o propósito ou o significado sem aquilo que se perdeu.',
    ],
    help:
      'A terapia oferece um espaço seguro e sem julgamentos para validar a sua dor e expressar todas as emoções associadas à perda. Trabalho consigo na integração da ausência, ajudando a ressignificar a sua história e a reconstruir um sentido de continuidade e futuro, respeitando sempre o seu tempo e ritmo individual.',
  },
  {
    id: 'ansiedade',
    title: 'Ansiedade',
    summary: 'Retome o controlo, reduza a preocupação constante e viva com mais leveza.',
    whatIs:
      'A ansiedade é uma resposta natural do organismo perante a perceção de ameaça ou incerteza. Torna-se problemática quando passa a ser constante, desproporcional à realidade e limitadora, fazendo-a(o) viver num estado contínuo de alerta, antecipação e sobressalto.',
    signs: [
      'Preocupação excessiva, difícil de controlar e direcionada para múltiplos cenários do quotidiano;',
      'Sensação de tensão muscular, inquietação física ou dificuldade em relaxar;',
      'Sintomas físicos frequentes (taquicardia, aperto no peito, falta de ar, tonturas ou perturbações gastrointestinais);',
      'Alterações no sono e dificuldade em concentrar ou desligar a mente;',
      'Evitamento de situações, locais ou decisões por medo do desconforto emocional.',
    ],
    help:
      'Em consulta, trabalhamos para compreender os fatores que mantêm o seu ciclo de ansiedade. Através da Terapia Cognitivo-Comportamental, identifico os padrões de pensamento e comportamentos de evitamento que alimentam o medo, desenvolvendo estratégias práticas de regulação emocional e exposição gradual, para que possa recuperar a segurança e o controlo sobre a sua vida.',
  },
  {
    id: 'depressao',
    title: 'Depressão',
    summary: 'Reencontre a motivação, o sentido e a energia para resgatar o seu bem-estar.',
    whatIs:
      'A depressão vai além de uma tristeza passageira. É um estado emocional e biológico caracterizado por uma perda profunda de interesse ou prazer pelas atividades do dia a dia, acompanhado por uma sensação de cansaço constante, desesperança e desconexão de si próprio(a) e dos outros.',
    signs: [
      'Tristeza persistente, sensação de vazio emocional ou choro frequente;',
      'Perda de interesse ou motivação para tarefas que antes lhe davam prazer;',
      'Fadiga extrema, lentidão ou falta de energia permanente;',
      'Alterações no apetite e nos padrões de sono (insónia ou sono excessivo);',
      'Sentimentos de inutilidade, culpa excessiva ou pensamentos de desvalorização pessoal.',
    ],
    help:
      'O processo terapêutico foca-se na reconstrução gradual do seu bem-estar. Através da reativação comportamental e do reestruturar de pensamentos automáticos negativos, identifico os fatores que perpetuam o estado depressivo. Trabalho ao seu ritmo para resgatar o sentido de eficácia, a energia diária e o envolvimento com a sua própria vida.',
  },
  {
    id: 'poc',
    title: 'Perturbação Obsessivo-Compulsiva (POC)',
    summary: 'Quebre o ciclo de pensamentos obsessivos, rituais e necessidade de controlo.',
    whatIs:
      'A POC é caracterizada pela presença de pensamentos, imagens ou impulsos indesejados e recorrentes (obsessões) que geram ansiedade intensa, levando à realização de comportamentos ou atos mentais repetitivos (compulsões) para tentar neutralizar esse desconforto.',
    signs: [
      'Pensamentos intrusivos que causam enorme perturbação ou dúvida constante;',
      'Rituais de verificação, limpeza, contagem ou organização mental/física frequentes;',
      'Necessidade rígida de controlo, simetria ou certeza absoluta;',
      'Sensação de responsabilidade exagerada em relação a evitar que algo mau aconteça;',
      'Impacto significativo no tempo diário e nas rotinas devido à realização de rituais.',
    ],
    help:
      'A abordagem principal foca-se na Terapia Cognitivo-Comportamental com Exposição e Prevenção de Resposta (EPR). Aprende a tolerar a dúvida e o desconforto gerados pelas obsessões sem recorrer às compulsões, quebrando progressivamente o ciclo que alimenta a perturbação e recuperando a autonomia no seu dia a dia.',
  },
  {
    id: 'autoestima',
    title: 'Autoestima e Identidade',
    summary:
      'Desenvolva uma relação mais compassiva consigo e liberte-se de padrões antigos e esquemas que se repetem.',
    whatIs:
      'Esta área incide sobre a relação que mantém consigo próprio(a): como se perceciona, como fala consigo e de que forma os seus esquemas emocionais antigos e padrões automáticos influenciam o valor que se atribui. Envolve desconstruir a autocrítica e os modos de adaptação rígidos desenvolvidos ao longo da vida.',
    signs: [
      'Diálogo interno marcado por uma autocrítica severa, exigência constante ou culpa;',
      'Perfecionismo paralisante e medo constante do erro ou do julgamento alheio;',
      'Sensação íntima de inadaptação, desvalor ou de que "há algo errado" consigo;',
      'Dificuldade em reconhecer conquistas e aceitar elogios;',
      'Repetição de esquemas e padrões de funcionamento antigos que já não servem o seu presente.',
    ],
    help:
      'Utilizo a Terapia Focada nos Esquemas para identificar as origens das suas crenças centrais sobre si. Trabalho consigo na desconstrução do seu "crítico interno", no desenvolvimento de autocompaixão realista e no resgate da sua identidade genuína, permitindo que faça escolhas mais alinhadas com quem realmente é.',
  },
  {
    id: 'relacionamentos',
    title: 'Relacionamentos e Dinâmicas Interpessoais',
    summary: 'Construa ligações mais saudáveis, aprenda a impor limites e transforme a sua comunicação.',
    whatIs:
      'A forma como nos conectamos com os outros é frequentemente reflexo dos nossos esquemas e modelos relacionais precoces. Esta área aborda as dificuldades de comunicação, a gestão de conflitos, a colocação de limites e a repetição de escolhas relacionais disfuncionais.',
    signs: [
      'Dificuldade em dizer "não", impor limites ou expressar necessidades por medo do conflito ou rejeição;',
      'Tendência para assumir papéis de submissão, agrado excessivo ou dependência emocional;',
      'Escolha recorrente de parceiros(as) ou amigos(as) indisponíveis ou críticos(as);',
      'Dificuldade em manter proximidade emocional genuína ou medo da intimidade;',
      'Conflitos frequentes e padrões de comunicação defensivos ou evitativos nas relações.',
    ],
    help:
      'Em consulta, analisamos os seus padrões interpessoais e o modo como se posiciona nas suas ligações. Ajudo a desenvolver competências de comunicação assertiva, regulação de limites saudáveis e identificação de esquemas relacionais, para que possa construir e manter relações mais equilibradas, autênticas e seguras.',
  },
  {
    id: 'crises',
    title: 'Crises e Transições de Vida',
    summary: 'Navegue momentos de mudança, incerteza ou decisão com maior clareza e segurança.',
    whatIs:
      'A vida é composta por fases de reorganização que, mesmo quando desejadas, podem gerar desorientação, perda de pontos de referência e ansiedade. Abrange momentos de tomada de decisão difícil, término de relacionamentos, transições de carreira ou crises existenciais.',
    signs: [
      'Sensação de bloqueio, estagnação ou paralisia perante tomadas de decisão importantes;',
      'Incerteza e ansiedade elevada face ao futuro ou a novas etapas de vida;',
      'Questionamento profundo sobre valores, identidade, carreira ou escolhas pessoais;',
      'Dificuldade em adaptar a rotina e o equilíbrio emocional a novas realidades;',
      'Sensação de perda de controlo ou direção sobre o seu próprio caminho.',
    ],
    help:
      'O trabalho terapêutico centra-se na clarificação dos seus valores e objetivos de vida. Ajudo a organizar o pensamento, a processar a incerteza e a desenvolver estratégias pragmáticas de adaptação, para que consiga atravessar fases de mudança com clareza, firmeza e segurança emocional.',
  },
];
