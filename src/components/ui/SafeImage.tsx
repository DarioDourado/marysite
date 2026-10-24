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
  /** Abaixo da dobra: `lazy`. A imagem principal (LCP) fica em `eager` com `fetchPriority="high"`. */
  loading?: 'lazy' | 'eager' | undefined;
  fetchPriority?: 'high' | 'low' | 'auto' | undefined;
  /** Versões por largura (`url 480w, url 960w…`) e tamanho que a imagem ocupa no ecrã. */
  srcSet?: string | undefined;
  sizes?: string | undefined;
  /** Dimensões reais: reservam o espaço e dão a proporção; o tamanho visível continua a vir do CSS. */
  width?: number | undefined;
  height?: number | undefined;
}

/**
 * Image from /public/img. Falls back to `fallbackSrc`, then to an empty
 * soft-blue block when the file has not been added yet.
 */
export const SafeImage = ({ src, alt, className, fallbackSrc, style, dataCmsPath, loading, fetchPriority, srcSet, sizes, width, height }: SafeImageProps) => {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  // Se uma versão não existir, volta-se à imagem principal antes de tentar o fallback
  const [useSrcSet, setUseSrcSet] = useState(true);

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
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      srcSet={useSrcSet && current === src ? srcSet : undefined}
      sizes={useSrcSet && current === src && srcSet ? sizes : undefined}
      width={current === src ? width : undefined}
      height={current === src ? height : undefined}
      referrerPolicy="no-referrer"
      onError={() => {
        if (useSrcSet && srcSet) return setUseSrcSet(false);
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
    />
  );
};
