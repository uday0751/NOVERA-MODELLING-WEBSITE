import { z } from 'zod';

export const checkoutSessionSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
});

export const completeBookingSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
});

export const adminRefundSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  reason: z.string().optional(),
});

export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;
export type CompleteBookingInput = z.infer<typeof completeBookingSchema>;
export type AdminRefundInput = z.infer<typeof adminRefundSchema>;
