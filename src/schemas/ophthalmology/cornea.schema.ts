import { z } from 'zod';

const eyeScope = z.enum(['OD', 'OG', 'OU']);

export const corneaExamSchema = z.object({
  transparency: z.string().optional(),
  epithelium: z.string().optional(),
  stroma: z.string().optional(),
  endothelium: z.string().optional(),
  scar: z.string().optional(),
  neovascularization: z.string().optional(),
  infiltrate: z.string().optional(),
  edema: z.string().optional(),
  otherAnomalies: z.string().optional(),
  notes: z.string().optional(),
});

export const topographySchema = z.object({
  type: z.enum(['topographie', 'tomographie']),
  mapType: z.string().optional(),
  axialMap: z.string().optional(),
  tangentialMap: z.string().optional(),
  elevation: z.string().optional(),
  pachymetryMap: z.string().optional(),
  indices: z.string().optional(),
  interpretation: z.string().optional(),
  conclusion: z.string().optional(),
  documentRef: z.string().optional(),
  date: z.string().optional(),
});

export const keratoconusSchema = z.object({
  eye: eyeScope,
  stage: z.string().optional(),
  evolution: z.string().optional(),
  kmax: z.string().optional(),
  kmin: z.string().optional(),
  minPachymetry: z.string().optional(),
  progression: z.string().optional(),
  priorTreatment: z.string().optional(),
  crossLinking: z.string().optional(),
  intracornealRings: z.string().optional(),
  graft: z.string().optional(),
  contactLenses: z.string().optional(),
  notes: z.string().optional(),
});

export const corneaHistorySchema = z.object({
  keratoconus: z.string().optional(),
  dystrophy: z.string().optional(),
  degeneration: z.string().optional(),
  keratitis: z.string().optional(),
  ulcer: z.string().optional(),
  cornealSurgery: z.string().optional(),
  transplantation: z.string().optional(),
  refractiveSurgery: z.string().optional(),
  other: z.string().optional(),
  notes: z.string().optional(),
});

export const corneaSchema = z.object({
  history: corneaHistorySchema,
  exam: z.object({ OD: corneaExamSchema, OG: corneaExamSchema }),
  topography: z.array(topographySchema).optional(),
  keratoconus: z.array(keratoconusSchema).optional(),
});
