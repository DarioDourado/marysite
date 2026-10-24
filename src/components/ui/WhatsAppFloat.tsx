import { WhatsAppIcon } from '@/src/components/ui/WhatsAppIcon.tsx';
import { getWhatsAppUrl } from '@/src/lib/whatsapp.ts';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';

/** Discreet floating WhatsApp shortcut, fixed to the bottom-right corner. */
export const WhatsAppFloat = () => {
  const attr = useAttrText();

  return (
    <a
      href={getWhatsAppUrl(attr('whatsapp.number'), attr('whatsapp.message'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={attr('whatsapp.cta')}
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-round btn-whatsapp flex items-center justify-center shadow-fab"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
};
