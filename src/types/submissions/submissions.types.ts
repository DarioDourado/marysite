import { z } from 'zod';

export const SUBMISSION_KINDS = ['booking', 'contact'] as const;
export const SUBMISSION_STATUSES = ['new', 'read', 'archived'] as const;
export const SCHEDULE_OPTIONS = ['morning', 'afternoon', 'noPreference'] as const;

export const submissionKindSchema = z.enum(SUBMISSION_KINDS);
export const submissionStatusSchema = z.enum(SUBMISSION_STATUSES);
export type SubmissionKind = z.infer<typeof submissionKindSchema>;
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;
export type ScheduleOption = (typeof SCHEDULE_OPTIONS)[number];

export const submissionSchema = z.object({
  id: z.string(),
  kind: submissionKindSchema,
  status: submissionStatusSchema,
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  subject: z.string().nullable(),
  message: z.string(),
  schedule: z.array(z.string()),
  scheduleDetails: z.string().nullable(),
  createdAt: z.string(),
  statusChangedAt: z.string().nullable(),
  handledByName: z.string().nullable(),
});
export type Submission = z.infer<typeof submissionSchema>;

export const submissionPageSchema = z.object({
  items: z.array(submissionSchema),
  nextCursor: z.string().nullable(),
  newCount: z.number(),
});
export type SubmissionPage = z.infer<typeof submissionPageSchema>;

export interface SubmissionFilters {
  kind: SubmissionKind | '';
  status: SubmissionStatus | '';
  q: string;
}

/** Pedido enviado pelos formulários públicos. `website` é a armadilha anti-robôs: tem de seguir vazio. */
export type SubmissionInput =
  | { kind: 'booking'; name: string; email: string; phone: string; message: string; schedule: ScheduleOption[]; scheduleDetails: string; website: string }
  | { kind: 'contact'; name: string; email: string; subject: string; message: string; website: string };
