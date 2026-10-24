import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import type { ItemPatchInput } from '@/src/types/cms/index.ts';
import { useAdminMutation } from './useAdminMutation.ts';

export const useUpdateItem = () =>
  useAdminMutation(({ id, input }: { id: string; input: ItemPatchInput }) => adminCmsTransporter.patchItem(id, input));
