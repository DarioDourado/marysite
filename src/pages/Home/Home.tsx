import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useHomeHook } from './useHomeHook.ts';
import { BookingForm } from '@/src/components/BookingForm.tsx';
import { FAQAccordion } from '@/src/components/FAQAccordion.tsx';
import { ArrowRight, Heart, Shield, Sparkles, User, MessageCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';

export const Home = () => {
  const { t, areas, handleBooking } = useHomeHook();
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  
  const aboutBgY = useTransform(aboutScroll, [0, 1], ["-10%", "10%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.4, ease: "easeOut" } 
    }
  };

  return (
    <div className="pt-12 md:pt-14 overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight text-foreground mb-8 leading-[1.05]">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-text-light leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16 font-medium opacity-90">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20 md:mb-32">
                <button
                  onClick={handleBooking}
                  className="px-12 py-5 bg-primary-dark text-white rounded-full font-semibold hover:bg-primary-dark/90 transition-all shadow-2xl shadow-primary-dark/20 flex items-center justify-center gap-3 group text-lg"
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-left border-t border-secondary/40 pt-16 md:pt-20">
                <div className="space-y-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-dark opacity-80">{t('hero.welcomeTitle')}</span>
                  <p className="text-base md:text-lg text-text-light leading-relaxed font-medium">{t('hero.welcomeText')}</p>
                </div>
                <div className="space-y-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-dark opacity-80">Abordagem</span>
                  <p className="text-base md:text-lg text-text-light leading-relaxed font-medium">{t('hero.introText')}</p>
                </div>
                <div className="space-y-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-dark opacity-80">Compromisso</span>
                  <p className="text-base md:text-lg text-text-light leading-relaxed font-medium">{t('hero.spaceText')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="section-spacing bg-primary/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5">
              <motion.div
                initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
                className="relative max-w-md mx-auto lg:max-w-none"
              >
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-secondary/20">
                  <img 
                    src="/mariline-boto.jpg" 
                    alt="Mariline Bôto" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://www.asuapsicologaonline.pt/assets/images/sobre-mim.jpg";
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7">
              <motion.div
                initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-primary-dark font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                  {t('about.title')}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 leading-tight">
                  Mariline Bôto
                </h2>

                <div className="space-y-8 text-base md:text-lg text-text-light leading-relaxed">
                  <p className="text-xl text-foreground font-medium leading-relaxed">
                    {t('about.educationContent')}
                  </p>
                  
                  <p>{t('about.approachContent')}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-secondary/60">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary-dark mb-4">
                        Experiência
                      </h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-dark" />
                          {t('about.experienceChildhood')}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-dark" />
                          {t('about.experienceAdolescence')}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-dark" />
                          {t('about.experienceAdults')}
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="italic text-primary-dark font-serif text-xl leading-relaxed">
                        {t('about.conclusion')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Intervention */}
      <section id="areas" className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
            <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
              {t('areas.title')}
            </h2>
            <p className="text-lg md:text-xl text-text-light leading-relaxed">
              {t('areas.intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {areas.map((area, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: isMobile ? 0 : index * 0.05 }}
                className="group bg-secondary/20 rounded-[32px] p-8 md:p-10 hover:bg-primary/20 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-dark mb-8 shadow-sm group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" strokeWidth={1.2} />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-normal text-foreground mb-4">{area.title}</h3>
                <p className="text-text-light text-sm md:text-base leading-relaxed">{area.description}</p>
              </motion.div>
            ))}
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* Parallax Image Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?auto=format&fit=crop&q=80&w=1920")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            y: useTransform(useScroll({
              offset: ["start end", "end start"]
            }).scrollYProgress, [0, 1], ["-20%", "20%"])
          }}
          className="absolute inset-0 w-full h-[140%] -top-[20%]"
        />
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-serif font-normal text-white mb-6 drop-shadow-lg">
              Um caminho para o florescimento do ser.
            </h2>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="approach" className="section-spacing bg-primary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center mb-24 md:mb-40">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
                {t('approach.title')}
              </h2>
              <div className="space-y-8 text-lg text-text-light leading-relaxed">
                <p className="font-serif italic text-2xl text-primary-dark leading-relaxed">{t('approach.intro')}</p>
                <p>{t('approach.commitment')}</p>
                <p className="font-medium text-foreground">{t('approach.wish')}</p>
              </div>
            </div>
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200" 
                alt="Ramo Florido" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="bg-white rounded-[48px] p-10 md:p-20 shadow-sm border border-secondary/40">
            <h3 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-12 md:mb-16 text-center">
              {t('approach.frameworkTitle')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              <div className="space-y-8">
                <p className="text-lg text-text-light leading-relaxed">{t('approach.frameworkIntro')}</p>
                <div className="space-y-6">
                  {Object.entries(t('approach.frameworkPoints', { returnObjects: true })).map(([key, point]: [string, any], index) => (
                    <div key={key} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm">{index + 1}</div>
                      <p className="text-text-light leading-relaxed pt-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-8 pt-8 md:pt-0">
                <div className="p-8 bg-secondary/20 rounded-3xl space-y-4">
                  <p className="text-sm text-text-light italic">{t('approach.integrativeText')}</p>
                  <p className="text-sm text-text-light">{t('approach.schemaText')}</p>
                </div>
                <p className="text-xl font-serif font-normal text-primary-dark leading-relaxed">
                  {t('approach.conclusion')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="section-spacing bg-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 md:mb-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-foreground mb-8">
              Marcação de Consulta
            </h2>
            <p className="text-base md:text-lg text-text-light leading-relaxed">
              {t('hero.ctaInvitation')}
            </p>
          </div>
          
          <BookingForm />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacts" className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-40 items-start">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-10 tracking-tight">
                {t('contacts.title')}
              </h2>
              <div className="space-y-10 text-lg text-text-light leading-relaxed mb-16">
                <p>{t('contacts.intro')}</p>
                <p className="font-medium text-foreground">{t('contacts.spaceInfo')}</p>
                
                <div className="space-y-6 pt-10 border-t border-secondary/40">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center text-primary-dark">
                      <MessageCircle className="w-5 h-5" strokeWidth={1.2} />
                    </div>
                    <span className="text-foreground font-medium">{t('contacts.email')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/20 p-8 md:p-12 rounded-[40px]">
              <h3 className="text-2xl font-serif font-normal text-foreground mb-8">{t('contacts.form.title')}</h3>
              <form className="space-y-6">
                <div className="space-y-4">
                  <input type="text" placeholder={t('contacts.form.name')} className="w-full px-6 py-4 bg-white border border-secondary/40 rounded-2xl focus:outline-none focus:border-primary-dark transition-colors" />
                  <input type="email" placeholder={t('contacts.form.email')} className="w-full px-6 py-4 bg-white border border-secondary/40 rounded-2xl focus:outline-none focus:border-primary-dark transition-colors" />
                  <textarea placeholder={t('contacts.form.message')} className="w-full px-6 py-4 bg-white border border-secondary/40 rounded-2xl focus:outline-none focus:border-primary-dark transition-colors min-h-[150px]" />
                </div>
                <button className="w-full py-5 bg-foreground text-white rounded-2xl font-bold hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10">
                  {t('contacts.form.send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
