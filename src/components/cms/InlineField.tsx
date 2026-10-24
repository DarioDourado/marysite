import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InlineFieldProps {
  initial: string;
  isPending: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
}

/** Campo de texto simples no lugar do texto; herda a largura do elemento onde está. */
export const InlineField = ({ initial, isPending, onSave, onCancel }: InlineFieldProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(initial);
  const rows = Math.min(6, Math.max(1, Math.ceil(value.length / 50)));
  return (
    <span
      className="inline-flex w-full max-w-full flex-col gap-2 align-top font-sans text-base font-normal normal-case tracking-normal not-italic"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <textarea
        autoFocus
        rows={rows}
        value={value}
        aria-label={t('admin.edit.field')}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === 'Escape') onCancel();
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSave(value);
          }
        }}
        className="w-full min-w-[14rem] px-3 py-2 rounded-control border-2 border-primary-dark bg-surface text-foreground leading-snug resize-y"
      />
      <span className="inline-flex gap-2">
        <button
          type="button"
          disabled={isPending}
          aria-label={t('admin.common.save')}
          onClick={() => onSave(value)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-control bg-primary-dark text-on-primary text-sm disabled:opacity-60"
        >
          <Check className="w-4 h-4" /> {t('admin.common.save')}
        </button>
        <button
          type="button"
          aria-label={t('admin.common.cancel')}
          onClick={onCancel}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-control bg-surface text-foreground border border-line text-sm"
        >
          <X className="w-4 h-4" /> {t('admin.common.cancel')}
        </button>
      </span>
    </span>
  );
};
