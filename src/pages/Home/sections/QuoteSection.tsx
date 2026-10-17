import { useTranslation } from 'react-i18next';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';

export const QuoteSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-[80vh] min-h-[480px] overflow-hidden bg-primary-medium">
      <SafeImage
        src="/img/florescimento.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/25" />
      <FadeIn className="relative h-full flex items-center justify-center text-center px-6">
        <h2 className="max-w-3xl text-3xl md:text-5xl font-serif font-normal text-white drop-shadow-lg">
          {t('quote.text')}
        </h2>
      </FadeIn>
    </section>
  );
};
