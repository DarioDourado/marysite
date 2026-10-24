import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUpdateItem } from '@/src/hooks/cms/useUpdateItem.ts';
import type { ItemNode } from '@/src/types/cms/index.ts';
import { MediaPicker } from './MediaPicker.tsx';

interface Rect {
  top: number;
  left: number;
  visible: boolean;
}

const HEADER_OFFSET = 56;

// O lápis fica numa camada própria sobre a imagem: não altera o DOM nem o layout do site
export const ImagePencil = ({ path, node }: { path: string; node: ItemNode }) => {
  const { t } = useTranslation();
  const [rect, setRect] = useState<Rect | null>(null);
  const [picking, setPicking] = useState(false);
  const update = useUpdateItem();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const element = document.querySelector(`[data-cms-path="${path}"]`);
      if (!element) return setRect(null);
      const box = element.getBoundingClientRect();
      const visible = box.bottom > HEADER_OFFSET && box.top < window.innerHeight && box.width > 0;
      // Imagens maiores que o ecrã (hero com zoom): o botão fica sempre dentro da área visível
      const top = Math.min(Math.max(box.top, HEADER_OFFSET) + 8, box.bottom - 40, window.innerHeight - 48);
      const left = Math.min(Math.max(8, box.right - 40), window.innerWidth - 48);
      setRect({ top, left, visible });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [path]);

  return (
    <>
      {rect?.visible &&
        createPortal(
          <button
            type="button"
            aria-label={t('admin.edit.changeImage')}
            title={t('admin.edit.changeImage')}
            onClick={() => setPicking(true)}
            style={{ position: 'fixed', top: rect.top, left: rect.left }}
            className="z-[90] w-8 h-8 rounded-round bg-primary-dark text-on-primary shadow-fab flex items-center justify-center hover:bg-foreground"
          >
            <Pencil className="w-4 h-4" strokeWidth={2} />
          </button>,
          document.body,
        )}
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onSelect={(media) =>
            update.mutate(
              { id: node.id, input: { version: node.version, imageId: media.id } },
              { onSuccess: () => setPicking(false) },
            )
          }
        />
      )}
    </>
  );
};
