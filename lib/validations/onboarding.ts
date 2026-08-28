import { z } from 'zod';

export const step1BasicInfoSchema = z.object({
  phone: z.string().min(5, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Please enter your date of birth'),
  location: z.string().min(2, 'Please enter your location/city'),
});

export const step2PhysicalStatsSchema = z.object({
  height: z.number().min(50, 'Height is required (cm/in)').max(250),
  weight: z.number().min(20, 'Weight is required (kg/lb)').max(300),
  bust: z.number().optional().nullable(),
  waist: z.number().optional().nullable(),
  hips: z.number().optional().nullable(),
  shoeSize: z.number().min(1, 'Shoe size is required'),
  hairColor: z.string().min(2, 'Hair color is required'),
  eyeColor: z.string().min(2, 'Eye color is required'),
  ethnicity: z.string().min(2, 'Ethnicity is required'),
  tattoos: z.boolean(),
  piercings: z.boolean(),
  bio: z.string().optional().nullable(),
});

export const CATEGORY_OPTIONS = [
  'fashion',
  'commercial',
  'fitness',
  'plus-size',
  'kids',
  'runway',
  'promotional',
] as const;

export const step3CategoriesSchema = z.object({
  categories: z.array(z.string()).min(1, 'Select at least one modeling category'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
});

export const step5RatesSchema = z.object({
  hourlyRate: z.number().min(1, 'Hourly rate must be greater than 0'),
  halfDayRate: z.number().min(1, 'Half-day rate must be greater than 0'),
  fullDayRate: z.number().min(1, 'Full-day rate must be greater than 0'),
  currency: z.string(),
});

export type Step1BasicInfoInput = z.infer<typeof step1BasicInfoSchema>;
export type Step2PhysicalStatsInput = z.infer<typeof step2PhysicalStatsSchema>;
export type Step3CategoriesInput = z.infer<typeof step3CategoriesSchema>;
export type Step5RatesInput = z.infer<typeof step5RatesSchema>;
