import { z } from 'zod';

const eyeScope = z.enum(['OD', 'OG', 'OU']);

export const goniometrySchema = z.object({
  eye: eyeScope,
  angle: z.string().optional(),
  pigmentation: z.string().optional(),
  synechiae: z.string().optional(),
  neovascularization: z.string().optional(),
  findings: z.string().optional(),
  notes: z.string().optional(),
});

export const opticNerveSchema = z.object({
  papilla: z.string().optional(),
  cupDiscRatio: z.string().optional(),
  asymmetry: z.string().optional(),
  pallor: z.string().optional(),
  papillaryHemorrhage: z.string().optional(),
  otherAnomalies: z.string().optional(),
  notes: z.string().optional(),
});

export const octGlaucomaSchema = z.object({
  rnfl: z.string().optional(),
  gcc: z.string().optional(),
  odAnalysis: z.string().optional(),
  ogAnalysis: z.string().optional(),
  date: z.string().optional(),
  device: z.string().optional(),
  interpretation: z.string().optional(),
  conclusion: z.string().optional(),
});

export const visualFieldSchema = z.object({
  eye: eyeScope,
  strategy: z.string().optional(),
  test: z.string().optional(),
  date: z.string().optional(),
  reliability: z.string().optional(),
  indices: z.string().optional(),
  interpretation: z.string().optional(),
  conclusion: z.string().optional(),
  documentRef: z.string().optional(),
});

export const glaucomaTreatmentSchema = z.object({
  medication: z.string().optional(),
  eye: eyeScope,
  concentration: z.string().optional(),
  posology: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  adherence: z.string().optional(),
  response: z.string().optional(),
  sideEffects: z.string().optional(),
  notes: z.string().optional(),
});

export const glaucomaSchema = z.object({
  suspicion: z.string().optional(),
  familyHistory: z.string().optional(),
  knownGlaucoma: z.string().optional(),
  type: z.string().optional(),
  diagnosisDate: z.string().optional(),
  eye: eyeScope,
  riskFactors: z.array(z.string()).optional(),
  traumaHistory: z.string().optional(),
  steroidHistory: z.string().optional(),
  surgicalHistory: z.string().optional(),
  goniometry: z.array(goniometrySchema).optional(),
  opticNerve: z.object({ OD: opticNerveSchema, OG: opticNerveSchema }),
  oct: z.array(octGlaucomaSchema).optional(),
  visualField: z.array(visualFieldSchema).optional(),
  treatments: z.array(glaucomaTreatmentSchema).optional(),
});
