import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  revieweeId: z.string().uuid('Invalid reviewee ID'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(5, 'Comment must be at least 5 characters long').max(1000, 'Comment is too long'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
