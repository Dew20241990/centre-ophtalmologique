import { z } from 'zod';

export const refractionSchema = z.object({
  sph: z.string().optional(),
  cyl: z.string().optional(),
  axis: z.string().optional(),
  add: z.string().optional(),
  prisme: z.string().optional(),
  base: z.string().optional(),
  av: z.string().optional(),
  pd: z.string().optional(),
});

export const segmentExamSchema = z.object({
  status: z.enum(['normal', 'abnormal', 'not_examined']),
  notes: z.string().optional(),
});

export const consultationSchema = z.object({
  patientId: z.string().min(1),
  reason: z.string().min(1),
  anamnesis: z.string().optional(),
  antecedents: z.string().optional(),
  allergies: z.string().optional(),
  treatments: z.string().optional(),
  constants: z.object({
    ta: z.string().optional(),
    fc: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
  }).optional(),
  visualAcuity: z.object({
    farOD: z.string().optional(),
    farODCorrected: z.string().optional(),
    farOG: z.string().optional(),
    farOGCorrected: z.string().optional(),
    nearOD: z.string().optional(),
    nearOG: z.string().optional(),
  }).optional(),
  refraction: z.object({
    OD: refractionSchema,
    OG: refractionSchema,
  }).optional(),
  keratometry: z.object({
    OD: z.object({ k1: z.string().optional(), k2: z.string().optional(), axis1: z.string().optional(), axis2: z.string().optional() }),
    OG: z.object({ k1: z.string().optional(), k2: z.string().optional(), axis1: z.string().optional(), axis2: z.string().optional() }),
  }).optional(),
  tonometry: z.object({
    OD: z.string().optional(),
    OG: z.string().optional(),
    method: z.string().optional(),
  }).optional(),
  pachymetry: z.object({
    OD: z.string().optional(),
    OG: z.string().optional(),
  }).optional(),
  primaryDiagnosis: z.string().optional(),
  associatedDiagnoses: z.string().optional(),
  treatmentPlan: z.string().optional(),
  followUpDate: z.string().optional(),
  followUpPeriod: z.string().optional(),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;
export type RefractionData = z.infer<typeof refractionSchema>;
