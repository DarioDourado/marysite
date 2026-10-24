import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { ListAddButton, ListItemControls } from '@/src/components/cms/ListControls.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { CmsImage } from '@/src/components/cms/CmsImage.tsx';
import { AreaIcon } from '@/src/components/ui/AreaIcon.tsx';
import { useAreaPages, useSeo } from '@/src/hooks/cms/index.ts';

export const Areas = () => {
  const { t } = useTranslation();
  const areas = useAreaPages();
  const attr = useAttrText();
  useSeo('areas');

  return (
    <div className="pt-12 md:pt-14">
      <section className="relative isolate overflow-hidden">
        <CmsImage
          path="areasPage.banner"
          fallback="/img/areas-de-intervencao.webp"
          fallbackSrc="https://images.pexels.com/photos/7091864/pexels-photo-7091864.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt={attr('areas.imageAlt')}
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-overlay/55" />
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-36 lg:py-44">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-normal text-on-image mb-8 tracking-tight leading-[1.08]">
              <Cms k="areasPage.title" />
            </h1>
            <div className="space-y-6 text-lg md:text-xl text-on-image/90 leading-relaxed mb-12">
              <p><Cms k="areasPage.intro" /></p>
              <p><Cms k="areasPage.navIntro" /></p>
            </div>
            <div className="max-w-4xl mx-auto">
              <nav aria-label={t('areasPage.title')} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {areas.map((area, index) => (
                  <a
                    key={area.slug}
                    href={`#${area.slug}`}
                    className="flex items-center justify-center min-h-20 px-4 py-3 rounded-tile bg-surface text-primary-dark text-sm font-medium text-center leading-snug border border-primary-medium/40 hover:bg-primary-dark hover:text-on-primary transition-colors duration-(--motion-duration)"
                  >
                    <Cms k={`areaPages.${index}.title`} />
                  </a>
                ))}
              </nav>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-muted py-10 md:py-16 space-y-8 md:space-y-12">
      {areas.map((area, index) => (
        <section key={area.slug} id={area.slug} className="scroll-mt-16 px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-surface rounded-tile border border-line shadow-card px-6 py-10 md:px-12 md:py-14">
            <FadeIn>
              <ListItemControls listPath="areaPages" index={index} />
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-round bg-primary text-primary-dark flex items-center justify-center">
                  <AreaIcon id={area.slug} className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground"><Cms k={`areaPages.${index}.title`} /></h2>
              </div>

              <h3 className="text-xl font-serif text-primary-dark mb-3"><Cms k="areasPage.whatIs" /></h3>
              <p className="text-lg text-text-light leading-relaxed mb-10"><Cms k={`areaPages.${index}.whatIs`} /></p>

              <h3 className="text-xl font-serif text-primary-dark mb-3"><Cms k="areasPage.signs" /></h3>
              <ul className="space-y-3 text-lg text-text-light leading-relaxed mb-10">
                {area.signs.map((sign, signIndex) => (
                  <li key={sign} className="flex items-start gap-3">
                    <span className="mt-3 w-1.5 h-1.5 shrink-0 rounded-round bg-primary-dark" />
                    <Cms k={`areaPages.${index}.signs.${signIndex}`} />
                    <ListItemControls listPath={`areaPages.${index}.signs`} index={signIndex} />
                  </li>
                ))}
                <ListAddButton listPath={`areaPages.${index}.signs`} as="li" />
              </ul>

              <h3 className="text-xl font-serif text-primary-dark mb-3"><Cms k="areasPage.help" /></h3>
              <p className="text-lg text-text-light leading-relaxed"><Cms k={`areaPages.${index}.help`} /></p>
            </FadeIn>
          </div>
        </section>
      ))}
      <ListAddButton listPath="areaPages" />
      </div>

      <section className="py-16 text-center bg-surface">
        <Link
          to="/#booking-section"
          className="inline-block px-10 py-4 btn-primary font-semibold"
        >
          <Cms k="hero.cta" />
        </Link>
      </section>
    </div>
  );
};
