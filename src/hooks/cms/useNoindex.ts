import { useEffect } from 'react';
import { setNoindex } from '@/src/lib/seo/head.ts';

/** Páginas sem valor para pesquisa (área de gestão, 404): fora do índice. */
export const useNoindex = (title: string): void => {
  useEffect(() => {
    setNoindex(title);
  }, [title]);
};
