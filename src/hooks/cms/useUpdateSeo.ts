import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import type { SeoInput } from '@/src/types/cms/index.ts';
import { useAdminMutation } from './useAdminMutation.ts';

export const useUpdateSeo = () =>
  useAdminMutation(({ slug, input }: { slug: string; input: SeoInput }) => adminCmsTransporter.updateSeo(slug, input));
