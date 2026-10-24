import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import { useAdminMutation } from './useAdminMutation.ts';

export const useCreateItem = () =>
  useAdminMutation(
    ({ sectionId, parentId }: { sectionId: string; parentId: string | null }) =>
      adminCmsTransporter.createItem(sectionId, parentId),
    'admin.list.added',
  );
