import { useTranslation } from 'react-i18next';
import { useEditMode } from './EditModeContext.ts';

/**
 * Texto usado em atributos (placeholder, alt, aria-label, href), que não têm onde mostrar um lápis.
 * Em modo de edição regista o caminho para aparecer no painel «Textos escondidos».
 */
export const useAttrText = () => {
  const { t } = useTranslation();
  const { registerAttr } = useEditMode();
  return (path: string): string => {
    registerAttr(path);
    return t(path);
  };
};
