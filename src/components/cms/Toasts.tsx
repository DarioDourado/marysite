import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils.ts';
import { useEditMode } from './EditModeContext.ts';

export const Toasts = () => {
  const { t } = useTranslation();
  const { toasts } = useEditMode();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-16 right-4 z-[110] flex flex-col gap-2">
      {toasts.map((toast) => (
        <p
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={cn(
            'px-4 py-3 rounded-control shadow-float text-sm text-on-primary',
            toast.type === 'error' ? 'bg-danger' : 'bg-primary-dark',
          )}
        >
          {t(toast.messageKey)}
        </p>
      ))}
    </div>
  );
};
