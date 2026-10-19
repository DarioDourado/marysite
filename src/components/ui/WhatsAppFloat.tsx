import { useTranslation } from 'react-i18next';
import { WhatsAppIcon } from '@/src/components/ui/WhatsAppIcon.tsx';
import { getWhatsAppUrl } from '@/src/lib/whatsapp.ts';

/** Discreet floating WhatsApp shortcut, fixed to the bottom-right corner. */
export const WhatsAppFloat = () => {
  const { t } = useTranslation();

  return (
    <a
      href={getWhatsAppUrl(t('whatsapp.message'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.cta')}
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-round btn-whatsapp flex items-center justify-center shadow-fab"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
};
