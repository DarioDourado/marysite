import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import { useAdminMutation } from './useAdminMutation.ts';

export const useReorderItems = () =>
  useAdminMutation((orderedIds: string[]) => adminCmsTransporter.reorder(orderedIds), 'admin.list.reordered');
