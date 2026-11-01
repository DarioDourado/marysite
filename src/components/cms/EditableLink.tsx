import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { useCms } from '@/src/hooks/cms/useCms.ts';
import { useUpdateItem } from '@/src/hooks/cms/useUpdateItem.ts';
import { cn } from '@/src/lib/utils.ts';
import { SOCIAL_ICONS } from '@/src/lib/socialIcon.ts';
import { resolveItem } from '@/src/lib/cms/adminIndex.ts';
import { useEditMode } from './EditModeContext.ts';
import { PencilButton } from './PencilButton.tsx';

/** A API só aceita ligações com esquema (https:, mailto:, tel:) ou internas (/, #): «www.instagram.com» passa a «https://www.instagram.com». */
const normalizeUrl = (url: string): string =>
  url === '' || /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`;

interface EditableLinkProps {
  /** Caminho do item de ligação: `footer.social.0`. */
  k: string;
  /** A ligação (ícone) tal como aparece no site. */
  children: ReactNode;
}

/** Ligação sem texto visível (ícone). Sem edição renderiza só os filhos; em edição junta um lápis ao lado. */
export const EditableLink = ({ k, children }: EditableLinkProps) => {
  const { t } = useTranslation();
  const { config } = useCms();
  const { enabled, index, can, locale } = useEditMode();
  const update = useUpdateItem();
  const [editing, setEditing] = useState(false);

  const target = enabled && index ? resolveItem(index, k) : undefined;
  if (!target || target.node.kind !== 'link' || !can('text', target.pageSlug)) return <>{children}</>;

  const { node } = target;
  const currentLabel = node.value?.[locale] ?? node.value?.[config.defaultLang] ?? '';
  const currentUrl = node.linkUrl ?? '';
  const currentIcon = node.icon ?? '';

  return (
    <span className="inline-flex items-center">
      {/* Em edição, clicar no ícone abre o diálogo em vez de seguir a ligação */}
      <span
        onClickCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setEditing(true);
        }}
        className="inline-flex cursor-pointer"
      >
        {children}
      </span>
      <PencilButton label={t('admin.edit.pencil')} onActivate={() => setEditing(true)} />
      {editing && (
        <LinkDialog
          key={node.version}
          url={currentUrl}
          label={currentLabel}
          icon={currentIcon}
          isPending={update.isPending}
          onCancel={() => setEditing(false)}
          onSave={(url, label, icon) => {
            const done = () => setEditing(false);
            const saveLabel = (version: number) =>
              label === currentLabel
                ? done()
                : update.mutate({ id: node.id, input: { version, locale, value: label } }, { onSuccess: done });
            if (url === currentUrl && icon === currentIcon) return saveLabel(node.version);
            update.mutate(
              { id: node.id, input: { version: node.version, linkUrl: url, icon } },
              { onSuccess: (saved) => (label === currentLabel ? done() : saveLabel(saved.version)) },
            );
          }}
        />
      )}
    </span>
  );
};

interface LinkDialogProps {
  url: string;
  label: string;
  icon: string;
  isPending: boolean;
  onSave: (url: string, label: string, icon: string) => void;
  onCancel: () => void;
}

const LinkDialog = ({ url, label, icon, isPending, onSave, onCancel }: LinkDialogProps) => {
  const { t } = useTranslation();
  const [urlValue, setUrlValue] = useState(url);
  const [labelValue, setLabelValue] = useState(label);
  const [iconValue, setIconValue] = useState(icon);
  return (
    <Modal title={t('admin.edit.linkTitle')} onClose={onCancel}>
      <div className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="block text-xs text-text-light">{t('admin.edit.linkIcon')}</legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={iconValue === ''}
              onClick={() => setIconValue('')}
              className={cn('px-3 py-2 rounded-control border text-sm', iconValue === '' ? 'border-primary-dark bg-primary/10' : 'border-line')}
            >
              {t('admin.edit.linkIconAuto')}
            </button>
            {Object.entries(SOCIAL_ICONS).map(([key, { label: name, icon: Icon }]) => (
              <button
                key={key}
                type="button"
                aria-label={name}
                title={name}
                aria-pressed={iconValue === key}
                onClick={() => setIconValue(key)}
                className={cn('p-3 rounded-control border', iconValue === key ? 'border-primary-dark bg-primary/10 text-primary-dark' : 'border-line text-foreground')}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="space-y-1">
          <label className="block text-xs text-text-light" htmlFor="edit-link-url">{t('admin.edit.linkUrl')}</label>
          <input id="edit-link-url" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} className="w-full px-3 py-2 input bg-surface" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-text-light" htmlFor="edit-link-label">{t('admin.edit.linkLabel')}</label>
          <input id="edit-link-label" value={labelValue} onChange={(e) => setLabelValue(e.target.value)} className="w-full px-3 py-2 input bg-surface" />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-control border border-line text-foreground">
          {t('admin.common.cancel')}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave(normalizeUrl(urlValue.trim()), labelValue.trim(), iconValue)}
          className="px-5 py-2 btn-primary rounded-control disabled:opacity-60"
        >
          {t('admin.common.save')}
        </button>
      </div>
    </Modal>
  );
};
