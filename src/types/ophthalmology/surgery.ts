import type { EyeScope } from '@/types';

export type SurgeryStatus = 'planifiee' | 'realisee' | 'annulee' | 'suivie' | 'cloturee';

export type ProcedureType =
  | 'cataracte' | 'glaucome' | 'retinienne' | 'corneenne' | 'refractive'
  | 'strabisme' | 'lacrymal' | 'laser' | 'injection_iv' | 'autre';

export interface PreoperativeEval {
  visualAcuityOD: string;
  visualAcuityOG: string;
  iopOD: string;
  iopOG: string;
  anteriorSegment: string;
  fundus: string;
  otherFindings: string;
  supplementaryExams: string[];
  preopWorkup: string;
  consent: string;
  requiredDocuments: string;
  currentTreatments: string;
  allergies: string;
  remarks: string;
}

export interface ProcedureRecord {
  date: string;
  startTime: string;
  endTime: string;
  procedurePerformed: string;
  eye: EyeScope;
  surgeon: string;
  assistant: string;
  anesthesia: string;
  technique: string;
  equipmentUsed: string;
  intraopIncidents: string;
  complications: string;
  associatedActs: string;
  operativeNotes: string;
}

export interface ImplantDevice {
  present: string;
  type: string;
  manufacturer: string;
  model: string;
  reference: string;
  lotNumber: string;
  power: string;
  placement: string;
  eye: EyeScope;
  material: string;
  notes: string;
}

export interface PostoperativeRecord {
  date: string;
  eye: EyeScope;
  visualAcuity: string;
  iop: string;
  pain: string;
  inflammation: string;
  anteriorSegment: string;
  fundus: string;
  implantDevice: string;
  healing: string;
  complications: string;
  treatment: string;
  instructions: string;
  notes: string;
}

export interface FollowUpEntry {
  id: string;
  date: string;
  delaySinceSurgery: string;
  visualAcuityOD: string;
  visualAcuityOG: string;
  iopOD: string;
  iopOG: string;
  clinicalExam: string;
  imaging: string;
  treatment: string;
  evolution: string;
  complication: string;
  nextVisit: string;
  notes: string;
}

export interface SurgicalReport {
  indication: string;
  procedure: string;
  date: string;
  eye: EyeScope;
  surgeon: string;
  findings: string;
  course: string;
  incidentsComplications: string;
  implantDevice: string;
  postopTreatment: string;
  instructions: string;
  followUp: string;
  conclusion: string;
  notes: string;
}

export interface SurgicalRecord {
  id: string;
  consultationId: string;
  patientId: string;
  procedureType: string;
  eye: EyeScope;
  indication: string;
  associatedDiagnosis: string;
  functionalImpairment: string;
  procedureGoal: string;
  plannedDate: string;
  surgeon: string;
  facility: string;
  notes: string;
  status: SurgeryStatus;
  preoperative: PreoperativeEval;
  procedure: ProcedureRecord;
  implant: ImplantDevice;
  postoperative: PostoperativeRecord;
  followUps: FollowUpEntry[];
  report: SurgicalReport;
}
