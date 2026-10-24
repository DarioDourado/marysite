import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { CmsImage } from '@/src/components/cms/CmsImage.tsx';

export const QuoteSection = () => {
  return (
    <section className="relative h-[50vh] md:h-[80vh] md:min-h-120 overflow-hidden bg-primary-medium">
      <CmsImage
        path="quote.background"
        loading="lazy"
        fallback="/img/florescimento.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/25" />
      <FadeIn className="relative h-full flex items-center justify-center text-center px-6">
        <h2 className="max-w-3xl text-3xl md:text-5xl font-serif font-normal text-on-image drop-shadow-lg">
          <Cms k="quote.text" />
        </h2>
      </FadeIn>
    </section>
  );
};
