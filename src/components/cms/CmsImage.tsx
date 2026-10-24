import type { ComponentProps } from 'react';
import { useCmsImage } from '@/src/hooks/cms/index.ts';
import { mediaUrl } from '@/src/lib/cms/mediaUrl.ts';
import { SafeImage } from '@/src/components/ui/SafeImage.tsx';
import { ImagePencil } from './ImagePencil.tsx';
import { useImageEdit } from './useImageEdit.ts';

type CmsImageProps = Omit<ComponentProps<typeof SafeImage>, 'src' | 'dataCmsPath'> & {
  path: string;
  /** Imagem original do site, usada se o CMS ainda não tiver esta. */
  fallback: string;
};

export const CmsImage = ({ path, fallback, ...props }: CmsImageProps) => {
  const image = useCmsImage(path);
  const target = useImageEdit(path);
  const src = image ? mediaUrl(image.url) : fallback;
  // key: SafeImage guarda o src em estado; trocar a imagem no CMS tem de o repor
  return (
    <>
      <SafeImage key={src} src={src} dataCmsPath={target ? path : undefined} {...props} />
      {target && <ImagePencil path={path} node={target.node} />}
    </>
  );
};
