import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/hooks/auth/index.ts';
import { useCms } from '@/src/hooks/cms/useCms.ts';
import { applyContent } from '@/src/lib/cms/applyContent.ts';
import { buildAdminIndex } from '@/src/lib/cms/adminIndex.ts';
import { CmsContext, type CmsContextValue } from '@/src/lib/cms/CmsContext.ts';
import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';
import type { PageResponse } from '@/src/types/cms/index.ts';
import { EditModeContext, type EditModeValue, type Toast } from './EditModeContext.ts';
import { Toasts } from './Toasts.tsx';

const STORAGE_KEY = 'cms:edit';
const TOAST_MS = 4000;

const readWanted = (): boolean => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const base = useCms();
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [wanted, setWantedState] = useState(readWanted);
  const [override, setOverride] = useState<CmsContextValue | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [attrOpen, setAttrOpen] = useState(false);
  const attrPaths = useRef(new Set<string>());
  const toastId = useRef(0);
  const adminApplied = useRef(false);

  const enabled = wanted && user !== null;
  const slugs = user?.pages ?? [];
  const queries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: queryKeys.cms.adminPage(slug),
      queryFn: () => adminCmsTransporter.getPage(slug),
      enabled,
      staleTime: 0,
    })),
  });

  const stamp = queries.map((q) => q.dataUpdatedAt).join('-');
  const adminPages = useMemo<PageResponse[] | null>(() => {
    const loaded = queries.map((q) => q.data);
    return enabled && loaded.length > 0 && loaded.every(Boolean) ? (loaded as PageResponse[]) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, stamp]);
  const index = useMemo(() => (adminPages ? buildAdminIndex(adminPages) : null), [adminPages]);

  // Em modo de edição o site mostra o conteúdo de administração (com itens inativos)
  useEffect(() => {
    if (adminPages) {
      const merged = { ...base.pages, ...Object.fromEntries(adminPages.map((p) => [p.slug, p])) };
      setOverride(applyContent({ config: base.config, pages: merged }));
      adminApplied.current = true;
    } else if (adminApplied.current) {
      adminApplied.current = false;
      setOverride(null);
      applyContent({ config: base.config, pages: base.pages });
    }
  }, [adminPages, base]);

  // Ao sair, o site público volta a carregar o que foi editado
  const wasEnabled = useRef(false);
  useEffect(() => {
    if (wasEnabled.current && !enabled) void queryClient.invalidateQueries({ queryKey: queryKeys.cms.public });
    wasEnabled.current = enabled;
  }, [enabled, queryClient]);

  const setWanted = useCallback((value: boolean) => {
    setWantedState(value);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // sem armazenamento: o modo só não persiste entre recarregamentos
    }
  }, []);

  const notify = useCallback((type: Toast['type'], messageKey: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, type, messageKey }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), TOAST_MS);
  }, []);

  const language = (i18n.resolvedLanguage ?? base.config.defaultLang).split('-')[0] ?? base.config.defaultLang;
  const locale = base.config.locales.includes(language) ? language : base.config.defaultLang;

  const value = useMemo<EditModeValue>(
    () => ({
      enabled,
      setWanted,
      index,
      isLoading: enabled && !index,
      locale,
      can: (capability, pageSlug) =>
        user !== null && user.capabilities.includes(capability) && user.pages.includes(pageSlug),
      notify,
      toasts,
      registerAttr: (path) => void attrPaths.current.add(path),
      getAttrPaths: () => Array.from(attrPaths.current).sort(),
      attrOpen,
      setAttrOpen,
    }),
    [enabled, setWanted, index, locale, user, notify, toasts, attrOpen],
  );

  return (
    <EditModeContext.Provider value={value}>
      <CmsContext.Provider value={override ?? base}>{children}</CmsContext.Provider>
      <Toasts />
    </EditModeContext.Provider>
  );
};
