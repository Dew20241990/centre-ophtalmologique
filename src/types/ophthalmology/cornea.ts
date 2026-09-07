import type { EyeScope } from '@/types';

export interface CorneaExamEntry {
  transparency: string;
  epithelium: string;
  stroma: string;
  endothelium: string;
  scar: string;
  neovascularization: string;
  infiltrate: string;
  edema: string;
  otherAnomalies: string;
  notes: string;
}

export interface TopographyEntry {
  type: 'topographie' | 'tomographie';
  mapType: string;
  axialMap: string;
  tangentialMap: string;
  elevation: string;
  pachymetryMap: string;
  indices: string;
  interpretation: string;
  conclusion: string;
  documentRef: string;
  date: string;
}

export interface KeratoconusEntry {
  eye: EyeScope;
  stage: string;
  evolution: string;
  kmax: string;
  kmin: string;
  minPachymetry: string;
  progression: string;
  priorTreatment: string;
  crossLinking: string;
  intracornealRings: string;
  graft: string;
  contactLenses: string;
  notes: string;
}

export interface CorneaHistoryEntry {
  keratoconus: string;
  dystrophy: string;
  degeneration: string;
  keratitis: string;
  ulcer: string;
  cornealSurgery: string;
  transplantation: string;
  refractiveSurgery: string;
  other: string;
  notes: string;
}

export interface CorneaData {
  history: CorneaHistoryEntry;
  exam: { OD: CorneaExamEntry; OG: CorneaExamEntry };
  topography: TopographyEntry[];
  keratoconus: KeratoconusEntry[];
}
