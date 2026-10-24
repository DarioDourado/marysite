import { useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import i18n from '@/src/lib/i18n.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';
import { applyContent } from './applyContent.ts';
import { CmsContext, type CmsContextValue } from './CmsContext.ts';
import { loadCmsContent } from './loadContent.ts';

export const CmsProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { data, isPending } = useQuery({
    queryKey: queryKeys.cms.public,
    queryFn: loadCmsContent,
    staleTime: 60_000,
  });
  const [applied, setApplied] = useState<CmsContextValue | null>(null);

  // Em efeito (não no render): o i18next avisa os componentes ao receber recursos novos.
  // Os filhos só montam depois, para nunca verem chaves em vez de texto.
  useEffect(() => {
    if (!data) return;
    setApplied(applyContent(data));
    // Com i18n desligado só existe o idioma por omissão, venha o que vier do browser
    const current = (i18n.resolvedLanguage ?? i18n.language ?? '').split('-')[0] ?? '';
    if (!data.config.i18n || !data.config.locales.includes(current)) {
      void i18n.changeLanguage(data.config.defaultLang);
    }
  }, [data]);

  // Mesmo bloco vazio do fallback das rotas: sem flash de chaves nem de outro conteúdo
  if (isPending || (data && !applied)) return <div className="min-h-screen" />;
  if (!applied) {
    return (
      <main role="alert" className="min-h-screen flex items-center justify-center p-6 text-center text-text-light">
        {t('system.loadError')}
      </main>
    );
  }
  return <CmsContext.Provider value={applied}>{children}</CmsContext.Provider>;
};
