import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { useCms } from '@/src/hooks/cms/useCms.ts';
import { useUpdateSeo } from '@/src/hooks/cms/useUpdateSeo.ts';
import { mediaUrl } from '@/src/lib/cms/mediaUrl.ts';
import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';
import type { PageResponse } from '@/src/types/cms/index.ts';
import { useEditMode } from './EditModeContext.ts';
import { MediaPicker } from './MediaPicker.tsx';

type Draft = Record<string, { title: string; description: string }>;

function SeoForm({ page, onClose }: { page: PageResponse; onClose: () => void }) {
  const { t } = useTranslation();
  const { config } = useCms();
  const { can } = useEditMode();
  const update = useUpdateSeo();
  const [picking, setPicking] = useState(false);
  const [draft, setDraft] = useState<Draft>(() =>
    Object.fromEntries(config.locales.map((locale) => [locale, page.seo[locale] ?? { title: '', description: '' }])),
  );
  const save = (ogImageId?: string) =>
    update.mutate(
      { slug: page.slug, input: { translations: draft, ...(ogImageId ? { ogImageId } : {}) } },
      { onSuccess: onClose },
    );
  const patch = (locale: string, field: 'title' | 'description', value: string) =>
    setDraft((current) => ({ ...current, [locale]: { ...(current[locale] as Draft[string]), [field]: value } }));

  return (
    <>
      {config.locales.map((locale) => (
        <fieldset key={locale} className="space-y-3 mb-5">
          {config.locales.length > 1 && <legend className="text-sm font-medium text-foreground mb-2">{locale.toUpperCase()}</legend>}
          <label className="block text-sm text-text-light" htmlFor={`seo-title-${locale}`}>{t('admin.seo.pageTitle')}</label>
          <input
            id={`seo-title-${locale}`}
            maxLength={255}
            value={draft[locale]?.title ?? ''}
            onChange={(event) => patch(locale, 'title', event.target.value)}
            className="w-full px-4 py-2 input bg-surface"
          />
          <label className="block text-sm text-text-light" htmlFor={`seo-description-${locale}`}>{t('admin.seo.pageDescription')}</label>
          <textarea
            id={`seo-description-${locale}`}
            maxLength={1000}
            rows={3}
            value={draft[locale]?.description ?? ''}
            onChange={(event) => patch(locale, 'description', event.target.value)}
            className="w-full px-4 py-2 input bg-surface"
          />
        </fieldset>
      ))}
      {can('images', page.slug) && (
        <div className="mb-5 flex items-center gap-3">
          {page.ogImage && <img src={mediaUrl(page.ogImage.url)} alt="" className="w-16 h-16 object-cover rounded-control" />}
          <button type="button" onClick={() => setPicking(true)} className="px-4 py-2 rounded-control border border-line text-foreground">
            {t('admin.seo.ogImage')}
          </button>
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-5 py-2 rounded-control border border-line text-foreground">
          {t('admin.common.cancel')}
        </button>
        <button type="button" disabled={update.isPending} onClick={() => save()} className="px-5 py-2 btn-primary rounded-control disabled:opacity-60">
          {t('admin.common.save')}
        </button>
      </div>
      {picking && <MediaPicker onClose={() => setPicking(false)} onSelect={(media) => save(media.id)} />}
    </>
  );
}

export const SeoPanel = ({ slug, onClose }: { slug: string; onClose: () => void }) => {
  const { t } = useTranslation();
  const page = useQuery({
    queryKey: queryKeys.cms.adminPage(slug),
    queryFn: () => adminCmsTransporter.getPage(slug),
    staleTime: Infinity,
  });
  return (
    <Modal title={t('admin.seo.title')} onClose={onClose}>
      {page.isPending && <p className="text-text-light">{t('admin.common.loading')}</p>}
      {page.isError && <p role="alert" className="text-danger">{t('admin.error.generic')}</p>}
      {page.data && <SeoForm page={page.data} onClose={onClose} />}
    </Modal>
  );
};
