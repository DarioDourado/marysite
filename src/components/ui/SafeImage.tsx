import { useState } from 'react';
import { cn } from '@/src/lib/utils.ts';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  /** Marca a imagem para o modo de edição do CMS (só presente com sessão de edição). */
  dataCmsPath?: string | undefined;
}

/**
 * Image from /public/img. Falls back to `fallbackSrc`, then to an empty
 * soft-blue block when the file has not been added yet.
 */
export const SafeImage = ({ src, alt, className, fallbackSrc, style, dataCmsPath }: SafeImageProps) => {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div role="img" aria-label={alt} className={cn('bg-primary/60', className)} style={style} data-cms-path={dataCmsPath} />;
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      style={style}
      data-cms-path={dataCmsPath}
      referrerPolicy="no-referrer"
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
    />
  );
};
