import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoginForm } from './useLoginForm.ts';

export const Login = () => {
  const { t } = useTranslation();
  const { form, onSubmit, isPending, errorKey } = useLoginForm();
  const { register, formState } = form;

  return (
    <main className="min-h-screen bg-muted flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full max-w-sm bg-surface rounded-panel p-8 shadow-panel border border-border space-y-6"
      >
        <h1 className="text-3xl font-serif font-normal text-foreground">{t('admin.login.title')}</h1>

        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium text-foreground">
            {t('admin.login.email')}
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            aria-invalid={formState.errors.email ? true : undefined}
            aria-describedby={formState.errors.email ? 'login-email-error' : undefined}
            className="w-full px-5 py-4 bg-surface input"
            {...register('email')}
          />
          {formState.errors.email?.message && (
            <p id="login-email-error" className="text-sm text-danger">
              {t(formState.errors.email.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">
            {t('admin.login.password')}
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={formState.errors.password ? true : undefined}
            aria-describedby={formState.errors.password ? 'login-password-error' : undefined}
            className="w-full px-5 py-4 bg-surface input"
            {...register('password')}
          />
          {formState.errors.password?.message && (
            <p id="login-password-error" className="text-sm text-danger">
              {t(formState.errors.password.message)}
            </p>
          )}
        </div>

        {errorKey && (
          <p role="alert" className="text-sm text-danger">
            {t(errorKey)}
          </p>
        )}

        <button type="submit" disabled={isPending} className="w-full py-4 btn-primary rounded-control font-serif text-lg">
          {isPending ? t('admin.login.pending') : t('admin.login.submit')}
        </button>

        <Link to="/" className="block text-center text-sm text-primary-dark hover:underline">
          {t('admin.backToSite')}
        </Link>
      </form>
    </main>
  );
};
