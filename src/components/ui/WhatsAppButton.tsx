import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';
import { getWhatsAppUrl } from '@/src/lib/whatsapp.ts';

interface WhatsAppButtonProps {
  className?: string;
}

/** Highlighted call-to-action that opens WhatsApp with a pre-filled message. */
export const WhatsAppButton = ({ className }: WhatsAppButtonProps) => {
  const { t } = useTranslation();

  return (
    <a
      href={getWhatsAppUrl(t('whatsapp.message'))}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'px-10 py-4 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#1ebe5b] transition-all shadow-xl shadow-[#25D366]/20 flex items-center justify-center gap-3 text-lg',
        className,
      )}
    >
      <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
      {t('whatsapp.cta')}
    </a>
  );
};
