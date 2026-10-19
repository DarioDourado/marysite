import { useTranslation } from 'react-i18next';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';

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
        <FadeIn className="w-full mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
            {t('approach.title')}
          </h2>
          <div className="space-y-6 text-lg text-text-light leading-relaxed">
            {intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="bg-surface rounded-panel p-8 md:p-16 shadow-card border border-border">
          <p className="text-lg text-text-light leading-relaxed mb-10">{t('approach.pointsIntro')}</p>
          <ul className="space-y-6 mb-12">
            {points.map((point, index) => (
              <li key={point.title} className="flex gap-5 items-start">
                <span className="shrink-0 w-8 h-8 bg-primary-dark text-on-primary rounded-round flex items-center justify-center font-bold text-xs">
                  {index + 1}
                </span>
                <p className="text-lg text-text-light leading-relaxed pt-1">
                  <strong className="font-semibold text-foreground">{point.title}:</strong> {point.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="p-8 md:p-10 bg-primary/50 rounded-tile space-y-6 text-lg text-foreground/80 leading-relaxed">
            {closing.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
