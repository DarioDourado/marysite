import { Cms } from '@/src/components/cms/Cms.tsx';
import { RichHtml } from '@/src/components/cms/RichHtml.tsx';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { useSeo } from '@/src/hooks/cms/index.ts';

export type LegalSlug = 'privacy' | 'terms';

interface LegalPageProps {
  slug: LegalSlug;
}

/** Página de texto legal: cabeçalho e corpo vêm do CMS (secção com o nome do slug). */
export const LegalPage = ({ slug }: LegalPageProps) => {
  useSeo(slug);

  return (
    <section className="pt-12 md:pt-14 min-h-screen bg-muted">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <FadeIn className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h1 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-6 tracking-tight">
            <Cms k={`${slug}.title`} />
          </h1>
          <p className="text-sm uppercase tracking-widest text-primary-dark mb-6">
            <Cms k={`${slug}.updated`} />
          </p>
          <p className="text-lg md:text-xl text-text-light leading-relaxed">
            <Cms k={`${slug}.intro`} />
          </p>
        </FadeIn>
        <div className="bg-surface rounded-tile border border-line shadow-card px-6 py-10 md:px-12 md:py-14">
          <RichHtml
            k={`${slug}.body`}
            className="text-lg text-text-light leading-relaxed [&_h2:not(:first-child)]:mt-10"
          />
        </div>
      </div>
    </section>
  );
};
