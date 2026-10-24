import { m } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { CmsImage } from '@/src/components/cms/CmsImage.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { WhatsAppButton } from '@/src/components/ui/WhatsAppButton.tsx';

interface HeroSectionProps {
  onBooking: () => void;
}

export const HeroSection = ({ onBooking }: HeroSectionProps) => {
  const attr = useAttrText();

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-primary-medium">
        <m.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CmsImage
            path="hero.background"
            sizes="100vw"
            fetchPriority="high"
            fallback="/img/hortensias.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </m.div>
        <div className="absolute inset-0 bg-foreground/35" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-on-image drop-shadow-lg mb-8 leading-[1.08]">
              <Cms k="hero.title" />
            </h1>
            <p className="max-w-2xl text-lg md:text-2xl text-on-image leading-relaxed font-medium drop-shadow">
              <Cms k="hero.subtitle" />
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] max-w-[16rem] lg:max-w-xs mx-auto lg:ml-auto rounded-panel overflow-hidden shadow-float bg-primary/40">
              <CmsImage
                path="hero.photo"
                sizes="(min-width: 1024px) 320px, 256px"
                fetchPriority="high"
                fallback="/img/mariline-boto-2.webp"
                alt={attr('hero.imageAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-surface py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-serif font-normal text-primary-dark mb-8">
          <Cms k="hero.welcomeTitle" />
        </h2>
        <div className="space-y-6 text-lg text-text-light leading-relaxed">
          <p><Cms k="hero.welcomeText" /></p>
          <p className="text-foreground font-medium"><Cms k="hero.ctaInvitation" /></p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBooking}
          className="px-10 py-4 btn-primary font-semibold shadow-button flex items-center justify-center gap-3 group text-lg"
        >
          <Cms k="hero.cta" />
          <ArrowRight className="w-6 h-6 arrow-shift" strokeWidth={1.5} />
        </button>
          <WhatsAppButton />
        </div>
      </div>
    </section>
    </>
  );
};
