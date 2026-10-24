import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { Cms } from '@/src/components/cms/Cms.tsx';
import { CmsImage } from '@/src/components/cms/CmsImage.tsx';
import { useAttrText } from '@/src/components/cms/useAttrText.ts';
import { BookingForm } from '@/src/components/BookingForm.tsx';

export const BookingSection = () => {
  const attr = useAttrText();

  return (
    <section id="booking-section" className="section-spacing bg-primary/10">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto mb-16 md:mb-20">
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] max-w-[14rem] mx-auto rounded-card overflow-hidden shadow-panel bg-surface/60">
              <CmsImage
                path="booking.photo"
                loading="lazy"
                fallback="/img/mariline-boto-1.webp"
                alt={attr('booking.photoAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-8 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-6">
              <Cms k="booking.title" />
            </h2>
            <p className="text-lg text-text-light leading-relaxed"><Cms k="booking.text" /></p>
          </div>
        </FadeIn>

        <FadeIn>
          <BookingForm />
        </FadeIn>
      </div>
    </section>
  );
};
