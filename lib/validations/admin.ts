import { z } from 'zod';

export const updateModelStatusSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
  status: z.enum(['approved', 'rejected', 'suspended', 'pending']),
  reason: z.string().optional(),
});

export const toggleClientVerificationSchema = z.object({
  clientId: z.string().uuid('Invalid client profile ID'),
  verified: z.boolean(),
});

export const resolveReportSchema = z.object({
  reportId: z.string().uuid('Invalid report ID'),
  action: z.enum(['dismiss', 'warn', 'suspend_user', 'actioned']),
  reportedUserId: z.string().uuid('Invalid user ID'),
});

export type UpdateModelStatusInput = z.infer<typeof updateModelStatusSchema>;
export type ToggleClientVerificationInput = z.infer<typeof toggleClientVerificationSchema>;
export type ResolveReportInput = z.infer<typeof resolveReportSchema>;
