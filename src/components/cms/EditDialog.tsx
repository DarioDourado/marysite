import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import type { RichMode } from './RichEditor.tsx';

// O editor (Tiptap) só é descarregado quando alguém edita
const RichEditor = lazy(() => import('./RichEditor.tsx'));

interface EditDialogProps {
  mode: RichMode;
  initialHtml: string;
  isPending: boolean;
  onSave: (html: string) => void;
  onCancel: () => void;
}

export const EditDialog = ({ mode, initialHtml, isPending, onSave, onCancel }: EditDialogProps) => {
  const { t } = useTranslation();
  const [html, setHtml] = useState(initialHtml);
  return (
    <Modal title={t('admin.edit.title')} onClose={onCancel}>
      <Suspense fallback={<p className="text-text-light">{t('admin.common.loading')}</p>}>
        <RichEditor initialHtml={initialHtml} mode={mode} onChange={setHtml} />
      </Suspense>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-control border border-line text-foreground">
          {t('admin.common.cancel')}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => onSave(html)}
          className="px-5 py-2 btn-primary rounded-control disabled:opacity-60"
        >
          {t('admin.common.save')}
        </button>
      </div>
    </Modal>
  );
};
