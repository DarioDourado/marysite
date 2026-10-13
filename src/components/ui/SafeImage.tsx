import { useState } from 'react';
import { cn } from '@/src/lib/utils.ts';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
}

/**
 * Image from /public/img. Falls back to `fallbackSrc`, then to an empty
 * soft-blue block when the file has not been added yet.
 */
export const SafeImage = ({ src, alt, className, fallbackSrc, style }: SafeImageProps) => {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div role="img" aria-label={alt} className={cn('bg-primary/60', className)} style={style} />;
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
    />
  );
};
