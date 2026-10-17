import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';
import { WhatsAppButton } from '@/src/components/ui/WhatsAppButton.tsx';

interface HeroSectionProps {
  onBooking: () => void;
}

export const HeroSection = ({ onBooking }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-primary-medium">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <SafeImage
            src="/img/hortensias.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-foreground/35" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white drop-shadow-lg mb-8 leading-[1.08]">
              {t('hero.title')}
            </h1>
            <p className="max-w-2xl text-lg md:text-2xl text-white leading-relaxed font-medium drop-shadow">
              {t('hero.subtitle')}
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] max-w-[16rem] lg:max-w-xs mx-auto lg:ml-auto rounded-[40px] overflow-hidden shadow-2xl bg-primary/40">
              <SafeImage
                src="/img/mariline-boto-2.webp"
                alt={t('hero.imageAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-serif font-normal text-primary-dark mb-8">
          {t('hero.welcomeTitle')}
        </h2>
        <div className="space-y-6 text-lg text-text-light leading-relaxed">
          <p>{t('hero.welcomeText')}</p>
          <p className="text-foreground font-medium">{t('hero.ctaInvitation')}</p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBooking}
          className="px-10 py-4 bg-primary-dark text-white rounded-full font-semibold hover:bg-primary-dark/90 transition-all shadow-xl shadow-primary-dark/20 flex items-center gap-3 group text-lg"
        >
          {t('hero.cta')}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
        </button>
          <WhatsAppButton />
        </div>
      </div>
    </section>
    </>
  );
};
