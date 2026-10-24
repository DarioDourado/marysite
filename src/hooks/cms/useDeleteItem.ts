import { adminCmsTransporter } from '@/src/services/transporters/cms/adminCmsTransporter.ts';
import { useAdminMutation } from './useAdminMutation.ts';

export const useDeleteItem = () =>
  useAdminMutation((id: string) => adminCmsTransporter.deleteItem(id), 'admin.list.removed');
