import { useTranslation } from 'react-i18next';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';

export const AboutSection = () => {
  const { t } = useTranslation();
  const intro = t('about.intro', { returnObjects: true }) as string[];
  const education = t('about.education', { returnObjects: true }) as string[];
  const values = t('about.values', { returnObjects: true }) as string[];
  const experience = [
    t('about.experienceChildhood'),
    t('about.experienceAdolescence'),
    t('about.experienceAdults'),
  ];

  return (
    <section id="about" className="section-spacing bg-blue-texture">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <span className="text-primary-dark font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
            {t('about.title')}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-12 leading-tight">
            Mariline Bôto
          </h2>
        </FadeIn>

        {/* Photo accompanies the introduction, before the training section */}
        <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-20 md:mb-28">
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] max-w-[16rem] md:max-w-xs mx-auto lg:mx-0 rounded-card overflow-hidden shadow-panel bg-surface/60">
              <SafeImage
                src="/img/mariline-boto-1.webp"
                alt="Mariline Bôto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg text-text-light leading-relaxed">
            {intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mb-20 md:mb-28">
          <p className="text-lg text-text-light leading-relaxed mb-8">{t('about.valuesTitle')}</p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {values.map((value) => (
              <li
                key={value}
                className="card text-center font-serif text-xl text-primary-dark py-6 px-4"
              >
                {value}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn className="max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-12">
            {t('about.educationTitle')}
          </h2>

          <h3 className="text-2xl font-serif font-normal text-primary-dark mb-6">
            {t('about.educationSubtitle')}
          </h3>
          <div className="space-y-6 text-lg text-text-light leading-relaxed mb-14">
            {education.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <h3 className="text-2xl font-serif font-normal text-primary-dark mb-6">
            {t('about.experienceSubtitle')}
          </h3>
          <div className="space-y-6 text-lg text-text-light leading-relaxed">
            <p>{t('about.experienceIntro')}</p>
            <ul className="space-y-4">
              {experience.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-3 w-1.5 h-1.5 shrink-0 rounded-round bg-primary-dark" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="italic text-primary-dark font-serif text-xl">{t('about.conclusion')}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
