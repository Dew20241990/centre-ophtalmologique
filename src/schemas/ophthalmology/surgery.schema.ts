import { z } from 'zod';

const eyeScope = z.enum(['OD', 'OG', 'OU']);

export const preoperativeSchema = z.object({
  visualAcuityOD: z.string().optional(),
  visualAcuityOG: z.string().optional(),
  iopOD: z.string().optional(),
  iopOG: z.string().optional(),
  anteriorSegment: z.string().optional(),
  fundus: z.string().optional(),
  otherFindings: z.string().optional(),
  supplementaryExams: z.array(z.string()).optional(),
  preopWorkup: z.string().optional(),
  consent: z.string().optional(),
  requiredDocuments: z.string().optional(),
  currentTreatments: z.string().optional(),
  allergies: z.string().optional(),
  remarks: z.string().optional(),
});

export const procedureSchema = z.object({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  procedurePerformed: z.string().optional(),
  eye: eyeScope,
  surgeon: z.string().optional(),
  assistant: z.string().optional(),
  anesthesia: z.string().optional(),
  technique: z.string().optional(),
  equipmentUsed: z.string().optional(),
  intraopIncidents: z.string().optional(),
  complications: z.string().optional(),
  associatedActs: z.string().optional(),
  operativeNotes: z.string().optional(),
});

export const implantSchema = z.object({
  present: z.string().optional(),
  type: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  reference: z.string().optional(),
  lotNumber: z.string().optional(),
  power: z.string().optional(),
  placement: z.string().optional(),
  eye: eyeScope,
  material: z.string().optional(),
  notes: z.string().optional(),
});

export const postoperativeSchema = z.object({
  date: z.string().optional(),
  eye: eyeScope,
  visualAcuity: z.string().optional(),
  iop: z.string().optional(),
  pain: z.string().optional(),
  inflammation: z.string().optional(),
  anteriorSegment: z.string().optional(),
  fundus: z.string().optional(),
  implantDevice: z.string().optional(),
  healing: z.string().optional(),
  complications: z.string().optional(),
  treatment: z.string().optional(),
  instructions: z.string().optional(),
  notes: z.string().optional(),
});

export const followUpSchema = z.object({
  id: z.string(),
  date: z.string().optional(),
  delaySinceSurgery: z.string().optional(),
  visualAcuityOD: z.string().optional(),
  visualAcuityOG: z.string().optional(),
  iopOD: z.string().optional(),
  iopOG: z.string().optional(),
  clinicalExam: z.string().optional(),
  imaging: z.string().optional(),
  treatment: z.string().optional(),
  evolution: z.string().optional(),
  complication: z.string().optional(),
  nextVisit: z.string().optional(),
  notes: z.string().optional(),
});

export const surgicalReportSchema = z.object({
  indication: z.string().optional(),
  procedure: z.string().optional(),
  date: z.string().optional(),
  eye: eyeScope,
  surgeon: z.string().optional(),
  findings: z.string().optional(),
  course: z.string().optional(),
  incidentsComplications: z.string().optional(),
  implantDevice: z.string().optional(),
  postopTreatment: z.string().optional(),
  instructions: z.string().optional(),
  followUp: z.string().optional(),
  conclusion: z.string().optional(),
  notes: z.string().optional(),
});

export const surgeryStatusSchema = z.enum(['planifiee', 'realisee', 'annulee', 'suivie', 'cloturee']);

export const surgerySchema = z.object({
  id: z.string(),
  consultationId: z.string(),
  patientId: z.string(),
  procedureType: z.string(),
  eye: eyeScope,
  indication: z.string().optional(),
  associatedDiagnosis: z.string().optional(),
  functionalImpairment: z.string().optional(),
  procedureGoal: z.string().optional(),
  plannedDate: z.string().optional(),
  surgeon: z.string().optional(),
  facility: z.string().optional(),
  notes: z.string().optional(),
  status: surgeryStatusSchema,
  preoperative: preoperativeSchema,
  procedure: procedureSchema,
  implant: implantSchema,
  postoperative: postoperativeSchema,
  followUps: z.array(followUpSchema).optional(),
  report: surgicalReportSchema,
});
