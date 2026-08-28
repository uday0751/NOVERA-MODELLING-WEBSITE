import { z } from 'zod';

export const createCastingCallSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Please provide a detailed description'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(2, 'Location is required'),
  date: z.string().min(1, 'Event date is required'),
  budget: z.number().positive('Budget must be greater than 0'),
});

export const applyCastingCallSchema = z.object({
  castingCallId: z.string().uuid('Invalid casting call ID'),
});

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().uuid('Invalid application ID'),
  status: z.enum(['shortlisted', 'accepted', 'rejected', 'applied']),
});

export type CreateCastingCallInput = z.infer<typeof createCastingCallSchema>;
export type ApplyCastingCallInput = z.infer<typeof applyCastingCallSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
