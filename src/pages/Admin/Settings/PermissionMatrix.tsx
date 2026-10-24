import { useTranslation } from 'react-i18next';
import { capabilitySchema, type Capability } from '@/src/types/auth/index.ts';
import { PAGE_SLUGS, type PageSlug } from '@/src/types/cms/index.ts';

interface PermissionMatrixProps {
  capabilities: Capability[];
  pages: PageSlug[];
  onChange: (next: { capabilities: Capability[]; pages: PageSlug[] }) => void;
  /** O superuser tem sempre tudo: a matriz não se aplica. */
  disabled: boolean;
}

const toggle = <T extends string>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];

/** Tipos de edição e páginas que o utilizador pode editar. */
export const PermissionMatrix = ({ capabilities, pages, onChange, disabled }: PermissionMatrixProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <fieldset disabled={disabled} className="space-y-2">
        <legend className="text-sm font-medium text-foreground mb-2">{t('admin.settings.capabilities')}</legend>
        {capabilitySchema.options.map((capability) => (
          <label key={capability} className="flex items-center gap-2 text-foreground">
            <input
              type="checkbox"
              checked={capabilities.includes(capability)}
              onChange={() => onChange({ capabilities: toggle(capabilities, capability), pages })}
            />
            {t(`admin.settings.capability.${capability}`)}
          </label>
        ))}
      </fieldset>
      <fieldset disabled={disabled} className="space-y-2">
        <legend className="text-sm font-medium text-foreground mb-2">{t('admin.settings.pages')}</legend>
        {PAGE_SLUGS.map((slug) => (
          <label key={slug} className="flex items-center gap-2 text-foreground">
            <input
              type="checkbox"
              checked={pages.includes(slug)}
              onChange={() => onChange({ capabilities, pages: toggle(pages, slug) })}
            />
            {t(`admin.settings.page.${slug}`)}
          </label>
        ))}
      </fieldset>
      {disabled && <p className="sm:col-span-2 text-sm text-text-light">{t('admin.settings.superuserNote')}</p>}
    </div>
  );
};
