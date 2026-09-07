import { z } from 'zod';

export const patientSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  birthDate: z.string().min(1, 'La date de naissance est requise'),
  gender: z.enum(['male', 'female']),
  phone: z.string().min(1, 'Le téléphone est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  profession: z.string().optional(),
  bloodType: z.string().optional(),
  insurance: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
