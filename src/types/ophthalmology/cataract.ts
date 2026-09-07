import type { EyeScope } from '@/types';

export type CataractType = 'nucleaire' | 'corticale' | 'posterieure' | 'mixte' | 'congenitale' | 'traumatique' | 'autre';
export type CataractGrade = 'incipient' | 'immature' | 'mature' | 'hypermature' | 'non_evaluee';

export interface CataractEntry {
  presence: string;
  type: string;
  localization: string;
  grade: string;
  evolution: string;
  functionalImpairment: string;
  visualImpact: string;
  notes: string;
}

export interface BiometryEntry {
  axialLength: string;
  k1: string;
  axisK1: string;
  k2: string;
  axisK2: string;
  kAvg: string;
  cornealAstigmatism: string;
  anteriorChamberDepth: string;
  whiteToWhite: string;
  date: string;
  device: string;
  notes: string;
}

export interface IOLImplantEntry {
  eye: EyeScope;
  model: string;
  manufacturer: string;
  power: string;
  type: string;
  material: string;
  placement: string;
  notes: string;
}

export interface SurgicalPlanEntry {
  indication: string;
  eye: EyeScope;
  procedure: string;
  plannedDate: string;
  surgeon: string;
  preopExams: string;
  consent: string;
  remarks: string;
}

export interface PostopEntry {
  date: string;
  eye: EyeScope;
  visualAcuity: string;
  iop: string;
  anteriorSegment: string;
  inflammation: string;
  implant: string;
  complications: string;
  treatment: string;
  evolution: string;
  notes: string;
}

export interface CataractData {
  cataract: { OD: CataractEntry; OG: CataractEntry };
  biometry: { OD: BiometryEntry; OG: BiometryEntry };
  implants: IOLImplantEntry[];
  surgicalPlan: SurgicalPlanEntry[];
  postop: PostopEntry[];
}
