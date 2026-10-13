import { useTranslation } from 'react-i18next';
import { Flower2 } from 'lucide-react';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';
import { FAQAccordion } from '@/src/components/FAQAccordion.tsx';
import type { CMSArea } from '../useHomeHook.ts';

interface AreasSectionProps {
  areas: CMSArea[];
}

export const AreasSection = ({ areas }: AreasSectionProps) => {
  const { t } = useTranslation();

  return (
    <section id="areas" className="section-spacing bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
            {t('areas.title')}
          </h2>
          <p className="text-lg md:text-xl text-text-light leading-relaxed">{t('areas.intro')}</p>
        </FadeIn>

        <FadeIn className="mb-16 md:mb-20">
          <SafeImage
            src="/img/areas-hands.webp"
            fallbackSrc="https://images.pexels.com/photos/7091864/pexels-photo-7091864.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt={t('areas.imageAlt')}
            className="w-full h-64 md:h-96 object-cover rounded-[40px]"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {areas.map((area, index) => (
            <FadeIn
              key={area.id}
              delay={index * 0.05}
              className="group bg-secondary/20 rounded-[32px] p-8 md:p-10 hover:bg-primary/20 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-dark mb-8 shadow-sm">
                <Flower2 className="w-6 h-6" strokeWidth={1.2} />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-normal text-foreground mb-4">{area.title}</h3>
              <p className="text-text-light text-base leading-relaxed">{area.description}</p>
            </FadeIn>
          ))}
        </div>

        <FAQAccordion />
      </div>
    </section>
  );
};
