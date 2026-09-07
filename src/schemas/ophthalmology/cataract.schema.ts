import { z } from 'zod';

const eyeScope = z.enum(['OD', 'OG', 'OU']);

export const cataractEntrySchema = z.object({
  presence: z.string().optional(),
  type: z.string().optional(),
  localization: z.string().optional(),
  grade: z.string().optional(),
  evolution: z.string().optional(),
  functionalImpairment: z.string().optional(),
  visualImpact: z.string().optional(),
  notes: z.string().optional(),
});

export const biometrySchema = z.object({
  axialLength: z.string().optional(),
  k1: z.string().optional(),
  axisK1: z.string().optional(),
  k2: z.string().optional(),
  axisK2: z.string().optional(),
  kAvg: z.string().optional(),
  cornealAstigmatism: z.string().optional(),
  anteriorChamberDepth: z.string().optional(),
  whiteToWhite: z.string().optional(),
  date: z.string().optional(),
  device: z.string().optional(),
  notes: z.string().optional(),
});

export const iolImplantSchema = z.object({
  eye: eyeScope,
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  power: z.string().optional(),
  type: z.string().optional(),
  material: z.string().optional(),
  placement: z.string().optional(),
  notes: z.string().optional(),
});

export const surgicalPlanSchema = z.object({
  indication: z.string().optional(),
  eye: eyeScope,
  procedure: z.string().optional(),
  plannedDate: z.string().optional(),
  surgeon: z.string().optional(),
  preopExams: z.string().optional(),
  consent: z.string().optional(),
  remarks: z.string().optional(),
});

export const postopSchema = z.object({
  date: z.string().optional(),
  eye: eyeScope,
  visualAcuity: z.string().optional(),
  iop: z.string().optional(),
  anteriorSegment: z.string().optional(),
  inflammation: z.string().optional(),
  implant: z.string().optional(),
  complications: z.string().optional(),
  treatment: z.string().optional(),
  evolution: z.string().optional(),
  notes: z.string().optional(),
});

export const cataractSchema = z.object({
  cataract: z.object({ OD: cataractEntrySchema, OG: cataractEntrySchema }),
  biometry: z.object({ OD: biometrySchema, OG: biometrySchema }),
  implants: z.array(iolImplantSchema).optional(),
  surgicalPlan: z.array(surgicalPlanSchema).optional(),
  postop: z.array(postopSchema).optional(),
});
