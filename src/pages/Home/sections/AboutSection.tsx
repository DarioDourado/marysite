import { useTranslation } from 'react-i18next';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { CmsImage } from '@/src/components/cms/CmsImage.tsx';
import { ListAddButton, ListItemControls } from '@/src/components/cms/ListControls.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';

export const AboutSection = () => {
  const { t } = useTranslation();
  const attr = useAttrText();
  const intro = t('about.intro', { returnObjects: true }) as string[];
  const education = t('about.education', { returnObjects: true }) as string[];
  const values = t('about.values', { returnObjects: true }) as string[];
  const experience = t('about.experienceItems', { returnObjects: true }) as string[];

  return (
    <section id="about" className="section-spacing bg-blue-texture">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <span className="text-primary-dark font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
            <Cms k="about.title" />
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-12 leading-tight">
            <Cms k="about.name" />
          </h2>
        </FadeIn>

        {/* Photo accompanies the introduction, before the training section */}
        <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-20 md:mb-28">
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] max-w-[16rem] md:max-w-xs mx-auto lg:mx-0 rounded-card overflow-hidden shadow-panel bg-surface/60">
              <CmsImage
                path="about.photo"
                fallback="/img/mariline-boto-1.webp"
                alt={attr('about.photoAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg text-text-light leading-relaxed">
            {intro.map((_, i) => (
              <p key={i}>
                <Cms k={`about.intro.${i}`} />
                <ListItemControls listPath="about.intro" index={i} />
              </p>
            ))}
            <ListAddButton listPath="about.intro" />
          </div>
        </FadeIn>

        <FadeIn className="mb-20 md:mb-28">
          <p className="text-lg text-text-light leading-relaxed mb-8"><Cms k="about.valuesTitle" /></p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {values.map((value, i) => (
              <li
                key={value}
                className="card text-center font-serif text-xl text-primary-dark py-6 px-4"
              >
                <Cms k={`about.values.${i}`} />
                <ListItemControls listPath="about.values" index={i} />
              </li>
            ))}
            <ListAddButton listPath="about.values" as="li" />
          </ul>
        </FadeIn>

        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-12">
            <Cms k="about.educationTitle" />
          </h2>

          <h3 className="text-2xl font-serif font-normal text-primary-dark mb-6">
            <Cms k="about.educationSubtitle" />
          </h3>
          <div className="space-y-6 text-lg text-text-light leading-relaxed mb-14">
            {education.map((_, i) => (
              <p key={i}>
                <Cms k={`about.education.${i}`} />
                <ListItemControls listPath="about.education" index={i} />
              </p>
            ))}
            <ListAddButton listPath="about.education" />
          </div>

          <h3 className="text-2xl font-serif font-normal text-primary-dark mb-6">
            <Cms k="about.experienceSubtitle" />
          </h3>
          <div className="space-y-6 text-lg text-text-light leading-relaxed">
            <p><Cms k="about.experienceIntro" /></p>
            <ul className="space-y-4">
              {experience.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-3 w-1.5 h-1.5 shrink-0 rounded-round bg-primary-dark" />
                  <Cms k={`about.experienceItems.${i}`} />
                  <ListItemControls listPath="about.experienceItems" index={i} />
                </li>
              ))}
              <ListAddButton listPath="about.experienceItems" as="li" />
            </ul>
            <p className="italic text-primary-dark font-serif text-xl"><Cms k="about.conclusion" /></p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
