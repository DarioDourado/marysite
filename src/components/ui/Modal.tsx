import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/src/hooks/common/index.ts';
import { cn } from '@/src/lib/utils.ts';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/** Diálogo modal acessível: foco preso, Escape fecha, rótulo ligado ao título. */
export const Modal = ({ title, onClose, children, className }: ModalProps) => {
  const titleId = useId();
  const ref = useFocusTrap<HTMLDivElement>(true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn('bg-surface rounded-panel shadow-float w-full max-w-2xl max-h-[90vh] overflow-auto p-6', className)}
      >
        <h2 id={titleId} className="text-2xl font-serif font-normal text-foreground mb-4">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  );
};
