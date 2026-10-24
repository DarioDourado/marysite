import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, useLogout } from '@/src/hooks/auth/index.ts';
import { useNewSubmissionsCount } from '@/src/hooks/submissions/index.ts';
import { cn } from '@/src/lib/utils.ts';
import { useEditMode } from './EditModeContext.ts';
import { SeoPanel } from './SeoPanel.tsx';

const PATH_SLUGS: Record<string, string> = { '/': 'home', '/areas': 'areas', '/blog': 'blog' };

const buttonClass = 'px-3 py-1.5 rounded-control bg-on-primary/15 hover:bg-on-primary/25 text-sm';

/** Barra de edição: só existe com sessão. Fica à esquerda para não tapar o botão de WhatsApp. */
export const EditToolbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const edit = useEditMode();
  const logout = useLogout();
  const { pathname } = useLocation();
  const [seoOpen, setSeoOpen] = useState(false);
  const isStaff = user?.role === 'admin' || user?.role === 'superuser';
  const newSubmissions = useNewSubmissionsCount(isStaff).data ?? 0;
  if (!user) return null;
  const slug = PATH_SLUGS[pathname];

  return (
    <div
      role="region"
      aria-label={t('admin.toolbar.label')}
      className="fixed bottom-5 left-5 z-[90] max-w-[calc(100vw-7rem)] flex flex-wrap items-center gap-2 px-3 py-2 rounded-panel bg-foreground text-on-primary shadow-float"
    >
      <button
        type="button"
        role="switch"
        aria-checked={edit.enabled}
        onClick={() => edit.setWanted(!edit.enabled)}
        className={cn(buttonClass, edit.enabled && 'bg-primary-dark')}
      >
        {edit.enabled ? t('admin.toolbar.editingOn') : t('admin.toolbar.editingOff')}
      </button>
      {edit.isLoading && <span role="status" className="text-sm">{t('admin.common.loading')}</span>}
      {edit.enabled && slug && edit.can('text', slug) && (
        <button type="button" onClick={() => setSeoOpen(true)} className={buttonClass}>{t('admin.toolbar.seo')}</button>
      )}
      {edit.enabled && (
        <button type="button" onClick={() => edit.setAttrOpen(true)} className={buttonClass}>{t('admin.toolbar.hiddenTexts')}</button>
      )}
      {user.capabilities.includes('images') && <Link to="/admin/media" className={buttonClass}>{t('admin.toolbar.media')}</Link>}
      {isStaff && (
        <Link to="/admin/submissions" className={buttonClass}>
          {t('admin.toolbar.submissions')}
          {newSubmissions > 0 && <span className="ml-2 px-1.5 rounded-round bg-primary-dark text-xs">{newSubmissions}</span>}
        </Link>
      )}
      {user.role === 'superuser' && <Link to="/admin/settings" className={buttonClass}>{t('admin.toolbar.settings')}</Link>}
      <span className="text-sm opacity-80">{user.displayName}</span>
      <button
        type="button"
        disabled={logout.isPending}
        onClick={() =>
          logout.mutate(undefined, {
            onError: () => edit.notify('error', 'admin.error.logout'),
            onSettled: () => edit.setWanted(false),
          })
        }
        className={buttonClass}
      >
        {t('admin.toolbar.logout')}
      </button>
      {seoOpen && slug && <SeoPanel slug={slug} onClose={() => setSeoOpen(false)} />}
    </div>
  );
};
