import { z } from 'zod';

export const sendMessageSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  content: z.string().min(1, 'Message content cannot be empty').max(2000, 'Message is too long'),
});

export const submitReportSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  reportedUserId: z.string().uuid('Invalid user ID'),
  reason: z.string().min(5, 'Please provide a reason for the report (at least 5 characters)'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SubmitReportInput = z.infer<typeof submitReportSchema>;
