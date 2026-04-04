import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      nav: {
        home: 'Início',
        about: 'Sobre Mim',
        approach: 'Abordagem',
        areas: 'Áreas de Intervenção',
        contacts: 'Contactos',
        booking: 'Marcações Online'
      },
      hero: {
        title: 'A sua singularidade merece ser vista, compreendida e cuidada.',
        subtitle: 'Aqui, cada parte de si encontra espaço para ser escutada com sensibilidade e verdade.',
        welcomeTitle: 'Bem-vindo(a)',
        welcomeText: 'Por vezes, o sofrimento emocional instala-se de forma silenciosa, tornando dias e experiências mais pesados. Traumas, perdas, ansiedade, tristeza profunda ou fases de transição particularmente exigentes podem repetir-se, criando bloqueios e limitando o bem-estar. A psicoterapia surge como um espaço seguro e acolhedor, onde é possível respirar, olhar para si com atenção e cuidado, reconhecer o que o aflige e transformar aquilo que pesa, sempre respeitando o seu ritmo, os seus limites e a sua história única.',
        introText: 'Sou a Mariline Bôto, Psicóloga Clínica, e realizo consultas online para jovens adultos e adultos. Acompanho pessoas que sentem que padrões emocionais e relacionais se repetem ou dificultam a sua vida. Juntos(as), exploramos essas experiências com atenção e segurança, ajudando a integrá-las, compreendê-las e transformá-las em oportunidades de crescimento, autoconhecimento e equilíbrio.',
        spaceText: 'Aqui encontrará um espaço de escuta genuína, presença atenta e acolhimento profundo: um lugar humano e seguro, onde a sua voz é ouvida, validada e valorizada. Cada sessão é guiada pelo cuidado, autenticidade e pelo compromisso com o seu processo de bem-estar e desenvolvimento pessoal.',
        ctaInvitation: 'Convido-o(a) a dar o primeiro passo neste caminho, a sentir-se acolhido(a) neste espaço e, se fizer sentido, a agendar a sua consulta online, num ritmo que respeite as suas necessidades.',
        cta: 'Marque uma consulta'
      },
      about: {
        title: 'Sobre Mim',
        educationTitle: 'Formação e Experiência Profissional',
        educationContent: 'Sou licenciada em Psicologia pelo ISMAT - Instituto Superior Manuel Teixeira Gomes (2016) e mestre em Psicologia Clínica e da Saúde pela Universidade do Algarve (2020). Com o intuito de aprofundar a minha prática em vivências de grande impacto emocional, concluí uma Especialização Avançada em Trauma Psicológico e outra em Luto. Estas competências permitem-me oferecer um suporte qualificado perante as marcas do passado e os desafios do presente.',
        approachContent: 'A minha prática fundamenta-se na Terapia Cognitivo-Comportamental (TCC), que utilizo como base sólida para a resolução de dificuldades atuais. No sentido de potenciar esta abordagem, realizei recentemente um Curso Avançado em Terapia do Esquema, uma vertente de "terceira geração" que permite um trabalho mais profundo sobre padrões emocionais e relacionais.',
        experienceIntro: 'A minha experiência profissional inclui diferentes contextos e faixas etárias, o que me garante uma visão sistémica e abrangente dos desafios ao longo da vida. Atualmente dedicada à prática clínica online, o meu percurso foi construído através da experiência prévia em áreas como:',
        experienceChildhood: 'Infância e desenvolvimento: intervenção em contexto de desenvolvimento social e educação com crianças em idade pré-escolar e escolar, focando-me nas bases emocionais, cognitivas e sociais.',
        experienceAdolescence: 'Adolescência em contexto de apoio: experiência com adolescentes em estrutura de acolhimento e suporte, abordando as complexidades desta fase em situações de maior vulnerabilidade.',
        experienceAdults: 'Saúde mental adulta: atuação em serviço de saúde pública, com foco no acompanhamento de adultos que lidam com problemáticas de dependências e outras perturbações do foro psicológico.',
        conclusion: 'Esta vivência prática em diferentes etapas do desenvolvimento oferece-me hoje um olhar claro sobre a sua história, permitindo-me identificar as origens das suas dificuldades e traçar trajetórias de mudança que respeitam a sua singularidade.'
      },
      approach: {
        title: 'A Minha Abordagem',
        intro: 'A psicoterapia é, antes de tudo, um encontro: um espaço onde duas histórias se cruzam com o propósito de compreender, cuidar e transformar.',
        commitment: 'O meu compromisso é criar um lugar seguro e acolhedor para si, onde possa ser quem é, sem pressas nem julgamentos. Um espaço onde as suas palavras encontrem escuta e significado. Acompanho-o(a) com respeito e presença, ajudando-o(a) a reconectar-se consigo mesmo(a) e a descobrir formas mais livres e conscientes de estar na vida.',
        wish: 'O que mais desejo é que, ao longo deste caminho, se reconheça como o(a) autor(a) da sua própria história e que esse reconhecimento traga leveza, sentido e plenitude.',
        valuesTitle: 'Valores que orientam o meu trabalho',
        values: {
          empathy: { title: 'Empatia', desc: 'A capacidade de ver o mundo através dos seus olhos, sem pressupostos.' },
          welcome: { title: 'Acolhimento', desc: 'Criar um ambiente onde se sinta ouvido(a), compreendido(a) e livre de julgamentos.' },
          respect: { title: 'Respeito', desc: 'Pelo seu tempo, pelos seus limites e pelo seu ritmo de mudança.' },
          integrity: { title: 'Integridade', desc: 'A base ética e profissional de todas as nossas interações.' },
          sensitivity: { title: 'Sensibilidade', desc: 'Estar atenta às suas emoções e necessidades mais subtis.' },
          commitment: { title: 'Compromisso', desc: 'Consigo, com a excelência clínica e com o seu processo de bem-estar.' }
        },
        frameworkTitle: 'Enquadramento Terapêutico',
        frameworkIntro: 'O meu olhar clínico assenta na Terapia Cognitivo-Comportamental (TCC), uma das abordagens mais validadas e eficazes para lidar com perturbações emocionais e promover a mudança de padrões.',
        frameworkModel: 'Este modelo psicoterapêutico atua na relação entre o que pensamos, o que sentimos e a forma como agimos. Através desta base, trabalhamos para:',
        frameworkPoints: {
          patterns: 'Identificar e modificar padrões mentais: reconhecer pensamentos e crenças desadaptativas que geram sofrimento, transformando-os em perspetivas mais saudáveis e funcionais.',
          strategies: 'Desenvolver estratégias concretas: criar ferramentas práticas para lidar com os desafios do dia a dia e fortalecer a regulação emocional.',
          change: 'Promover mudanças duradouras: compreender como a nossa história molda a forma como interpretamos o mundo, permitindo que a mudança seja sólida e sustentada a longo prazo.'
        },
        integrativeText: 'Embora a minha base estrutural seja a Terapia Cognitivo-Comportamental (TCC), acredito que cada percurso terapêutico é único. Por isso, a minha atuação assume um caráter integrativo e personalizado, permitindo-me incorporar elementos de abordagens de "terceira geração" cientificamente validadas.',
        schemaText: 'Para casos que exigem uma intervenção mais profunda em padrões emocionais antigos ou persistentes, integro de forma central a Terapia do Esquema, focando-me na transformação de padrões emocionais e relacionais enraizados.',
        actText: 'Complemento ainda a minha intervenção com ferramentas pontuais da Terapia de Aceitação e Compromisso, sempre que o processo beneficia de uma maior flexibilidade psicológica.',
        conclusion: 'O fundamental é que o espaço terapêutico seja sempre moldado às suas necessidades e ao seu ritmo. Mais do que aplicar técnicas, o meu objetivo é construir consigo uma estratégia que faça sentido na sua vida, visando não apenas o alívio de sintomas imediatos, mas a consolidação de um equilíbrio emocional e de uma autonomia duradouros.'
      },
      areas: {
        title: 'Áreas de Intervenção',
        intro: 'A psicoterapia não se limita a momentos de crise. É, acima de tudo, um convite ao crescimento interior, um espaço de investimento na sua saúde mental para que possa viver a sua vida de forma mais plena e consciente.',
        subtitle: 'A minha intervenção é dirigida a jovens adultos e adultos que procuram não só apoio, mas também as ferramentas e o autoconhecimento necessários para navegar os seus desafios com mais força e autenticidade.',
        ctaText: 'Se deseja cuidar de si e trabalhar alguma das seguintes áreas, estou aqui para o(a) acompanhar:',
        list: {
          trauma: { title: '1. Trauma e processos de luto', desc: 'Intervenção especializada na integração de vivências traumáticas e perdas significativas, promovendo o resgate da segurança interna e a elaboração do sofrimento.' },
          anxiety: { title: '2. Ansiedade, depressão e POC', desc: 'Intervenção centrada na regulação emocional e no desenvolvimento de recursos internos para resgatar o equilíbrio e a qualidade de vida.' },
          patterns: { title: '3. Padrões persistentes de funcionamento', desc: 'Promoção de flexibilidade perante padrões emocionais e de comportamento rígidos, facilitando uma maior autoconsciência e formas mais adaptativas de agir.' },
          transitions: { title: '4. Fases de transição e crises', desc: 'Acompanhamento em transições de vida e crises (como divórcios, mudanças de carreira, parentalidade), fortalecendo a adaptação a novos ciclos.' },
          dynamics: { title: '5. Dinâmicas relacionais', desc: 'Transformação de padrões familiares, amorosos e interpessoais, promovendo interações mais autênticas, seguras e equilibradas.' },
          self: { title: '6. Autoestima e desenvolvimento pessoal', desc: 'Fortalecimento da valorização pessoal, processos de autodescoberta e expansão do potencial de vida.' }
        }
      },
      contacts: {
        title: 'Contacto',
        intro: 'Dar início a um processo terapêutico é um gesto de coragem e de cuidado profundo por si. Se sente que é o momento certo para começar, pode marcar a sua consulta de forma simples e segura através do botão abaixo.',
        spaceInfo: 'Cada sessão é um espaço pensado para si, para que possa ser ouvido(a), compreender o que sente e reencontrar o seu equilíbrio interior.',
        questions: 'Se ainda tem dúvidas ou quer saber mais sobre o meu acompanhamento, pode entrar em contacto por e-mail ou através do formulário abaixo. Responderei com a atenção, empatia e respeito que as suas questões merecem.',
        email: 'marilineboto.psi@gmail.com',
        form: {
          title: 'Formulário de contacto',
          name: 'Nome',
          namePlaceholder: 'Insira o seu nome',
          email: 'E-mail',
          emailPlaceholder: 'Insira o seu e-mail',
          subject: 'Assunto',
          subjectPlaceholder: 'Insira o assunto',
          message: 'Mensagem',
          messagePlaceholder: 'Escreva a sua mensagem aqui',
          send: 'Enviar'
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About Me',
        approach: 'My Approach',
        areas: 'Intervention Areas',
        contacts: 'Contacts',
        booking: 'Online Booking'
      },
      hero: {
        title: 'Your uniqueness deserves to be seen, understood, and cared for.',
        subtitle: 'Here, every part of you finds space to be heard with sensitivity and truth.',
        welcomeTitle: 'Welcome',
        welcomeText: 'Sometimes emotional suffering settles in silently, making days and experiences heavier. Traumas, losses, anxiety, deep sadness, or particularly demanding transition phases can repeat, creating blocks and limiting well-being. Psychotherapy emerges as a safe and welcoming space where it is possible to breathe, look at yourself with attention and care, recognize what afflicts you, and transform what weighs you down, always respecting your pace, your limits, and your unique story.',
        introText: 'I am Mariline Bôto, Clinical Psychologist, and I conduct online consultations for young adults and adults. I accompany people who feel that emotional and relational patterns repeat or make their lives difficult. Together, we explore these experiences with attention and safety, helping to integrate, understand, and transform them into opportunities for growth, self-knowledge, and balance.',
        spaceText: 'Here you will find a space of genuine listening, attentive presence, and deep welcoming: a human and safe place where your voice is heard, validated, and valued. Each session is guided by care, authenticity, and commitment to your well-being and personal development process.',
        ctaInvitation: 'I invite you to take the first step on this path, to feel welcomed in this space and, if it makes sense, to schedule your online consultation at a pace that respects your needs.',
        cta: 'Book a consultation'
      },
      about: {
        title: 'About Me',
        educationTitle: 'Education and Professional Experience',
        educationContent: 'I hold a degree in Psychology from ISMAT - Manuel Teixeira Gomes Higher Institute (2016) and a Master\'s in Clinical and Health Psychology from the University of Algarve (2020). To deepen my practice in experiences of great emotional impact, I completed an Advanced Specialization in Psychological Trauma and another in Grief. These skills allow me to offer qualified support in the face of marks from the past and challenges of the present.',
        approachContent: 'My practice is based on Cognitive-Behavioral Therapy (CBT), which I use as a solid foundation for resolving current difficulties. To enhance this approach, I recently completed an Advanced Course in Schema Therapy, a "third generation" branch that allows for deeper work on emotional and relational patterns.',
        experienceIntro: 'My professional experience includes different contexts and age groups, which guarantees me a systemic and comprehensive view of challenges throughout life. Currently dedicated to online clinical practice, my path was built through previous experience in areas such as:',
        experienceChildhood: 'Childhood and development: intervention in the context of social development and education with preschool and school-age children, focusing on emotional, cognitive, and social bases.',
        experienceAdolescence: 'Adolescence in a support context: experience with adolescents in a shelter and support structure, addressing the complexities of this phase in situations of greater vulnerability.',
        experienceAdults: 'Adult mental health: acting in a public health service, focusing on supporting adults dealing with addiction issues and other psychological disorders.',
        conclusion: 'This practical experience in different stages of development offers me today a clear look at your story, allowing me to identify the origins of your difficulties and trace trajectories of change that respect your uniqueness.'
      },
      approach: {
        title: 'My Approach',
        intro: 'Psychotherapy is, above all, an encounter: a space where two stories cross with the purpose of understanding, caring, and transforming.',
        commitment: 'My commitment is to create a safe and welcoming place for you, where you can be who you are, without haste or judgment. A space where your words find listening and meaning. I accompany you with respect and presence, helping you to reconnect with yourself and discover freer and more conscious ways of being in life.',
        wish: 'What I desire most is that, along this path, you recognize yourself as the author of your own story and that this recognition brings lightness, meaning, and fulfillment.',
        valuesTitle: 'Values that guide my work',
        values: {
          empathy: { title: 'Empathy', desc: 'The ability to see the world through your eyes, without assumptions.' },
          welcome: { title: 'Welcoming', desc: 'Creating an environment where you feel heard, understood, and free of judgment.' },
          respect: { title: 'Respect', desc: 'For your time, your limits, and your pace of change.' },
          integrity: { title: 'Integrity', desc: 'The ethical and professional basis of all our interactions.' },
          sensitivity: { title: 'Sensitivity', desc: 'Being attentive to your emotions and most subtle needs.' },
          commitment: { title: 'Commitment', desc: 'To you, to clinical excellence, and to your well-being process.' }
        },
        frameworkTitle: 'Therapeutic Framework',
        frameworkIntro: 'My clinical view is based on Cognitive-Behavioral Therapy (CBT), one of the most validated and effective approaches for dealing with emotional disorders and promoting pattern change.',
        frameworkModel: 'This psychotherapeutic model acts on the relationship between what we think, what we feel, and how we act. Through this base, we work to:',
        frameworkPoints: {
          patterns: 'Identify and modify mental patterns: recognize maladaptive thoughts and beliefs that generate suffering, transforming them into healthier and more functional perspectives.',
          strategies: 'Develop concrete strategies: create practical tools to deal with daily challenges and strengthen emotional regulation.',
          change: 'Promote lasting changes: understand how our history shapes how we interpret the world, allowing change to be solid and sustained in the long term.'
        },
        integrativeText: 'Although my structural base is Cognitive-Behavioral Therapy (CBT), I believe that each therapeutic path is unique. Therefore, my action takes on an integrative and personalized character, allowing me to incorporate elements of scientifically validated "third generation" approaches.',
        schemaText: 'For cases that require deeper intervention in old or persistent emotional patterns, I centrally integrate Schema Therapy, focusing on transforming rooted emotional and relational patterns.',
        actText: 'I also complement my intervention with specific tools from Acceptance and Commitment Therapy, whenever the process benefits from greater psychological flexibility.',
        conclusion: 'The fundamental thing is that the therapeutic space is always shaped to your needs and your pace. More than applying techniques, my goal is to build with you a strategy that makes sense in your life, aiming not only for immediate symptom relief but for the consolidation of lasting emotional balance and autonomy.'
      },
      areas: {
        title: 'Intervention Areas',
        intro: 'Psychotherapy is not limited to moments of crisis. It is, above all, an invitation to inner growth, a space for investment in your mental health so you can live your life more fully and consciously.',
        subtitle: 'My intervention is aimed at young adults and adults who seek not only support but also the tools and self-knowledge necessary to navigate their challenges with more strength and authenticity.',
        ctaText: 'If you wish to take care of yourself and work on any of the following areas, I am here to accompany you:',
        list: {
          trauma: { title: '1. Trauma and grief processes', desc: 'Specialized intervention in the integration of traumatic experiences and significant losses, promoting the rescue of internal security and the elaboration of suffering.' },
          anxiety: { title: '2. Anxiety, depression, and OCD', desc: 'Intervention centered on emotional regulation and the development of internal resources to rescue balance and quality of life.' },
          patterns: { title: '3. Persistent patterns of functioning', desc: 'Promotion of flexibility in the face of rigid emotional and behavioral patterns, facilitating greater self-awareness and more adaptive ways of acting.' },
          transitions: { title: '4. Transition phases and crises', desc: 'Support in life transitions and crises (such as divorces, career changes, parenthood), strengthening adaptation to new cycles.' },
          dynamics: { title: '5. Relational dynamics', desc: 'Transformation of family, romantic, and interpersonal patterns, promoting more authentic, safe, and balanced interactions.' },
          self: { title: '6. Self-esteem and personal development', desc: 'Strengthening personal valuation, processes of self-discovery, and expansion of life potential.' }
        }
      },
      contacts: {
        title: 'Contact',
        intro: 'Starting a therapeutic process is a gesture of courage and deep care for yourself. If you feel it is the right time to start, you can book your consultation simply and safely through the button below.',
        spaceInfo: 'Each session is a space designed for you, so you can be heard, understand what you feel, and find your inner balance again.',
        questions: 'If you still have questions or want to know more about my support, you can get in touch by email or through the form below. I will respond with the attention, empathy, and respect your questions deserve.',
        email: 'marilineboto.psi@gmail.com',
        form: {
          title: 'Contact Form',
          name: 'Name',
          namePlaceholder: 'Enter your name',
          email: 'Email',
          emailPlaceholder: 'Enter your email',
          subject: 'Subject',
          subjectPlaceholder: 'Enter the subject',
          message: 'Message',
          messagePlaceholder: 'Write your message here',
          send: 'Send'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
