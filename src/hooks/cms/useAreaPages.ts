import { useTranslation } from 'react-i18next';

export interface AreaContent {
  slug: string;
  title: string;
  summary: string;
  whatIs: string;
  signs: string[];
  help: string;
}

export const useAreaPages = (): AreaContent[] => {
  const { t } = useTranslation();
  return t('areaPages', { returnObjects: true }) as AreaContent[];
};
