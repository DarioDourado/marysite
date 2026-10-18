import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';
import { AreaIcon } from '@/src/components/ui/AreaIcon.tsx';
import { areasContent } from './areasContent.ts';

export const Areas = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-12 md:pt-14">
      <section className="relative isolate overflow-hidden">
        <SafeImage
          src="/img/areas-de-intervencao.webp"
          fallbackSrc="https://images.pexels.com/photos/7091864/pexels-photo-7091864.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt={t('areas.imageAlt')}
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-36 lg:py-44">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-normal text-white mb-8 tracking-tight leading-[1.08]">
              {t('areasPage.title')}
            </h1>
            <div className="space-y-6 text-lg md:text-xl text-white/90 leading-relaxed mb-12">
              <p>{t('areasPage.intro')}</p>
              <p>{t('areasPage.navIntro')}</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <nav aria-label={t('areasPage.title')} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {areasContent.map((area) => (
                  <a
                    key={area.id}
                    href={`#${area.id}`}
                    className="flex items-center justify-center min-h-20 px-4 py-3 rounded-2xl bg-white text-primary-dark text-sm font-medium text-center leading-snug border border-primary-medium/40 hover:bg-primary-dark hover:text-white transition-colors"
                  >
                    {area.title}
                  </a>
                ))}
              </nav>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-gray-100 py-10 md:py-16 space-y-8 md:space-y-12">
      {areasContent.map((area) => (
        <section key={area.id} id={area.id} className="scroll-mt-16 px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm px-6 py-10 md:px-12 md:py-14">
            <FadeIn>
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full bg-primary text-primary-dark flex items-center justify-center">
                  <AreaIcon id={area.id} className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground">{area.title}</h2>
              </div>

              <h3 className="text-xl font-serif text-primary-dark mb-3">{t('areasPage.whatIs')}</h3>
              <p className="text-lg text-text-light leading-relaxed mb-10">{area.whatIs}</p>

              <h3 className="text-xl font-serif text-primary-dark mb-3">{t('areasPage.signs')}</h3>
              <ul className="space-y-3 text-lg text-text-light leading-relaxed mb-10">
                {area.signs.map((sign) => (
                  <li key={sign} className="flex items-start gap-3">
                    <span className="mt-3 w-1.5 h-1.5 shrink-0 rounded-full bg-primary-dark" />
                    {sign}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-serif text-primary-dark mb-3">{t('areasPage.help')}</h3>
              <p className="text-lg text-text-light leading-relaxed">{area.help}</p>
            </FadeIn>
          </div>
        </section>
      ))}
      </div>

      <section className="py-16 text-center bg-white">
        <Link
          to="/#booking-section"
          className="inline-block px-10 py-4 bg-primary-dark text-white rounded-full font-semibold hover:bg-primary-dark/90 transition-all"
        >
          {t('hero.cta')}
        </Link>
      </section>
    </div>
  );
};
