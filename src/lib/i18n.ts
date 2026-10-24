import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { adminMessages } from './adminMessages.ts';

// Todo o conteúdo do site vem do CMS (ver src/lib/cms/CmsProvider.tsx).
// Aqui ficam só as mensagens que têm de existir antes de o CMS responder.
const resources = {
  pt: { translation: { ...adminMessages, system: { loadError: 'Não foi possível carregar o conteúdo. Tente novamente mais tarde.', mainNav: 'Navegação principal', contactSent: 'Mensagem enviada com sucesso. Obrigada pelo contacto!', submitError: 'Não foi possível enviar o pedido. Tente novamente ou contacte por WhatsApp ou e-mail.', notFound: { title: 'Página não encontrada', message: 'A página que procura não existe ou foi movida.', home: 'Voltar ao início' } } } },
  en: { translation: { ...adminMessages, system: { loadError: 'The content could not be loaded. Please try again later.', mainNav: 'Main navigation', contactSent: 'Message sent successfully. Thank you for getting in touch!', submitError: 'The request could not be sent. Please try again or contact by WhatsApp or email.', notFound: { title: 'Page not found', message: 'The page you are looking for does not exist or has moved.', home: 'Back to home' } } } },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    nonExplicitSupportedLngs: true,
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
    // Os componentes atualizam quando o CMS entrega ou altera conteúdo
    react: { bindI18nStore: 'added' },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
