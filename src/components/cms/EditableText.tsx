import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useCms } from '@/src/hooks/cms/useCms.ts';
import { useUpdateItem } from '@/src/hooks/cms/useUpdateItem.ts';
import type { IndexedItem } from '@/src/lib/cms/adminIndex.ts';
import { EditDialog } from './EditDialog.tsx';
import { useEditMode } from './EditModeContext.ts';
import { InlineField } from './InlineField.tsx';
import { PencilButton } from './PencilButton.tsx';

interface EditableTextProps {
  target: IndexedItem;
  children: ReactNode;
}

export const EditableText = ({ target, children }: EditableTextProps) => {
  const { t } = useTranslation();
  const { config } = useCms();
  const { locale } = useEditMode();
  const update = useUpdateItem();
  const [editing, setEditing] = useState(false);
  const { node } = target;
  const usesDialog = node.kind === 'inline' || node.kind === 'richtext';
  // Sem tradução no idioma em edição, parte-se do texto no idioma por omissão
  const initial = node.value?.[locale] ?? node.value?.[config.defaultLang] ?? '';

  const save = (value: string) =>
    update.mutate({ id: node.id, input: { version: node.version, locale, value } }, { onSuccess: () => setEditing(false) });

  if (editing && !usesDialog) {
    return <InlineField initial={initial} isPending={update.isPending} onSave={save} onCancel={() => setEditing(false)} />;
  }
  return (
    <span className="rounded-sm outline outline-1 outline-dashed outline-primary-dark/50">
      {children}
      <PencilButton label={t('admin.edit.pencil')} onActivate={() => setEditing(true)} />
      {editing && (
        <EditDialog
          mode={node.kind === 'richtext' ? 'block' : 'inline'}
          initialHtml={initial}
          isPending={update.isPending}
          onSave={save}
          onCancel={() => setEditing(false)}
        />
      )}
    </span>
  );
};
