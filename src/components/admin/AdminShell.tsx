import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/hooks/auth/index.ts';
import { useNoindex } from '@/src/hooks/cms/index.ts';

interface AdminShellProps {
  title: string;
  children: ReactNode;
}

/** Moldura das páginas de administração (fora do layout público). */
export const AdminShell = ({ title, children }: AdminShellProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  useNoindex(title);
  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-surface border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4">
          <Link to="/" className="text-primary-dark hover:underline">{t('admin.backToSite')}</Link>
          {user?.capabilities.includes('images') && <Link to="/admin/media" className="text-foreground hover:underline">{t('admin.toolbar.media')}</Link>}
          {user && user.role !== 'editor' && <Link to="/admin/submissions" className="text-foreground hover:underline">{t('admin.toolbar.submissions')}</Link>}
          {user?.role === 'superuser' && <Link to="/admin/settings" className="text-foreground hover:underline">{t('admin.toolbar.settings')}</Link>}
          <span className="ml-auto text-sm text-text-light">{user?.displayName}</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-normal text-foreground mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
};
