// Core data models for the ophthalmology clinic management system
// Designed to be compatible with a future MySQL relational backend

export type Gender = 'male' | 'female';
export type EyeSide = 'OD' | 'OG';
export type EyeScope = 'OD' | 'OG' | 'OU';
export type AppointmentStatus = 'pending' | 'confirmed' | 'consulted' | 'cancelled' | 'absent';
export type WaitingStatus = 'waiting' | 'in_consultation' | 'completed' | 'absent';
export type PaymentMethod = 'cash' | 'card' | 'other';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';
export type ExamStatus = 'normal' | 'abnormal' | 'not_examined';
export type UserRole = 'doctor' | 'secretary' | 'admin';
export type DocumentType = 'prescription' | 'medical_report' | 'exam_report' | 'imaging' | 'certificate' | 'administrative';

// ── Patient ──────────────────────────────────────────────────────────────────

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  bloodType?: string;
  insurance?: string;
  profession?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastVisit?: string;
  lastDiagnosis?: string;
  referringDoctor?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

// ── Allergies ─────────────────────────────────────────────────────────────────

export type AllergyType = 'médicament' | 'aliment' | 'environnement' | 'autre';
export type AllergySeverity = 'légère' | 'modérée' | 'sévère' | 'inconnue';

export interface Allergy {
  id: string;
  patientId: string;
  substance: string;
  type: AllergyType;
  reaction: string;
  severity: AllergySeverity;
  notes?: string;
}

// ── Current treatments ───────────────────────────────────────────────────────

export type TreatmentType = 'systémique' | 'ophtalmique';

export interface CurrentTreatment {
  id: string;
  patientId: string;
  medication: string;
  type: TreatmentType;
  eye?: EyeScope;
  posology: string;
  frequency: string;
  route: string;
  startDate?: string;
  endDate?: string;
  indication?: string;
  prescriber?: string;
  notes?: string;
}

// ── Medical history (structured) ──────────────────────────────────────────────

export interface DiabetesDetail {
  type: 'Type 1' | 'Type 2' | 'Gestationnel' | 'Indéterminé';
  duration?: string;
  treatment?: string;
  hba1c?: string;
  glycemia?: string;
  knownRetinopathy?: boolean;
  laser?: boolean;
  intravitrealInjections?: boolean;
  vitrectomy?: boolean;
  notes?: string;
}

export interface MedicalHistoryEntry {
  id: string;
  patientId: string;
  category: 'diabete' | 'hypertension' | 'dyslipidemie' | 'cardiovasculaire' | 'thyroide' | 'renale' | 'neurologique' | 'auto_immune' | 'respiratoire' | 'oncologie' | 'autre';
  label: string;
  present: boolean;
  details?: string;
  diabetesDetail?: DiabetesDetail;
}

// ── Ophthalmological history ─────────────────────────────────────────────────

export type OphthoConditionKey =
  | 'glaucome' | 'cataracte' | 'retinienne' | 'corneenne' | 'keratocone'
  | 'uveite' | 'secheresse' | 'retinopathie_diabetique' | 'maculopathie'
  | 'neuropathie_optique' | 'amblyopie' | 'strabisme' | 'troubles_refractifs' | 'autre';

export interface OphthalmologicalHistoryEntry {
  id: string;
  patientId: string;
  condition: OphthoConditionKey;
  label: string;
  eye: EyeScope;
  diagnosedDate?: string;
  notes?: string;
}

// ── Surgical history ─────────────────────────────────────────────────────────

export type SurgicalType =
  | 'cataracte' | 'glaucome' | 'retine_vitrectomie' | 'decollement_retine'
  | 'cornee_keratoplastie' | 'lasik_prk_smile' | 'strabisme' | 'laser'
  | 'injection_intravitreenne' | 'autre';

export interface SurgicalRecord {
  id: string;
  patientId: string;
  type: SurgicalType;
  intervention: string;
  eye: EyeScope;
  date?: string;
  surgeon?: string;
  facility?: string;
  indication?: string;
  implant?: string;
  result?: string;
  complications?: string;
  postopTreatment?: string;
  notes?: string;
}

// ── Clinical timeline ────────────────────────────────────────────────────────

export type TimelineType =
  | 'consultation' | 'examen' | 'diagnostic' | 'prescription'
  | 'imagerie' | 'laboratoire' | 'intervention' | 'traitement'
  | 'suivi' | 'document';

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  type: TimelineType;
  title: string;
  description: string;
  doctor?: string;
}

// ── Existing interfaces (preserved) ───────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  active: boolean;
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  permissions: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow_up' | 'examination' | 'procedure' | 'emergency';
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface VisualAcuity {
  farWithoutCorrection: string;
  farWithCorrection: string;
  nearWithoutCorrection: string;
  nearWithCorrection: string;
}

export interface Refraction {
  sph: string;
  cyl: string;
  axis: string;
  add: string;
  correctedVA: string;
}

export interface Tonometry {
  pressure: string;
  method: 'goldmann' | 'non_contact' | 'other';
}

export interface SegmentExam {
  status: ExamStatus;
  notes?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  reason: string;
  visualAcuity: {
    OD: VisualAcuity;
    OG: VisualAcuity;
  };
  refraction: {
    OD: Refraction;
    OG: Refraction;
  };
  tonometry: {
    OD: Tonometry;
    OG: Tonometry;
  };
  anteriorSegment: {
    eyelids: SegmentExam;
    conjunctiva: SegmentExam;
    cornea: SegmentExam;
    anteriorChamber: SegmentExam;
    iris: SegmentExam;
    pupil: SegmentExam;
    lens: SegmentExam;
  };
  posteriorSegment: {
    vitreous: SegmentExam;
    opticDisc: SegmentExam;
    macula: SegmentExam;
    retina: SegmentExam;
    vessels: SegmentExam;
  };
  primaryDiagnosis: string;
  associatedDiagnoses: string[];
  clinicalNotes: string;
  treatmentPlan: string;
  followUpDate?: string;
  followUpPeriod?: string;
}

export interface Medication {
  id: string;
  commercialName: string;
  dci: string;
  dosage: string;
  form: string;
  laboratory: string;
  therapeuticClass: string;
  active: boolean;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dci?: string;
  dosage: string;
  form: string;
  posology: string;
  frequency: string;
  duration: string;
  route: string;
  instructions?: string;
  isFreeText: boolean;
}

export interface Prescription {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  items: PrescriptionItem[];
  notes?: string;
}

export interface Examination {
  id: string;
  patientId: string;
  patientName: string;
  type: 'OCT' | 'retinography' | 'visual_field' | 'corneal_topography' | 'biometry' | 'pachymetry' | 'ultrasound' | 'angiography' | 'other';
  eye: EyeSide | 'both';
  date: string;
  result: string;
  doctorId: string;
  doctorName: string;
  notes?: string;
  attachments?: string[];
}

export interface MedicalImage {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  eye: EyeSide;
  date: string;
  url: string;
  notes?: string;
  examinationId?: string;
}

export interface MedicalHistory {
  medicalHistory: string;
  surgicalHistory: string;
  familyHistory: string;
  allergies: string;
  currentMedications: string;
  chronicConditions: string;
  previousOphthalmologicalHistory: string;
}

export interface ClinicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  type: DocumentType;
  title: string;
  date: string;
  size?: string;
  uploadedBy: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  items: InvoiceItem[];
  total: number;
  paid: number;
  remaining: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'waiting' | 'payment' | 'follow_up' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  patient?: string;
  date: string;
  time: string;
  ip: string;
  description: string;
}

// ── Examination domain types (Phase 3) ──────────────────────────────────────

export type VANotation = 'decimale' | 'snellen' | 'logmar';

export interface VisualAcuityEntry {
  farWithoutCorrection: string;
  farWithCorrection: string;
  nearWithoutCorrection: string;
  nearWithCorrection: string;
  pinhole: string;
  notation: VANotation;
  notes?: string;
}

export type RefractionKind = 'auto' | 'subjective' | 'finale';

export interface RefractionEntry {
  kind: RefractionKind;
  sph: string;
  cyl: string;
  axis: string;
  add: string;
  prisme: string;
  base: string;
  obtainedVA: string;
  pd: string;
  pdMonoOD: string;
  pdMonoOG: string;
  pdNear: string;
  vertexDistance: string;
  notes?: string;
}

export interface KeratometryEntry {
  k1: string;
  axis1: string;
  k2: string;
  axis2: string;
  kAvg: string;
  astigmatism: string;
  notes?: string;
}

export type TonometryMethod = 'goldmann' | 'non_contact' | 'icare' | 'autre';

export interface TonometryEntry {
  iop: string;
  method: TonometryMethod;
  time: string;
  device: string;
  correctedValue: string;
  notes?: string;
}

export interface PachymetryEntry {
  cct: string;
  device: string;
  date: string;
  notes?: string;
}

export interface PupilsEntry {
  sizeOD: string;
  sizeOG: string;
  shape: string;
  reactivity: string;
  directReflex: string;
  consensualReflex: string;
  rapd: string;
  notes?: string;
}

export interface OcularMotilityEntry {
  motility: string;
  diplopia: string;
  coverTest: string;
  alignment: string;
  strabismus: string;
  vergences: string;
  notes?: string;
}

export interface AnteriorSegmentEntry {
  eyelids: SegmentExam;
  conjunctiva: SegmentExam;
  cornea: SegmentExam;
  tearFilm: SegmentExam;
  anteriorChamber: SegmentExam;
  iris: SegmentExam;
  lens: SegmentExam;
  other?: string;
}

export interface FundusEntry {
  vitreous: SegmentExam;
  opticDisc: SegmentExam;
  cdRatio: string;
  papilledema: string;
  pallor: string;
  excavation: string;
  neovascularization: string;
  macula: SegmentExam;
  retina: SegmentExam;
  vessels: SegmentExam;
  peripheralRetina: SegmentExam;
  notes?: string;
}

export type DiagnosisEye = EyeScope;

export interface DiagnosisEntry {
  primary: string;
  secondary: string[];
  eye: DiagnosisEye;
  icd10: string;
  notes?: string;
}

export type TreatmentActionType = 'medicament' | 'procedure' | 'laser' | 'injection' | 'chirurgie' | 'orientation';

export interface TreatmentEntry {
  medication: string;
  type: TreatmentType;
  eye: EyeScope;
  posology: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
  recommendations: string;
  actionType: TreatmentActionType;
  notes?: string;
}

export type GlassesType = 'loin' | 'pres' | 'intermediaire' | 'progressive' | 'bifocale' | 'anti_fatigue' | 'autre';

export interface GlassesPrescriptionEntry {
  type: GlassesType;
  sphOD: string;
  cylOD: string;
  axisOD: string;
  addOD: string;
  prismeOD: string;
  baseOD: string;
  sphOG: string;
  cylOG: string;
  axisOG: string;
  addOG: string;
  prismeOG: string;
  baseOG: string;
  pd: string;
  pdMonoOD: string;
  pdMonoOG: string;
  height: string;
  lensType: string;
  material: string;
  index: string;
  design: string;
  treatments: string;
  notes?: string;
}

export type ContactLensType = 'spherique' | 'torique' | 'multifocale' | 'rgp' | 'autre';

export interface ContactLensEntry {
  type: ContactLensType;
  manufacturer: string;
  brand: string;
  lensType: string;
  bc: string;
  dia: string;
  power: string;
  cyl: string;
  axis: string;
  add: string;
  material: string;
  replacement: string;
  wearMode: string;
  eye: EyeScope;
  trialLens: string;
  overRefraction: string;
  movement: string;
  centration: string;
  comfort: string;
  tearFilm: string;
  wearingTime: string;
  finalLens: string;
  followUp: string;
  notes?: string;
}

// ── Prescription domain types (Phase 4) ──────────────────────────────────────

export type PrescriptionStatus = 'brouillon' | 'validee' | 'imprimee';

export interface GlassesPrescriptionEye {
  sph: string;
  cyl: string;
  axis: string;
  add: string;
  prisme: string;
  base: string;
  va: string;
}

export interface GlassesPrescription {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  type: GlassesType;
  OD: GlassesPrescriptionEye;
  OG: GlassesPrescriptionEye;
  pd: string;
  pdMonoOD: string;
  pdMonoOG: string;
  pdNear: string;
  heightOD: string;
  heightOG: string;
  lensType: string;
  material: string;
  index: string;
  design: string;
  treatments: string;
  options: string;
  notes?: string;
  status: PrescriptionStatus;
  sourceRefractionId?: string;
}

export interface ContactLensEye {
  manufacturer: string;
  brand: string;
  lensType: string;
  bc: string;
  dia: string;
  power: string;
  cyl: string;
  axis: string;
  add: string;
  material: string;
  replacement: string;
  wearMode: string;
}

export interface ContactLensPrescription {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  type: ContactLensType;
  OD: ContactLensEye;
  OG: ContactLensEye;
  trialLens: string;
  overRefraction: string;
  movement: string;
  centration: string;
  comfort: string;
  tearFilm: string;
  wearingTime: string;
  finalLens: string;
  followUp: string;
  notes?: string;
  status: PrescriptionStatus;
  sourceRefractionId?: string;
}

export interface PrescriptionHistoryEntry {
  id: string;
  prescriptionId: string;
  patientId: string;
  date: string;
  type: 'lunettes' | 'lentilles' | 'medicaments';
  subType: string;
  OD: string;
  OG: string;
  add: string;
  pd: string;
  doctor: string;
  notes?: string;
  status: PrescriptionStatus;
}

// ── Phase 5 — Imaging, Exams & Documents ────────────────────────────────────

export type ImagingExamType =
  | 'OCT' | 'OCT-A' | 'retinographie' | 'champ_visuel'
  | 'topographie_corneenne' | 'tomographie_corneenne' | 'biometrie'
  | 'pachymetrie' | 'echographie_bscan' | 'angiographie_fluoresceine'
  | 'ICG' | 'autre';

export type LaboratoryExamType =
  | 'hba1c' | 'glycemie' | 'nfs' | 'creatinine' | 'uree'
  | 'bilan_lipidique' | 'crp' | 'vs' | 'thyroide' | 'autre';

export type MedicalDocumentCategory =
  | 'resultat_biologique' | 'imagerie' | 'compte_rendu_operatoire'
  | 'compte_rendu_hospitalier' | 'courrier_specialiste'
  | 'lettre_orientation' | 'ordonnance_anterieure'
  | 'dossier_medical_anterieur' | 'autre';

export type AttachmentType = 'pdf' | 'jpg' | 'jpeg' | 'png';

export interface Attachment {
  id: string;
  fileName: string;
  fileType: AttachmentType;
  fileSize: string;
  uploadDate: string;
  hasPreview: boolean;
  url?: string;
}

export interface OphthalmicImaging {
  id: string;
  patientId: string;
  patientName: string;
  examType: ImagingExamType;
  eye: EyeSide | 'OU';
  date: string;
  time: string;
  device: string;
  indication: string;
  result: string;
  interpretation: string;
  conclusion: string;
  notes?: string;
  attachments: Attachment[];
  doctorId: string;
  doctorName: string;
}

export interface ImagingResult {
  id: string;
  imagingId: string;
  field: string;
  value: string;
  unit?: string;
  reference?: string;
}

export interface LaboratoryResult {
  id: string;
  patientId: string;
  patientName: string;
  examType: LaboratoryExamType;
  examName: string;
  result: string;
  unit: string;
  referenceValues: string;
  date: string;
  laboratory: string;
  interpretation: string;
  notes?: string;
  attachments: Attachment[];
  doctorId: string;
  doctorName: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  name: string;
  category: MedicalDocumentCategory;
  date: string;
  source: string;
  fileType: AttachmentType;
  description: string;
  notes?: string;
  uploadedBy: string;
  attachment: Attachment;
}
