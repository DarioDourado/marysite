import type { ImageRef } from '@/src/types/cms/index.ts';
import { useCms } from './useCms.ts';

export const useCmsImage = (path: string): ImageRef | undefined => useCms().images[path];
