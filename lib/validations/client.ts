import { z } from 'zod';

export const bookingRequestSchema = z.object({
  date: z.string().min(1, 'Please select a booking date'),
  location: z.string().min(2, 'Please enter a location'),
  projectType: z.string().min(2, 'Please enter project type (e.g. Commercial Shoot)'),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  usageRights: z.string().min(2, 'Please specify usage rights (e.g. Digital, 1 Year)'),
  brief: z.string().min(10, 'Please provide a project brief (at least 10 characters)'),
});

export const searchFilterSchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  minHeight: z.number().optional(),
  maxHeight: z.number().optional(),
  maxRate: z.number().optional(),
  availableDate: z.string().optional(),
});

export const castingCallSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  budget: z.number().optional(),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
export type SearchFilterInput = z.infer<typeof searchFilterSchema>;
export type CastingCallInput = z.infer<typeof castingCallSchema>;
