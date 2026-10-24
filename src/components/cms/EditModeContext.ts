import { createContext, useContext } from 'react';
import type { AdminIndex } from '@/src/lib/cms/adminIndex.ts';
import type { Capability } from '@/src/types/auth/index.ts';

export interface Toast {
  id: number;
  type: 'success' | 'error';
  messageKey: string;
}

export interface EditModeValue {
  /** Há sessão e o modo de edição está ligado. */
  enabled: boolean;
  setWanted: (value: boolean) => void;
  /** Conteúdo de administração (inclui itens inativos); null até carregar. */
  index: AdminIndex | null;
  isLoading: boolean;
  /** Idioma em edição: o que está a ser mostrado no site. */
  locale: string;
  can: (capability: Capability, pageSlug: string) => boolean;
  notify: (type: Toast['type'], messageKey: string) => void;
  toasts: Toast[];
  registerAttr: (path: string) => void;
  getAttrPaths: () => string[];
  attrOpen: boolean;
  setAttrOpen: (open: boolean) => void;
}

const DISABLED: EditModeValue = {
  enabled: false,
  setWanted: () => undefined,
  index: null,
  isLoading: false,
  locale: 'pt',
  can: () => false,
  notify: () => undefined,
  toasts: [],
  registerAttr: () => undefined,
  getAttrPaths: () => [],
  attrOpen: false,
  setAttrOpen: () => undefined,
};

export const EditModeContext = createContext<EditModeValue>(DISABLED);

export const useEditMode = (): EditModeValue => useContext(EditModeContext);
