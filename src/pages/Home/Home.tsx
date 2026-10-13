import { useHomeHook } from './useHomeHook.ts';
import { HeroSection } from './sections/HeroSection.tsx';
import { AboutSection } from './sections/AboutSection.tsx';
import { AreasSection } from './sections/AreasSection.tsx';
import { QuoteSection } from './sections/QuoteSection.tsx';
import { ApproachSection } from './sections/ApproachSection.tsx';
import { BookingSection } from './sections/BookingSection.tsx';
import { ContactSection } from './sections/ContactSection.tsx';

export const Home = () => {
  const { areas, handleBooking } = useHomeHook();

  return (
    <div className="pt-12 md:pt-14 overflow-x-hidden">
      <HeroSection onBooking={handleBooking} />
      <AboutSection />
      <AreasSection areas={areas} />
      <QuoteSection />
      <ApproachSection />
      <BookingSection />
      <ContactSection />
    </div>
  );
};
