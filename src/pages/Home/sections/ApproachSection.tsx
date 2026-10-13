import { useTranslation } from 'react-i18next';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';

interface ApproachPoint {
  title: string;
  text: string;
}

export const ApproachSection = () => {
  const { t } = useTranslation();
  const intro = t('approach.intro', { returnObjects: true }) as string[];
  const points = t('approach.points', { returnObjects: true }) as ApproachPoint[];
  const closing = t('approach.closing', { returnObjects: true }) as string[];

  return (
    <section id="approach" className="section-spacing bg-blue-texture">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 md:mb-28">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
              {t('approach.title')}
            </h2>
            <div className="space-y-6 text-lg text-text-light leading-relaxed">
              {intro.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
          <FadeIn className="aspect-[4/5] max-w-md mx-auto w-full rounded-[40px] overflow-hidden shadow-2xl bg-white/60">
            <SafeImage
              src="/img/hortensia-2.webp"
              alt={t('approach.imageAlt')}
              className="w-full h-full object-cover"
            />
          </FadeIn>
        </div>

        <FadeIn className="bg-white rounded-[48px] p-8 md:p-16 shadow-sm border border-secondary/40">
          <p className="text-lg text-text-light leading-relaxed mb-10">{t('approach.pointsIntro')}</p>
          <ul className="space-y-6 mb-12">
            {points.map((point, index) => (
              <li key={point.title} className="flex gap-5 items-start">
                <span className="shrink-0 w-10 h-10 bg-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-lg text-text-light leading-relaxed pt-1">
                  <strong className="font-semibold text-foreground">{point.title}:</strong> {point.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="p-8 md:p-10 bg-primary/50 rounded-3xl space-y-6 text-lg text-foreground/80 leading-relaxed">
            {closing.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
