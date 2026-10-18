import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
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
      <MessageCircle className="w-7 h-7" strokeWidth={1.5} />
    </a>
  );
};
