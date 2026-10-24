import { useTranslation } from 'react-i18next';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { ListAddButton, ListItemControls } from '@/src/components/cms/ListControls.tsx';

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
            <Cms k="approach.title" />
          </h2>
          <div className="space-y-6 text-lg text-text-light leading-relaxed">
            {intro.map((_, i) => (
              <p key={i}>
                <Cms k={`approach.intro.${i}`} />
                <ListItemControls listPath="approach.intro" index={i} />
              </p>
            ))}
            <ListAddButton listPath="approach.intro" />
          </div>
        </FadeIn>

        <FadeIn className="bg-surface rounded-panel p-8 md:p-16 shadow-card border border-border">
          <p className="text-lg text-text-light leading-relaxed mb-10"><Cms k="approach.pointsIntro" /></p>
          <ul className="space-y-6 mb-12">
            {points.map((point, index) => (
              <li key={point.title} className="flex gap-5 items-start">
                <span className="shrink-0 w-6 h-6 mt-0.5 bg-primary-dark text-on-primary rounded-round flex items-center justify-center font-bold text-xs">
                  {index + 1}
                </span>
                <p className="text-lg text-text-light leading-relaxed">
                  <strong className="font-semibold text-foreground"><Cms k={`approach.points.${index}.title`} />:</strong> <Cms k={`approach.points.${index}.text`} />
                  <ListItemControls listPath="approach.points" index={index} />
                </p>
              </li>
            ))}
            <ListAddButton listPath="approach.points" as="li" />
          </ul>

          <div className="p-8 md:p-10 bg-primary/50 rounded-tile space-y-6 text-lg text-foreground/80 leading-relaxed">
            {closing.map((_, i) => (
              <p key={i}>
                <Cms k={`approach.closing.${i}`} />
                <ListItemControls listPath="approach.closing" index={i} />
              </p>
            ))}
            <ListAddButton listPath="approach.closing" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
