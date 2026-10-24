import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { ListAddButton, ListItemControls } from '@/src/components/cms/ListControls.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { CmsImage } from '@/src/components/cms/CmsImage.tsx';
import { FAQAccordion } from '@/src/components/FAQAccordion.tsx';
import { AreaIcon } from '@/src/components/ui/AreaIcon.tsx';
import { useAreaPages } from '@/src/hooks/cms/index.ts';

export const AreasSection = () => {
  const { t } = useTranslation();
  const areas = useAreaPages();
  const attr = useAttrText();

  return (
    <section id="areas" className="section-spacing bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
            <Cms k="areas.title" />
          </h2>
          <p className="text-lg md:text-xl text-text-light leading-relaxed"><Cms k="areas.intro" /></p>
        </FadeIn>

        <FadeIn className="mb-16 md:mb-20">
          <CmsImage
            path="areas.banner"
            fallback="/img/areas-de-intervencao.webp"
            fallbackSrc="https://images.pexels.com/photos/7091864/pexels-photo-7091864.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt={attr('areas.imageAlt')}
            className="w-full h-64 md:h-96 object-cover rounded-panel"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, index) => (
            <FadeIn
              key={area.slug}
              delay={index * 0.05}
              className="group flex flex-col bg-primary rounded-card p-8 hover-tint"
            >
              <div className="w-16 h-16 mb-6 rounded-round bg-surface/70 text-primary-dark flex items-center justify-center">
                <AreaIcon id={area.slug} className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-serif font-normal text-foreground mb-4"><Cms k={`areaPages.${index}.title`} /></h3>
              <p className="text-text-light text-base leading-relaxed mb-6"><Cms k={`areaPages.${index}.summary`} /></p>
              <Link
                to={`/areas#${area.slug}`}
                className="mt-auto inline-flex items-center gap-2 text-primary-dark font-medium text-sm hover:underline"
              >
                <Cms k="areas.learnMore" />
                <ArrowRight className="w-4 h-4 arrow-shift" strokeWidth={1.5} />
              </Link>
              <ListItemControls listPath="areaPages" index={index} />
            </FadeIn>
          ))}
        </div>
        <ListAddButton listPath="areaPages" />

        <FAQAccordion />
      </div>
    </section>
  );
};
