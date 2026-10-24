import { useTranslation } from 'react-i18next';
import { sanitizeRich } from '@/src/lib/cms/sanitize.ts';
import { resolveItem } from '@/src/lib/cms/adminIndex.ts';
import { cn } from '@/src/lib/utils.ts';
import { EditableText } from './EditableText.tsx';
import { useEditMode } from './EditModeContext.ts';

// Reproduz os estilos que as respostas do FAQ tinham como classes em cada elemento
export const RICH_STYLES = [
  '[&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-foreground [&_h2]:mb-2',
  '[&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-2 [&_h3:not(:first-child)]:mt-4',
  '[&_p:not(:last-child)]:mb-2',
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2',
  '[&_strong]:font-semibold [&_strong]:text-foreground [&_a]:underline',
].join(' ');

interface RichHtmlProps {
  k: string;
  className?: string;
}

export const RichHtml = ({ k, className }: RichHtmlProps) => {
  const { t } = useTranslation();
  const { enabled, index, can } = useEditMode();
  const target = enabled && index ? resolveItem(index, k) : undefined;
  return (
    <>
      <div className={cn(className, RICH_STYLES)} dangerouslySetInnerHTML={{ __html: sanitizeRich(t(k)) }} />
      {target && can('text', target.pageSlug) && (
        <div className="px-8 pb-4">
          <EditableText target={target}>{null}</EditableText>
        </div>
      )}
    </>
  );
};
