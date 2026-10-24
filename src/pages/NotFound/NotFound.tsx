import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNoindex } from '@/src/hooks/cms/index.ts';

export const NotFound = () => {
  const { t } = useTranslation();
  useNoindex(t('system.notFound.title'));

  return (
    <section className="pt-12 md:pt-14 min-h-screen bg-surface flex items-center">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-8 tracking-tight">
          {t('system.notFound.title')}
        </h1>
        <p className="text-lg md:text-xl text-text-light leading-relaxed mb-10">{t('system.notFound.message')}</p>
        <Link to="/" className="inline-block px-10 py-4 btn-primary font-semibold">
          {t('system.notFound.home')}
        </Link>
      </div>
    </section>
  );
};
