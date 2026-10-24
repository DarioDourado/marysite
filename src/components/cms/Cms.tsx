import { useTranslation } from 'react-i18next';
import { useCms } from '@/src/hooks/cms/index.ts';
import { resolveItem } from '@/src/lib/cms/adminIndex.ts';
import { renderInline } from '@/src/lib/cms/renderInline.tsx';
import { EditableText } from './EditableText.tsx';
import { useEditMode } from './EditModeContext.ts';

interface CmsProps {
  /** Caminho do conteúdo, igual à chave i18next: `hero.title`, `about.intro.0`. */
  k: string;
}

/** Texto do CMS. Sem edição renderiza só o texto, sem elementos extra. */
export const Cms = ({ k }: CmsProps) => {
  const { t } = useTranslation();
  const { kinds } = useCms();
  const { enabled, index, can } = useEditMode();
  const value = t(k);
  const display = kinds[k] === 'inline' ? renderInline(value) : value;

  const target = enabled && index ? resolveItem(index, k) : undefined;
  if (!target || !can('text', target.pageSlug)) return <>{display}</>;
  return <EditableText target={target}>{display}</EditableText>;
};
