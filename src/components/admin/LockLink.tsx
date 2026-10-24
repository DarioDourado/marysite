import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/hooks/auth/index.ts';

/** Acesso discreto à área de edição; desaparece quando já existe sessão. */
export const LockLink = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return null;
  return (
    <Link
      to="/admin/login"
      aria-label={t('admin.lock')}
      className="text-foreground/30 hover:text-foreground/60 transition-colors"
    >
      <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
    </Link>
  );
};
