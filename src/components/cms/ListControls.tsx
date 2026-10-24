import { useState, type ElementType } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog.tsx';
import { useCreateItem } from '@/src/hooks/cms/useCreateItem.ts';
import { useDeleteItem } from '@/src/hooks/cms/useDeleteItem.ts';
import { useReorderItems } from '@/src/hooks/cms/useReorderItems.ts';
import { useUpdateItem } from '@/src/hooks/cms/useUpdateItem.ts';
import { cn } from '@/src/lib/utils.ts';
import { useEditMode } from './EditModeContext.ts';

interface ControlButtonProps {
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  danger?: boolean;
  onActivate: () => void;
}

const ControlButton = ({ label, icon: Icon, disabled = false, danger = false, onActivate }: ControlButtonProps) => (
  <span
    role="button"
    tabIndex={disabled ? -1 : 0}
    aria-label={label}
    aria-disabled={disabled}
    title={label}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) onActivate();
    }}
    onKeyDown={(event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) onActivate();
    }}
    className={cn(
      'inline-flex w-6 h-6 items-center justify-center rounded-round shadow-fab cursor-pointer',
      danger ? 'bg-danger text-on-primary' : 'bg-primary-dark text-on-primary hover:bg-foreground',
      disabled && 'opacity-40 cursor-not-allowed',
    )}
  >
    <Icon className="w-3 h-3" strokeWidth={2} />
  </span>
);

interface ListItemControlsProps {
  /** Caminho da lista (`about.values`) e posição do item dentro dela. */
  listPath: string;
  index: number;
}

function Controls({ listPath, index }: ListItemControlsProps) {
  const { t } = useTranslation();
  const { index: adminIndex } = useEditMode();
  const update = useUpdateItem();
  const reorder = useReorderItems();
  const remove = useDeleteItem();
  const [confirming, setConfirming] = useState(false);
  const list = adminIndex?.lists[listPath];
  const item = list?.items[index];
  if (!list || !item) return null;

  const move = (delta: number) => {
    const ids = list.items.map((entry) => entry.id);
    const target = index + delta;
    [ids[index], ids[target]] = [ids[target] as string, ids[index] as string];
    reorder.mutate(ids);
  };

  return (
    <span className="inline-flex items-center gap-1 ml-2 align-middle">
      {!item.isActive && (
        <span className="px-2 py-0.5 rounded-control bg-foreground text-on-primary text-xs">{t('admin.list.inactive')}</span>
      )}
      <ControlButton label={t('admin.list.moveUp')} icon={ArrowUp} disabled={index === 0} onActivate={() => move(-1)} />
      <ControlButton label={t('admin.list.moveDown')} icon={ArrowDown} disabled={index === list.items.length - 1} onActivate={() => move(1)} />
      <ControlButton
        label={item.isActive ? t('admin.list.hide') : t('admin.list.show')}
        icon={item.isActive ? EyeOff : Eye}
        onActivate={() => update.mutate({ id: item.id, input: { version: item.version, isActive: !item.isActive } })}
      />
      <ControlButton label={t('admin.list.remove')} icon={Trash2} danger onActivate={() => setConfirming(true)} />
      {confirming && (
        <ConfirmDialog
          title={t('admin.list.removeTitle')}
          message={t('admin.list.removeMessage')}
          confirmLabel={t('admin.list.remove')}
          isPending={remove.isPending}
          onCancel={() => setConfirming(false)}
          onConfirm={() => remove.mutate(item.id, { onSettled: () => setConfirming(false) })}
        />
      )}
    </span>
  );
}

/** Controlos de um item de lista; sem edição não renderiza nada. */
export const ListItemControls = (props: ListItemControlsProps) => {
  const { enabled, index, can } = useEditMode();
  const list = enabled ? index?.lists[props.listPath] : undefined;
  if (!list || !can('structure', list.pageSlug)) return null;
  return <Controls {...props} />;
};

function AddControl({ listPath, as: Tag }: { listPath: string; as: ElementType }) {
  const { t } = useTranslation();
  const { index } = useEditMode();
  const create = useCreateItem();
  const list = index?.lists[listPath];
  if (!list) return null;
  return (
    <Tag className="mt-3">
      <span
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.preventDefault();
          if (!create.isPending) create.mutate({ sectionId: list.sectionId, parentId: list.parentId });
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          if (!create.isPending) create.mutate({ sectionId: list.sectionId, parentId: list.parentId });
        }}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-control bg-primary-dark text-on-primary text-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" /> {t('admin.list.add')}
      </span>
    </Tag>
  );
}

interface ListAddButtonProps {
  listPath: string;
  /** Elemento a renderizar: `li` dentro de `ul`, `div` nos restantes casos. */
  as?: ElementType;
}

export const ListAddButton = ({ listPath, as = 'div' }: ListAddButtonProps) => {
  const { enabled, index, can } = useEditMode();
  const list = enabled ? index?.lists[listPath] : undefined;
  if (!list || !can('structure', list.pageSlug)) return null;
  return <AddControl listPath={listPath} as={as} />;
};
