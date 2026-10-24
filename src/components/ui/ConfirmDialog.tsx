import { useTranslation } from 'react-i18next';
import { Modal } from './Modal.tsx';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ title, message, confirmLabel, isPending = false, onConfirm, onCancel }: ConfirmDialogProps) => {
  const { t } = useTranslation();
  return (
    <Modal title={title} onClose={onCancel} className="max-w-md">
      <p className="text-text-light mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-control border border-line text-foreground">
          {t('admin.common.cancel')}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onConfirm}
          className="px-5 py-2 rounded-control bg-danger text-on-primary disabled:opacity-60"
        >
          {confirmLabel ?? t('admin.common.confirm')}
        </button>
      </div>
    </Modal>
  );
};
