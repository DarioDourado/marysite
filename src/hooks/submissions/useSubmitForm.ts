import { useMutation } from '@tanstack/react-query';
import { submissionsTransporter } from '@/src/services/transporters/submissions/index.ts';
import type { SubmissionInput } from '@/src/types/submissions/index.ts';

/** Envio dos formulários públicos de marcação e contacto. */
export const useSubmitForm = () => useMutation({ mutationFn: (input: SubmissionInput) => submissionsTransporter.submit(input) });
