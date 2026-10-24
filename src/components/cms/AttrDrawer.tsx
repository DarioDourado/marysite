import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { useCms } from '@/src/hooks/cms/useCms.ts';
import { useUpdateItem } from '@/src/hooks/cms/useUpdateItem.ts';
import { resolveItem, type IndexedItem } from '@/src/lib/cms/adminIndex.ts';
import { useEditMode } from './EditModeContext.ts';

function AttrRow({ path, target }: { path: string; target: IndexedItem }) {
  const { t } = useTranslation();
  const { config } = useCms();
  const { locale } = useEditMode();
  const update = useUpdateItem();
  const { node } = target;
  const isUrl = path.endsWith('.url');
  const current = isUrl ? (node.linkUrl ?? '') : (node.value?.[locale] ?? node.value?.[config.defaultLang] ?? '');
  const [value, setValue] = useState(current);

  const save = () =>
    update.mutate({
      id: node.id,
      input: isUrl ? { version: node.version, linkUrl: value } : { version: node.version, locale, value },
    });

  return (
    <li className="space-y-1">
      <label className="block text-xs text-text-light" htmlFor={`attr-${path}`}>
        {path}
      </label>
      <div className="flex gap-2">
        <input
          id={`attr-${path}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="flex-1 px-3 py-2 input bg-surface"
        />
        <button
          type="button"
          disabled={update.isPending || value === current}
          onClick={save}
          className="px-4 rounded-control bg-primary-dark text-on-primary disabled:opacity-50"
        >
          {t('admin.common.save')}
        </button>
      </div>
    </li>
  );
}

/** Textos que não se veem como texto no site (placeholders, descrições de imagens, ligações). */
export const AttrDrawer = () => {
  const { t } = useTranslation();
  const { attrOpen, setAttrOpen, getAttrPaths, index, can } = useEditMode();
  if (!attrOpen || !index) return null;
  const rows = getAttrPaths().flatMap((path) => {
    const target = resolveItem(index, path);
    return target && can('text', target.pageSlug) ? [{ path, target }] : [];
  });
  return (
    <Modal title={t('admin.attrs.title')} onClose={() => setAttrOpen(false)}>
      <p className="text-text-light mb-4">{t('admin.attrs.intro')}</p>
      {rows.length === 0 && <p className="text-text-light">{t('admin.attrs.empty')}</p>}
      <ul className="space-y-4">
        {rows.map(({ path, target }) => (
          <AttrRow key={`${path}-${target.node.version}`} path={path} target={target} />
        ))}
      </ul>
    </Modal>
  );
};
