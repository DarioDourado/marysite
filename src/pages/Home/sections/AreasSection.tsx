import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';
import { FAQAccordion } from '@/src/components/FAQAccordion.tsx';
import { AreaIcon } from '@/src/components/ui/AreaIcon.tsx';
import { areasContent } from '@/src/pages/Areas/areasContent.ts';

export const AreasSection = () => {
  const { t } = useTranslation();

  return (
    <section id="areas" className="section-spacing bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
            {t('areas.title')}
          </h2>
          <p className="text-lg md:text-xl text-text-light leading-relaxed">{t('areas.intro')}</p>
        </FadeIn>

        <FadeIn className="mb-16 md:mb-20">
          <SafeImage
            src="/img/areas-de-intervencao.webp"
            fallbackSrc="https://images.pexels.com/photos/7091864/pexels-photo-7091864.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt={t('areas.imageAlt')}
            className="w-full h-64 md:h-96 object-cover rounded-panel"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areasContent.map((area, index) => (
            <FadeIn
              key={area.id}
              delay={index * 0.05}
              className="group flex flex-col bg-primary rounded-card p-8 hover-tint"
            >
              <div className="w-16 h-16 mb-6 rounded-round bg-surface/70 text-primary-dark flex items-center justify-center">
                <AreaIcon id={area.id} className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-serif font-normal text-foreground mb-4">{area.title}</h3>
              <p className="text-text-light text-base leading-relaxed mb-6">{area.summary}</p>
              <Link
                to={`/areas#${area.id}`}
                className="mt-auto inline-flex items-center gap-2 text-primary-dark font-medium text-sm hover:underline"
              >
                {t('areas.learnMore')}
                <ArrowRight className="w-4 h-4 arrow-shift" strokeWidth={1.5} />
              </Link>
            </FadeIn>
          ))}
        </div>

        <FAQAccordion />
      </div>
    </section>
  );
};
