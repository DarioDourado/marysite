import { useContext } from 'react';
import { CmsContext, type CmsContextValue } from '@/src/lib/cms/CmsContext.ts';

export const useCms = (): CmsContextValue => {
  const value = useContext(CmsContext);
  if (!value) throw new Error('useCms must be used inside CmsProvider');
  return value;
};
