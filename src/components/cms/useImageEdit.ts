import { useEditMode } from './EditModeContext.ts';

/** Devolve o item de imagem quando há sessão de edição e permissão `images` na página. */
export const useImageEdit = (path: string) => {
  const { enabled, index, can } = useEditMode();
  const target = enabled && index ? index.items[path] : undefined;
  return target?.node.kind === 'image' && can('images', target.pageSlug) ? target : undefined;
};
