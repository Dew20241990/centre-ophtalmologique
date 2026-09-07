import type { EyeScope } from '@/types';

export interface MaculaEntry {
  aspect: string;
  edema: string;
  exudates: string;
  hemorrhages: string;
  drusen: string;
  epiretinalMembrane: string;
  macularHole: string;
  otherAnomalies: string;
  notes: string;
}

export interface PeripheralRetinaEntry {
  tear: string;
  detachment: string;
  degeneration: string;
  laser: string;
  hemorrhage: string;
  otherAnomalies: string;
  notes: string;
}

export interface VesselsEntry {
  caliber: string;
  tortuosity: string;
  anomalies: string;
  neovascularization: string;
  otherFindings: string;
}

export interface AngiographyEntry {
  type: 'fluoresceine' | 'ICG' | 'autre';
  eye: EyeScope;
  date: string;
  indication: string;
  results: string;
  interpretation: string;
  conclusion: string;
  documentRef: string;
}

export interface DiabeticRetinopathyEntry {
  diabetesType: string;
  duration: string;
  hba1c: string;
  treatment: string;
  knownRetinopathy: string;
  stage: string;
  priorLaser: string;
  intravitrealInjections: string;
  vitrectomy: string;
  notes: string;
}

export interface RetinaTreatmentEntry {
  type: 'anti_vegf' | 'corticoid' | 'laser' | 'chirurgie' | 'autre';
  agent: string;
  eye: EyeScope;
  date: string;
  indication: string;
  dose: string;
  notes: string;
  result: string;
}

export interface RetinaData {
  context: string;
  eye: EyeScope;
  diagnosisDate: string;
  evolution: string;
  priorTreatments: string;
  notes: string;
  macula: { OD: MaculaEntry; OG: MaculaEntry };
  peripheralRetina: { OD: PeripheralRetinaEntry; OG: PeripheralRetinaEntry };
  vessels: VesselsEntry;
  angiography: AngiographyEntry[];
  diabeticRetinopathy: DiabeticRetinopathyEntry;
  treatments: RetinaTreatmentEntry[];
}
