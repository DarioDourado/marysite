import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { areasContent } from './areasContent.ts';

export const Areas = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-12 md:pt-14">
      <section className="section-spacing bg-blue-texture">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
              {t('areasPage.title')}
            </h1>
            <div className="space-y-6 text-lg text-text-light leading-relaxed mb-12">
              <p>{t('areasPage.intro')}</p>
              <p>{t('areasPage.navIntro')}</p>
            </div>
            <nav aria-label={t('areasPage.title')} className="flex flex-wrap gap-3">
              {areasContent.map((area) => (
                <a
                  key={area.id}
                  href={`#${area.id}`}
                  className="px-5 py-2 rounded-full bg-white text-primary-dark text-sm font-medium border border-primary-medium/40 hover:bg-primary-dark hover:text-white transition-colors"
                >
                  {area.title}
                </a>
              ))}
            </nav>
          </FadeIn>
        </div>
      </section>

      {areasContent.map((area, index) => (
        <section
          key={area.id}
          id={area.id}
          className={`scroll-mt-16 py-16 md:py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}`}
        >
          <div className="max-w-4xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-10">
                {index + 1}. {area.title}
              </h2>

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
