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
        blog: 'Blog',
        contacts: 'Contactos',
        booking: 'Marcações Online'
      },
      hero: {
        "title": "A sua singularidade merece ser vista, compreendida e cuidada.",
        "subtitle": "Aqui, cada parte de si encontra espaço para ser escutada com sensibilidade e verdade.",
        "imageAlt": "Mariline Bôto, Psicóloga Clínica",
        "welcomeTitle": "Bem-vindo(a)",
        "welcomeText": "Por vezes, o sofrimento emocional instala-se de forma silenciosa, tornando dias e experiências mais pesados. Traumas, perdas, ansiedade, tristeza profunda ou fases de transição particularmente exigentes podem repetir-se, criando bloqueios e limitando o bem-estar. A psicoterapia surge como um espaço seguro e acolhedor, onde é possível respirar, olhar para si com atenção e cuidado, reconhecer o que o aflige e transformar aquilo que pesa, sempre respeitando o seu ritmo, os seus limites e a sua história única.",
        "ctaInvitation": "Convido-o(a) a dar o primeiro passo neste caminho, a sentir-se acolhido(a) neste espaço e, se fizer sentido, a agendar a sua consulta online, num ritmo que respeite as suas necessidades.",
        "cta": "Marque uma consulta"
      },
      about: {
        "title": "Sobre Mim",
        "intro": [
          "O meu nome é Mariline Bôto, sou Psicóloga Clínica (OPP n.º 28131, ERS E180669) e dedico o meu percurso a potenciar processos de mudança que respeitam a individualidade de cada história.",
          "No meu trabalho, alio o rigor clínico à criação de um espaço seguro, onde o julgamento não tem lugar, mas a transformação é o caminho.",
          "Acredito que os sentimentos pedem, antes de tudo, espaço: um lugar para serem sentidos sem julgamento e, a seu tempo, transformados. É por isso que, na psicoterapia, convido-o(a) a abrandar para resgatarmos o equilíbrio perdido no ruído quotidiano.",
          "Nesse processo, a sua singularidade é a bússola e a sua sensibilidade a ferramenta de mudança. Cada sessão torna-se então um exercício de coragem: a de olhar para dentro para construir uma vida mais leve e com propósito. É um processo clínico, mas é, acima de tudo, o gesto mais profundo de respeito e amor que pode dedicar a si próprio(a).",
          "Fora do contexto clínico, recarrego o meu equilíbrio no sol e mar, na companhia das minhas pessoas e dos meus gatos, ou a vibrar com a energia da música rock. É na diversidade destes momentos que cultivo a autenticidade e a serenidade necessárias para cuidar com o mesmo respeito da história de quem me procura."
        ],
        "valuesTitle": "Os valores que orientam o meu trabalho:",
        "values": ["Empatia", "Acolhimento", "Respeito", "Integridade", "Sensibilidade", "Compromisso"],
        "educationTitle": "Formação e Experiência Profissional",
        "educationSubtitle": "Formação",
        "education": [
          "Com o intuito de aprofundar a minha prática em vivências de grande impacto emocional, concluí uma Especialização Avançada em Trauma Psicológico e outra em Luto. Estas competências permitem-me oferecer um suporte qualificado perante as marcas do passado e os desafios do presente.",
          "A minha abordagem assenta nas Terapias Cognitivo-Comportamentais de 2.ª e 3.ª geração, o que me permite adaptar cada consulta exatamente ao que precisa. Trabalho desde a regulação emocional e modificação de comportamentos até à desconstrução de crenças, esquemas e padrões antigos, contando também com um Curso Avançado em Terapia do Esquema.",
          "Para além disso, invisto continuamente em formação focada nas perturbações emocionais, pois acredito que a atualização constante é essencial para lhe oferecer um espaço seguro, rigoroso e feito à medida da sua história."
        ],
        "experienceSubtitle": "Experiência Profissional"
      },
      approach: {
        "title": "A Minha Abordagem",
        "imageAlt": "Hortênsias azuis",
        "intro": [
          "O meu olhar clínico assenta nas Terapias Cognitivo-Comportamentais de 2.ª e de 3.ª geração - nomeadamente a Terapia Cognitivo-Comportamental tradicional (TCC), a Terapia de Aceitação e Compromisso (ACT) e a Terapia Focada no Esquema (TFE).",
          "São abordagens cientificamente validadas e profundamente eficazes para ajudar a navegar por turbulências emocionais e a transformar padrões antigos."
        ],
        "pointsIntro": "Consoante aquilo que trouxer no seu percurso e aquilo de que precisar em cada momento, o nosso trabalho poderá passar por:",
        "points": [
          {
            "title": "Identificar e transformar padrões mentais",
            "text": "aprender a reconhecer crenças, feridas emocionais e pensamentos que lhe pesam e geram sofrimento, transformando-os em perspetivas mais compassivas, saudáveis e funcionais para o seu dia a dia."
          },
          {
            "title": "Desenvolver ferramentas práticas e regulação emocional",
            "text": "criar estratégias concretas para o dia a dia, promovendo a gestão do desconforto, o equilíbrio e uma ação mais alinhada com aquilo que é verdadeiramente importante para si."
          },
          {
            "title": "Promover mudanças duradouras",
            "text": "unir a compreensão da sua história a estratégias práticas de ação, garantindo um equilíbrio emocional real, autónomo e sustentável a longo prazo."
          }
        ],
        "closing": [
          "Porque não existem duas pessoas iguais, acredito que cada percurso terapêutico é único. A minha atuação é inteiramente pensada à sua medida, num espaço seguro onde se possa sentir inteiramente compreendido(a).",
          "Mais do que aplicar abordagens rígidas, o meu objetivo é construir consigo um caminho que faça sentido na sua vida. Para que possa ir muito além do alívio imediato dos sintomas e conquistar um equilíbrio emocional real, sólido e autónomo."
        ]
      },
      booking: {
        "title": "Marcação de Consulta",
        "text": "Dar início a um processo terapêutico é um gesto de coragem e de cuidado profundo por si. Se sente que é o momento certo para começar, pode marcar a sua consulta de forma simples e segura através do botão abaixo."
      },
      blog: {
        "title": "Blog",
        "intro": "Reflexões e conteúdos sobre saúde mental, bem-estar emocional e psicoterapia.",
        "empty": "Em breve, partilharei aqui os primeiros artigos.",
          "loading": "A carregar artigos…",
          "error": "Não foi possível carregar os artigos. Tente novamente mais tarde."
      },
      quote: {
        "text": "Um caminho para o florescimento do ser."
      },
      areas: {
        learnMore: 'Saber mais',
        imageAlt: 'Mãos unidas sobre fundo claro',
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
      whatsapp: {
        cta: 'Falar no WhatsApp',
        message: 'Olá, Mariline! Vim do seu site e gostava de saber mais informações sobre as consultas de psicologia clínica.'
      },
      areasPage: {
        title: 'Áreas de Intervenção',
        intro: 'O meu trabalho baseia-se em abordagens terapêuticas validadas cientificamente para o(a) acompanhar na compreensão e na ultrapassagem das suas dificuldades emocionais, relacionais ou de desenvolvimento pessoal.',
        navIntro: 'Abaixo encontra as principais áreas em que intervenho. Pode navegar diretamente para o tópico que mais procura ou explorar cada uma delas para entender como o(a) posso ajudar em consulta:',
        whatIs: 'O que é',
        signs: 'Sinais de alerta',
        help: 'Como posso ajudar'
      },
      contacts: {
        title: "Contacto",
        questions: "Se ainda tem dúvidas ou quer saber mais sobre o meu acompanhamento, pode entrar em contacto por e-mail, whatsapp ou através do formulário abaixo.",
        reply: "Responderei com a atenção, empatia e respeito que as suas questões merecem.",
        emailLabel: "E-mail",
        email: "marilineboto.psi@gmail.com",
        whatsappLabel: "Whatsapp",
        whatsapp: "(+351) 965 608 731",
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
        blog: 'Blog',
        contacts: 'Contacts',
        booking: 'Online Booking'
      },
      hero: {
        "title": "Your uniqueness deserves to be seen, understood, and cared for.",
        "subtitle": "Here, every part of you finds space to be heard with sensitivity and truth.",
        "imageAlt": "Mariline Bôto, Clinical Psychologist",
        "welcomeTitle": "Welcome",
        "welcomeText": "Sometimes emotional suffering settles in silently, making days and experiences heavier. Traumas, losses, anxiety, deep sadness, or particularly demanding transition phases can repeat, creating blocks and limiting well-being. Psychotherapy emerges as a safe and welcoming space where it is possible to breathe, look at yourself with attention and care, recognize what afflicts you, and transform what weighs you down, always respecting your pace, your limits, and your unique story.",
        "ctaInvitation": "I invite you to take the first step on this path, to feel welcomed in this space and, if it makes sense, to schedule your online consultation at a pace that respects your needs.",
        "cta": "Book a consultation"
      },
      about: {
        "title": "About Me",
        "intro": [
          "My name is Mariline Bôto, I am a Clinical Psychologist (OPP no. 28131, ERS E180669) and I dedicate my career to fostering processes of change that respect the individuality of each story.",
          "In my work, I combine clinical rigor with the creation of a safe space where judgment has no place, but transformation is the path.",
          "I believe that feelings ask, above all, for space: a place to be felt without judgment and, in their own time, transformed. That is why, in psychotherapy, I invite you to slow down so that we can recover the balance lost in everyday noise.",
          "In this process, your uniqueness is the compass and your sensitivity the tool of change. Each session becomes an exercise in courage: looking inward to build a lighter life with purpose. It is a clinical process, but it is, above all, the deepest gesture of respect and love you can offer yourself.",
          "Outside the clinical setting, I recharge in the sun and sea, in the company of my people and my cats, or vibrating with the energy of rock music. It is in the diversity of these moments that I cultivate the authenticity and serenity needed to care, with the same respect, for the story of those who seek me."
        ],
        "valuesTitle": "The values that guide my work:",
        "values": ["Empathy", "Warmth", "Respect", "Integrity", "Sensitivity", "Commitment"],
        "educationTitle": "Education and Professional Experience",
        "educationSubtitle": "Education",
        "education": [
          "To deepen my practice in experiences of great emotional impact, I completed an Advanced Specialization in Psychological Trauma and another in Grief. These skills allow me to offer qualified support in the face of marks from the past and challenges of the present.",
          "My approach is based on 2nd and 3rd generation Cognitive-Behavioral Therapies, which allows me to adapt each session exactly to what you need. I work from emotional regulation and behavior modification to the deconstruction of old beliefs, schemas and patterns, and I also hold an Advanced Course in Schema Therapy.",
          "In addition, I continuously invest in training focused on emotional disorders, because I believe constant updating is essential to offer you a safe, rigorous space tailored to your story."
        ],
        "experienceSubtitle": "Professional Experience"
      },
      approach: {
        "title": "My Approach",
        "imageAlt": "Blue hydrangeas",
        "intro": [
          "My clinical view is based on 2nd and 3rd generation Cognitive-Behavioral Therapies - namely traditional Cognitive-Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT) and Schema-Focused Therapy (SFT).",
          "These are scientifically validated and deeply effective approaches to help navigate emotional turbulence and transform old patterns."
        ],
        "pointsIntro": "Depending on what you bring to your journey and what you need at each moment, our work may include:",
        "points": [
          {
            "title": "Identifying and transforming mental patterns",
            "text": "learning to recognize beliefs, emotional wounds and thoughts that weigh on you and cause suffering, turning them into more compassionate, healthy and functional perspectives for your daily life."
          },
          {
            "title": "Developing practical tools and emotional regulation",
            "text": "creating concrete strategies for daily life, promoting the management of discomfort, balance and action more aligned with what is truly important to you."
          },
          {
            "title": "Promoting lasting change",
            "text": "combining an understanding of your story with practical strategies for action, ensuring a real, autonomous and sustainable emotional balance in the long term."
          }
        ],
        "closing": [
          "Because no two people are alike, I believe each therapeutic journey is unique. My work is entirely tailored to you, in a safe space where you can feel fully understood.",
          "More than applying rigid approaches, my goal is to build with you a path that makes sense in your life, so that you can go far beyond immediate symptom relief and achieve a real, solid and autonomous emotional balance."
        ]
      },
      booking: {
        "title": "Book a Consultation",
        "text": "Starting a therapeutic process is a gesture of courage and deep care for yourself. If you feel it is the right time to begin, you can book your consultation simply and safely through the button below."
      },
      blog: {
        "title": "Blog",
        "intro": "Reflections and content on mental health, emotional well-being and psychotherapy.",
        "empty": "The first articles will be shared here soon.",
          "loading": "Loading articles…",
          "error": "Could not load the articles. Please try again later."
      },
      quote: {
        "text": "A path to the flourishing of being."
      },
      areas: {
        learnMore: 'Learn more',
        imageAlt: 'Hands against a clear background',
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
      whatsapp: {
        cta: 'Chat on WhatsApp',
        message: 'Olá, Mariline! Vim do seu site e gostava de saber mais informações sobre as consultas de psicologia clínica.'
      },
      contacts: {
        title: "Contact",
        questions: "If you still have questions or want to know more about my support, you can get in touch by e-mail, WhatsApp or through the form below.",
        reply: "I will respond with the attention, empathy and respect your questions deserve.",
        emailLabel: "E-mail",
        email: "marilineboto.psi@gmail.com",
        whatsappLabel: "WhatsApp",
        whatsapp: "(+351) 965 608 731",
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
    lng: 'pt', // single-language site for now; the language detector is bypassed
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
