export interface MedicalReference {
  id: string;
  label: string;
  category: string;
}

export interface MedicationReference extends MedicalReference {
  dci: string;
  laboratory: string;
  therapeuticClass: string;
  forms: string[];
}

export interface DiagnosisReference extends MedicalReference {
  icd10Code: string;
}

export interface LabTestReference extends MedicalReference {
  unit: string;
  normalRange: string;
}

export interface ImagingReference extends MedicalReference {
  modality: string;
}

export interface ProcedureReference extends MedicalReference {
  code: string;
}

export interface DeviceReference extends MedicalReference {
  manufacturer: string;
  model: string;
}

export type ReferenceType =
  | 'medication'
  | 'diagnosis'
  | 'labTest'
  | 'imaging'
  | 'procedure'
  | 'device';
