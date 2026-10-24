import { useTranslation } from 'react-i18next';
import { useCms } from '@/src/hooks/cms/index.ts';
import { cn } from '@/src/lib/utils.ts';

/** Seletor de idioma. Só existe com I18N=true na API; com I18N=false não renderiza nada. */
export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation();
  const { config } = useCms();
  if (!config.i18n) return null;
  const current = (i18n.resolvedLanguage ?? config.defaultLang).split('-')[0];

  return (
    <div role="group" aria-label="Language" className={cn('flex items-center gap-1 text-[13px] font-serif', className)}>
      {config.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          aria-pressed={locale === current}
          onClick={() => void i18n.changeLanguage(locale)}
          className={cn(
            'px-2 py-1 uppercase tracking-wide transition-colors',
            locale === current ? 'text-primary-dark font-semibold' : 'text-text-light hover:text-primary-dark',
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
};
