import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { adminMessages } from './adminMessages.ts';

// Todo o conteúdo do site vem do CMS (ver src/lib/cms/CmsProvider.tsx).
// Aqui ficam só as mensagens que têm de existir antes de o CMS responder.
const resources = {
  pt: { translation: { ...adminMessages, system: { loadError: 'Não foi possível carregar o conteúdo. Tente novamente mais tarde.' } } },
  en: { translation: { ...adminMessages, system: { loadError: 'The content could not be loaded. Please try again later.' } } },
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
