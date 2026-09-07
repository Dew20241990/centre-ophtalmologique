import { z } from 'zod';

const eyeScope = z.enum(['OD', 'OG', 'OU']);

export const maculaSchema = z.object({
  aspect: z.string().optional(),
  edema: z.string().optional(),
  exudates: z.string().optional(),
  hemorrhages: z.string().optional(),
  drusen: z.string().optional(),
  epiretinalMembrane: z.string().optional(),
  macularHole: z.string().optional(),
  otherAnomalies: z.string().optional(),
  notes: z.string().optional(),
});

export const peripheralRetinaSchema = z.object({
  tear: z.string().optional(),
  detachment: z.string().optional(),
  degeneration: z.string().optional(),
  laser: z.string().optional(),
  hemorrhage: z.string().optional(),
  otherAnomalies: z.string().optional(),
  notes: z.string().optional(),
});

export const vesselsSchema = z.object({
  caliber: z.string().optional(),
  tortuosity: z.string().optional(),
  anomalies: z.string().optional(),
  neovascularization: z.string().optional(),
  otherFindings: z.string().optional(),
});

export const angiographySchema = z.object({
  type: z.enum(['fluoresceine', 'ICG', 'autre']),
  eye: eyeScope,
  date: z.string().optional(),
  indication: z.string().optional(),
  results: z.string().optional(),
  interpretation: z.string().optional(),
  conclusion: z.string().optional(),
  documentRef: z.string().optional(),
});

export const diabeticRetinopathySchema = z.object({
  diabetesType: z.string().optional(),
  duration: z.string().optional(),
  hba1c: z.string().optional(),
  treatment: z.string().optional(),
  knownRetinopathy: z.string().optional(),
  stage: z.string().optional(),
  priorLaser: z.string().optional(),
  intravitrealInjections: z.string().optional(),
  vitrectomy: z.string().optional(),
  notes: z.string().optional(),
});

export const retinaTreatmentSchema = z.object({
  type: z.enum(['anti_vegf', 'corticoid', 'laser', 'chirurgie', 'autre']),
  agent: z.string().optional(),
  eye: eyeScope,
  date: z.string().optional(),
  indication: z.string().optional(),
  dose: z.string().optional(),
  notes: z.string().optional(),
  result: z.string().optional(),
});

export const retinaSchema = z.object({
  context: z.string().optional(),
  eye: eyeScope,
  diagnosisDate: z.string().optional(),
  evolution: z.string().optional(),
  priorTreatments: z.string().optional(),
  notes: z.string().optional(),
  macula: z.object({ OD: maculaSchema, OG: maculaSchema }),
  peripheralRetina: z.object({ OD: peripheralRetinaSchema, OG: peripheralRetinaSchema }),
  vessels: vesselsSchema,
  angiography: z.array(angiographySchema).optional(),
  diabeticRetinopathy: diabeticRetinopathySchema,
  treatments: z.array(retinaTreatmentSchema).optional(),
});
