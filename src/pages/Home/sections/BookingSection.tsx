import { useTranslation } from 'react-i18next';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';
import { BookingForm } from '@/src/components/BookingForm.tsx';

export const BookingSection = () => {
  const { t } = useTranslation();

  return (
    <section id="booking-section" className="section-spacing bg-primary/10">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto mb-16 md:mb-20">
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] max-w-[14rem] mx-auto rounded-card overflow-hidden shadow-panel bg-surface/60">
              <SafeImage
                src="/img/mariline-boto-1.webp"
                alt="Mariline Bôto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-8 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-6">
              {t('booking.title')}
            </h2>
            <p className="text-lg text-text-light leading-relaxed">{t('booking.text')}</p>
          </div>
        </FadeIn>

        <FadeIn>
          <BookingForm />
        </FadeIn>
      </div>
    </section>
  );
};
