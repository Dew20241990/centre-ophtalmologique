import type { EyeScope } from '@/types';

export type GlaucomaType = 'angle_ouvert' | 'angle_ferme' | 'normal_tension' | 'secondaire' | 'congenital' | 'suspect' | 'autre';
export type RiskFactor = 'age' | 'familial' | 'myopie' | 'diabete' | 'hta' | 'corticoide' | 'traumatisme' | 'vasculaire' | 'autre';

export interface GoniometryEntry {
  eye: EyeScope;
  angle: string;
  pigmentation: string;
  synechiae: string;
  neovascularization: string;
  findings: string;
  notes: string;
}

export interface OpticNerveEntry {
  papilla: string;
  cupDiscRatio: string;
  asymmetry: string;
  pallor: string;
  papillaryHemorrhage: string;
  otherAnomalies: string;
  notes: string;
}

export interface OctGlaucomaEntry {
  rnfl: string;
  gcc: string;
  odAnalysis: string;
  ogAnalysis: string;
  date: string;
  device: string;
  interpretation: string;
  conclusion: string;
}

export interface VisualFieldEntry {
  eye: EyeScope;
  strategy: string;
  test: string;
  date: string;
  reliability: string;
  indices: string;
  interpretation: string;
  conclusion: string;
  documentRef: string;
}

export interface GlaucomaTreatmentEntry {
  medication: string;
  eye: EyeScope;
  concentration: string;
  posology: string;
  frequency: string;
  duration: string;
  adherence: string;
  response: string;
  sideEffects: string;
  notes: string;
}

export interface GlaucomaData {
  suspicion: string;
  familyHistory: string;
  knownGlaucoma: string;
  type: string;
  diagnosisDate: string;
  eye: EyeScope;
  riskFactors: string[];
  traumaHistory: string;
  steroidHistory: string;
  surgicalHistory: string;
  goniometry: GoniometryEntry[];
  opticNerve: { OD: OpticNerveEntry; OG: OpticNerveEntry };
  oct: OctGlaucomaEntry[];
  visualField: VisualFieldEntry[];
  treatments: GlaucomaTreatmentEntry[];
}
