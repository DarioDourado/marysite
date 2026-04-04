import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useHomeHook } from './useHomeHook.ts';
import { BookingCalendar } from '@/src/components/BookingCalendar.tsx';
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-background py-20 lg:py-0">
        <div className="absolute inset-0 z-0 opacity-40">
          <motion.div 
            style={{ y: blobY1 }}
            className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            style={{ y: blobY2 }}
            className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-dark rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
              <Sparkles className="w-3 h-3" />
              Psicologia Clínica Humanizada
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-[1.1] text-foreground mb-6 md:mb-8">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-text-light leading-relaxed max-w-lg mb-8 md:mb-12 italic">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-16">
              <button
                onClick={handleBooking}
                className="px-8 md:px-10 py-4 md:py-5 bg-primary text-foreground rounded-full font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
              >
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="space-y-6 md:space-y-8 text-base md:text-lg text-text-light leading-relaxed max-w-2xl">
              <div className="flex items-center gap-4 mb-2 md:mb-4">
                <div className="h-px flex-grow bg-primary/20" />
                <span className="text-primary font-serif italic text-lg md:text-xl">{t('hero.welcomeTitle')}</span>
                <div className="h-px flex-grow bg-primary/20" />
              </div>
              <p>{t('hero.welcomeText')}</p>
              <p className="font-medium text-foreground">{t('hero.introText')}</p>
              <p>{t('hero.spaceText')}</p>
              <p className="italic text-primary-dark">{t('hero.ctaInvitation')}</p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white">
              <img
                src="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=800&h=1000"
                alt="Flor Azul - Singularidade e Cuidado"
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl z-20 max-w-[240px] border border-secondary/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="font-serif font-bold text-lg">Empatia</span>
              </div>
              <p className="text-sm text-text-light leading-relaxed">
                Um espaço seguro e acolhedor para a sua jornada de autodescoberta.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-24 lg:py-40 bg-white relative overflow-hidden">
        {/* Background Parallax Element */}
        <motion.div 
          style={{ y: aboutBgY }}
          className="absolute top-0 left-0 w-full h-[120%] z-0 opacity-[0.02] pointer-events-none"
        >
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Background Pattern" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            {/* Image Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="aspect-[3/4] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border-[1px] border-secondary/20 max-w-md mx-auto lg:max-w-none">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800&h=1067" 
                    alt="Mariline Bôto" 
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Decorative Element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -z-10" />
              </motion.div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">
                  {t('about.title')}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold text-foreground mb-8 md:mb-12 leading-tight">
                  Mariline Bôto
                </h2>

                <div className="space-y-8 md:space-y-10 text-base md:text-lg text-text-light leading-relaxed">
                  <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
                    {t('about.educationContent')}
                  </p>
                  
                  <p>{t('about.approachContent')}</p>

                  <div className="pt-8 border-t border-secondary/10">
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary mb-6 md:mb-8">
                      {t('about.educationTitle')}
                    </h3>
                    <p className="mb-8 md:mb-10">{t('about.experienceIntro')}</p>
                    
                    <div className="grid grid-cols-1 gap-6 md:gap-8">
                      {[
                        { key: 'experienceChildhood', icon: <Sparkles className="w-5 h-5" /> },
                        { key: 'experienceAdolescence', icon: <Shield className="w-5 h-5" /> },
                        { key: 'experienceAdults', icon: <User className="w-5 h-5" /> }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4 md:gap-6 group">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-background border border-secondary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-foreground transition-all duration-500 flex-shrink-0">
                            {item.icon}
                          </div>
                          <p className="text-xs md:text-sm leading-relaxed pt-1">
                            {t(`about.${item.key}`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 md:pt-12">
                    <p className="italic text-primary-dark font-serif text-lg md:text-xl leading-relaxed relative pl-10 md:pl-12">
                      <span className="absolute left-0 top-0 text-4xl md:text-6xl text-primary/20 font-serif leading-none">"</span>
                      {t('about.conclusion')}
                    </p>
                  </div>

                  <div className="pt-12 md:pt-16 grid grid-cols-2 gap-8 md:gap-12 border-t border-secondary/10">
                    <div>
                      <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">10+</div>
                      <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-text-light">Anos de Prática</div>
                    </div>
                    <div>
                      <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">500+</div>
                      <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-text-light">Processos Clínicos</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Intervention */}
      <section id="areas" className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
              {t('areas.title')}
            </h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-text-light leading-relaxed">
              <p>{t('areas.intro')}</p>
              <p className="font-medium text-foreground">{t('areas.subtitle')}</p>
              <p className="italic text-primary">{t('areas.ctaText')}</p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Object.entries(t('areas.list', { returnObjects: true })).map(([key, area]: [string, any]) => {
              const areaImages: Record<string, string> = {
                trauma: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600&h=400",
                anxiety: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=600&h=400",
                patterns: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600&h=400",
                transitions: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600&h=400",
                dynamics: "https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=600&h=400",
                self: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=600&h=400"
              };

              return (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className="bg-white rounded-[32px] border border-secondary/10 hover:shadow-xl hover:shadow-secondary/20 transition-all group overflow-hidden"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={areaImages[key]} 
                      alt={area.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-10">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-foreground transition-colors">
                      {key === 'trauma' && <Heart className="w-7 h-7" />}
                      {key === 'anxiety' && <Shield className="w-7 h-7" />}
                      {key === 'patterns' && <Sparkles className="w-7 h-7" />}
                      {key === 'transitions' && <ArrowRight className="w-7 h-7" />}
                      {key === 'dynamics' && <User className="w-7 h-7" />}
                      {key === 'self' && <Heart className="w-7 h-7" />}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-4">
                      {area.title}
                    </h3>
                    <p className="text-text-light leading-relaxed text-sm">
                      {area.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <div className="mt-16 text-center">
            <button
              onClick={handleBooking}
              className="px-10 py-5 bg-primary text-foreground rounded-full font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Parallax Image Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <motion.div
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920&h=1080")',
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
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              Um caminho para o florescimento do ser.
            </h2>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="approach" className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6 md:mb-8">
                {t('approach.title')}
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-text-light leading-relaxed">
                <p className="font-serif italic text-xl md:text-2xl text-primary-dark">{t('approach.intro')}</p>
                <p>{t('approach.commitment')}</p>
                <p className="font-medium text-foreground">{t('approach.wish')}</p>
              </div>
            </div>
            <div className="aspect-video rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 md:border-8 border-background">
              <img 
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Ramo Florido - Crescimento e Transformação" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="mb-24 md:mb-32">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-center text-foreground mb-10 md:mb-12">
              {t('approach.valuesTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Object.entries(t('approach.values', { returnObjects: true })).map(([key, value]: [string, any]) => (
                <div key={key} className="p-6 md:p-8 bg-background rounded-3xl border border-secondary/10">
                  <h4 className="text-lg md:text-xl font-serif font-bold text-primary mb-3">{value.title}</h4>
                  <p className="text-text-light text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-foreground relative overflow-hidden border border-primary/20">
            <div className="absolute top-0 right-0 w-[40%] h-full bg-white/40 skew-x-12 translate-x-1/2 hidden md:block" />
            
            <div className="max-w-3xl relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold mb-8 md:mb-10 text-primary-dark">
                {t('approach.frameworkTitle')}
              </h2>
              <div className="space-y-6 md:space-y-8 text-base md:text-lg">
                <p className="text-text-light">{t('approach.frameworkIntro')}</p>
                <p className="font-medium text-foreground">{t('approach.frameworkModel')}</p>
                
                <div className="space-y-4 md:space-y-6">
                  {Object.entries(t('approach.frameworkPoints', { returnObjects: true })).map(([key, point]: [string, any], index) => (
                    <div key={key} className="flex gap-4 md:gap-6">
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center font-serif text-lg md:text-xl italic text-primary shadow-sm">{index + 1}</div>
                      <p className="text-text-light leading-relaxed text-sm md:text-base">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 md:pt-8 space-y-4 md:space-y-6 border-t border-primary/20">
                  <p className="italic text-text-light text-sm md:text-base">{t('approach.integrativeText')}</p>
                  <p className="text-text-light text-sm md:text-base">{t('approach.schemaText')}</p>
                  <p className="text-text-light text-sm md:text-base">{t('approach.actText')}</p>
                  <p className="font-medium text-lg md:text-xl pt-4 text-primary-dark">{t('approach.conclusion')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
              {t('areas.title')}
            </h2>
            <p className="text-base md:text-lg text-text-light leading-relaxed">
              {t('hero.ctaInvitation')}
            </p>
          </div>
          
          <BookingCalendar />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacts" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6 md:mb-8">
                {t('contacts.title')}
              </h2>
              <div className="space-y-6 md:space-y-8 text-base md:text-lg text-text-light leading-relaxed mb-10 md:mb-12">
                <p>{t('contacts.intro')}</p>
                <p className="font-medium text-foreground">{t('contacts.spaceInfo')}</p>
                
                <div className="flex flex-col gap-4 pt-6 md:pt-8 border-t border-secondary/10">
                  <button
                    onClick={handleBooking}
                    className="w-full sm:w-fit px-10 py-4 md:py-5 bg-primary text-foreground rounded-full font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    {t('hero.cta')}
                  </button>
                  <p className="text-xs md:text-sm italic">{t('contacts.questions')}</p>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="p-3 md:p-4 bg-primary/10 text-primary rounded-xl md:rounded-2xl">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-serif font-bold mb-1">E-mail</h4>
                    <p className="text-sm md:text-base text-text-light">{t('contacts.email')}</p>
                  </div>
                </div>

                <div className="aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-secondary/10">
                  <img 
                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800&h=600" 
                    alt="Espaço de Trabalho Acolhedor" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-background p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-secondary/10">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6 md:mb-8">{t('contacts.form.title')}</h3>
              <form className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-light mb-2">{t('contacts.form.name')}</label>
                    <input type="text" placeholder={t('contacts.form.namePlaceholder')} className="w-full px-5 py-3 md:px-6 md:py-4 bg-white border border-secondary/20 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-light mb-2">{t('contacts.form.email')}</label>
                    <input type="email" placeholder={t('contacts.form.emailPlaceholder')} className="w-full px-5 py-3 md:px-6 md:py-4 bg-white border border-secondary/20 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-light mb-2">{t('contacts.form.subject')}</label>
                  <input type="text" placeholder={t('contacts.form.subjectPlaceholder')} className="w-full px-5 py-3 md:px-6 md:py-4 bg-white border border-secondary/20 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-light mb-2">{t('contacts.form.message')}</label>
                  <textarea placeholder={t('contacts.form.messagePlaceholder')} className="w-full px-5 py-3 md:px-6 md:py-4 bg-white border border-secondary/20 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary transition-colors min-h-[120px] md:min-h-[150px] text-sm" />
                </div>
                <button className="w-full py-4 md:py-5 bg-foreground text-white rounded-xl md:rounded-2xl font-medium hover:bg-foreground/90 transition-all text-sm md:text-base">
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
