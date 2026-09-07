import {
  Allergy, CurrentTreatment, MedicalHistoryEntry,
  OphthalmologicalHistoryEntry, SurgicalRecord, TimelineEvent,
} from '@/types';

// ── Allergies ────────────────────────────────────────────────────────────────

export const mockAllergies: Allergy[] = [
  { id: 'al-1', patientId: 'p-1', substance: 'Pénicilline', type: 'médicament', reaction: 'Urticaire', severity: 'modérée', notes: 'Éviter toutes les pénicillines' },
  { id: 'al-2', patientId: 'p-1', substance: 'Iode', type: 'médicament', reaction: 'Dermite', severity: 'légère' },
  { id: 'al-3', patientId: 'p-2', substance: 'Sulfamides', type: 'médicament', reaction: 'Choc anaphylactique', severity: 'sévère', notes: 'Alerte critique' },
  { id: 'al-4', patientId: 'p-2', substance: 'Pollen', type: 'environnement', reaction: 'Conjonctivite allergique', severity: 'légère' },
  { id: 'al-5', patientId: 'p-3', substance: 'Atropine', type: 'médicament', reaction: 'Tachycardie', severity: 'modérée' },
  { id: 'al-6', patientId: 'p-4', substance: 'Latex', type: 'environnement', reaction: 'Dermite de contact', severity: 'modérée' },
];

// ── Current treatments ───────────────────────────────────────────────────────

export const mockTreatments: CurrentTreatment[] = [
  { id: 'tr-1', patientId: 'p-1', medication: 'Latanoprost 0.005%', type: 'ophtalmique', eye: 'OU', posology: '1 goutte', frequency: '1 fois / jour (soir)', route: 'Ophtalmique', startDate: '2026-01-15', indication: 'Glaucome', prescriber: 'Dr. Sabeg Ilias', notes: 'Contrôle PIO à 1 mois' },
  { id: 'tr-2', patientId: 'p-1', medication: 'Timolol 0.5%', type: 'ophtalmique', eye: 'OD', posology: '1 goutte', frequency: '2 fois / jour', route: 'Ophtalmique', startDate: '2026-01-15', indication: 'Glaucome OD' },
  { id: 'tr-3', patientId: 'p-1', medication: 'Metformine 850mg', type: 'systémique', posology: '1 comprimé', frequency: '2 fois / jour', route: 'Orale', startDate: '2023-06-01', indication: 'Diabète type 2', prescriber: 'Dr. Benali (Médecin généraliste)' },
  { id: 'tr-4', patientId: 'p-2', medication: 'Tobradex', type: 'ophtalmique', eye: 'OG', posology: '1 goutte', frequency: '3 fois / jour', route: 'Ophtalmique', startDate: '2026-08-20', endDate: '2026-09-05', indication: 'Conjonctivite', prescriber: 'Dr. Sabeg Ilias' },
  { id: 'tr-5', patientId: 'p-2', medication: 'Amlodipine 5mg', type: 'systémique', posology: '1 comprimé', frequency: '1 fois / jour (matin)', route: 'Orale', startDate: '2022-03-10', indication: 'Hypertension artérielle', prescriber: 'Dr. Benali' },
  { id: 'tr-6', patientId: 'p-3', medication: 'Refresh Tears', type: 'ophtalmique', eye: 'OU', posology: '1 goutte', frequency: '4 fois / jour', route: 'Ophtalmique', startDate: '2026-06-01', indication: 'Sécheresse oculaire', prescriber: 'Dr. Sabeg Ilias' },
  { id: 'tr-7', patientId: 'p-3', medication: 'Dorzolamide/Timolol', type: 'ophtalmique', eye: 'OU', posology: '1 goutte', frequency: '2 fois / jour', route: 'Ophtalmique', startDate: '2025-09-15', indication: 'Glaucome', prescriber: 'Dr. Sabeg Ilias' },
  { id: 'tr-8', patientId: 'p-4', medication: 'Vitabakt', type: 'ophtalmique', eye: 'OD', posology: '1 goutte', frequency: '3 fois / jour', route: 'Ophtalmique', startDate: '2026-09-01', indication: 'Post-opératoire cataracte', prescriber: 'Dr. Sabeg Ilias' },
];

// ── Medical history (structured) ──────────────────────────────────────────────

export const mockMedicalHistory: MedicalHistoryEntry[] = [
  { id: 'mh-1', patientId: 'p-1', category: 'diabete', label: 'Diabète', present: true, details: 'Type 2', diabetesDetail: { type: 'Type 2', duration: '8 ans', treatment: 'Metformine 850mg', hba1c: '7.2%', glycemia: '1.30 g/L', knownRetinopathy: true, laser: false, intravitrealInjections: false, vitrectomy: false, notes: 'Rétinopathie diabétique modérée non proliférante' } },
  { id: 'mh-2', patientId: 'p-1', category: 'hypertension', label: 'Hypertension artérielle', present: true, details: 'Depuis 2015, équilibrée' },
  { id: 'mh-3', patientId: 'p-1', category: 'dyslipidemie', label: 'Dyslipidémie', present: true, details: 'Hypercholestérolémie' },
  { id: 'mh-4', patientId: 'p-1', category: 'cardiovasculaire', label: 'Maladies cardiovasculaires', present: false },
  { id: 'mh-5', patientId: 'p-1', category: 'thyroide', label: 'Maladies thyroïdiennes', present: false },
  { id: 'mh-6', patientId: 'p-1', category: 'renale', label: 'Maladies rénales', present: false },
  { id: 'mh-7', patientId: 'p-1', category: 'neurologique', label: 'Maladies neurologiques', present: false },
  { id: 'mh-8', patientId: 'p-1', category: 'auto_immune', label: 'Maladies auto-immunes', present: false },
  { id: 'mh-9', patientId: 'p-1', category: 'respiratoire', label: 'Maladies respiratoires', present: false },
  { id: 'mh-10', patientId: 'p-1', category: 'oncologie', label: 'Antécédents oncologiques', present: false },
  { id: 'mh-11', patientId: 'p-2', category: 'hypertension', label: 'Hypertension artérielle', present: true, details: 'Depuis 2018, Amlodipine 5mg' },
  { id: 'mh-12', patientId: 'p-2', category: 'diabete', label: 'Diabète', present: false },
  { id: 'mh-13', patientId: 'p-2', category: 'dyslipidemie', label: 'Dyslipidémie', present: false },
  { id: 'mh-14', patientId: 'p-2', category: 'thyroide', label: 'Hypothyroïdie', present: true, details: 'Sous Lévothyrox 75µg' },
  { id: 'mh-15', patientId: 'p-3', category: 'auto_immune', label: 'Syndrome de Gougerot-Sjögren', present: true, details: 'Sécheresse oculaire sévère' },
  { id: 'mh-16', patientId: 'p-3', category: 'hypertension', label: 'Hypertension artérielle', present: true, details: 'Depuis 2020' },
  { id: 'mh-17', patientId: 'p-4', category: 'cardiovasculaire', label: 'Cardiopathie ischémique', present: true, details: 'Infarctus en 2021, stent posé' },
];

// ── Ophthalmological history ─────────────────────────────────────────────────

export const mockOphthoHistory: OphthalmologicalHistoryEntry[] = [
  { id: 'oh-1', patientId: 'p-1', condition: 'glaucome', label: 'Glaucome à angle ouvert', eye: 'OU', diagnosedDate: '2024-03-10', notes: 'PIO OD 18 / OG 20 sous traitement' },
  { id: 'oh-2', patientId: 'p-1', condition: 'retinopathie_diabetique', label: 'Rétinopathie diabétique', eye: 'OU', diagnosedDate: '2024-06-15', notes: 'Modérée non proliférante' },
  { id: 'oh-3', patientId: 'p-1', condition: 'troubles_refractifs', label: 'Myopie', eye: 'OU', diagnosedDate: '2010-01-01', notes: 'Myopie moyenne' },
  { id: 'oh-4', patientId: 'p-2', condition: 'cataracte', label: 'Cataracte sénile', eye: 'OD', diagnosedDate: '2025-09-01', notes: 'Nucléaire grade 2' },
  { id: 'oh-5', patientId: 'p-2', condition: 'secheresse', label: 'Sécheresse oculaire', eye: 'OU', diagnosedDate: '2025-01-20' },
  { id: 'oh-6', patientId: 'p-3', condition: 'secheresse', label: 'Sécheresse oculaire sévère', eye: 'OU', diagnosedDate: '2023-05-10', notes: 'Liée au syndrome de Gougerot-Sjögren' },
  { id: 'oh-7', patientId: 'p-3', condition: 'glaucome', label: 'Glaucome chronique', eye: 'OU', diagnosedDate: '2022-11-15', notes: 'Sous bithérapie' },
  { id: 'oh-8', patientId: 'p-4', condition: 'cataracte', label: 'Cataracte opérée', eye: 'OD', diagnosedDate: '2024-06-01', notes: 'Opérée le 15/08/2026' },
  { id: 'oh-9', patientId: 'p-4', condition: 'troubles_refractifs', label: 'Astigmatisme', eye: 'OG', diagnosedDate: '2020-03-01' },
];

// ── Surgical history ─────────────────────────────────────────────────────────

export const mockSurgicalHistory: SurgicalRecord[] = [
  { id: 'surg-1', patientId: 'p-4', type: 'cataracte', intervention: 'Phaco-émulsification + IOL', eye: 'OD', date: '2026-08-15', surgeon: 'Dr. Sabeg Ilias', facility: 'Clinique El Houria', indication: 'Cataracte sénile grade 3', implant: 'IOL monofocale +21.0D', result: 'AV OD 10/10 sans correction', complications: 'Aucune', postopTreatment: 'Tobradex 3x/jour pendant 3 semaines', notes: 'Évolution postop favorable' },
  { id: 'surg-2', patientId: 'p-1', type: 'laser', intervention: 'Laser Argon (trabéculoplastie)', eye: 'OD', date: '2025-05-20', surgeon: 'Dr. Sabeg Ilias', facility: 'Cabinet ophtalmologique', indication: 'Glaucome - PIO non contrôlée', result: 'PIO OD 16 mmHg', complications: 'Aucune', notes: 'Réduction PIO de 4 mmHg' },
  { id: 'surg-3', patientId: 'p-3', type: 'injection_intravitreenne', intervention: 'Injection anti-VEGF (Lucentis)', eye: 'OG', date: '2025-11-10', surgeon: 'Dr. Sabeg Ilias', facility: 'Clinique El Houria', indication: 'Œdème maculaire', result: 'Amélioration AV de 3/10 à 6/10', complications: 'Aucune', postopTreatment: 'Vitabakt 3x/jour 1 semaine', notes: '3 injections prévues' },
  { id: 'surg-4', patientId: 'p-2', type: 'lasik_prk_smile', intervention: 'LASIK', eye: 'OU', date: '2022-04-15', surgeon: 'Dr. Sabeg Ilias', facility: 'Clinique Vision Plus', indication: 'Myopie -4.00D', result: 'AV OU 12/10 sans correction', complications: 'Sécheresse postop transitoire', notes: 'Patient satisfait' },
];

// ── Timeline (structured, per patient) ────────────────────────────────────────

export const mockPatientTimeline: TimelineEvent[] = [
  { id: 'tl-1', patientId: 'p-1', date: '2026-09-04', type: 'consultation', title: 'Consultation de contrôle', description: 'Motif: Suivi glaucome. Diagnostic: Glaucome stable.', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-2', patientId: 'p-1', date: '2026-09-04', type: 'examen', title: 'OCT maculaire', description: 'OCT maculaire OD/OG - résultat normal', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-3', patientId: 'p-1', date: '2026-09-04', type: 'prescription', title: 'Ordonnance ORD-2026-0001', description: 'Latanoprost 0.005% - 1 goutte/soir', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-4', patientId: 'p-1', date: '2026-06-15', type: 'suivi', title: 'Suivi post-laser', description: 'Évolution favorable après trabéculoplastie au laser', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-5', patientId: 'p-1', date: '2026-05-20', type: 'intervention', title: 'Laser Argon OD', description: 'Trabéculoplastie au laser Argon - œil droit', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-6', patientId: 'p-1', date: '2026-03-12', type: 'consultation', title: 'Consultation initiale', description: 'Baisse de vision - diagnostic initial: Glaucome', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-7', patientId: 'p-1', date: '2026-03-12', type: 'diagnostic', title: 'Diagnostic: Glaucome', description: 'Glaucome à angle ouvert OD/OG', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-8', patientId: 'p-1', date: '2026-03-12', type: 'imagerie', title: 'Champ visuel', description: 'Champ visuel OD/OG - déficit nasal inférieur OD', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-9', patientId: 'p-1', date: '2026-02-01', type: 'document', title: 'Compte-rendu médical', description: 'Compte-rendu de consultation initiale', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-10', patientId: 'p-1', date: '2025-11-10', type: 'laboratoire', title: 'Bilan biologique', description: 'HbA1c: 7.2%, Glycémie: 1.30 g/L', doctor: 'Dr. Benali' },
  { id: 'tl-11', patientId: 'p-1', date: '2025-09-15', type: 'traitement', title: 'Début Latanoprost', description: 'Mise sous Latanoprost 0.005% - 1 goutte/soir OU', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-12', patientId: 'p-2', date: '2026-09-03', type: 'consultation', title: 'Consultation', description: 'Motif: Rougeur OG. Diagnostic: Conjonctivite.', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-13', patientId: 'p-2', date: '2026-09-03', type: 'prescription', title: 'Ordonnance ORD-2026-0002', description: 'Tobradex 3x/jour OG pendant 7 jours', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-14', patientId: 'p-2', date: '2022-04-15', type: 'intervention', title: 'LASIK OU', description: 'Chirurgie réfractive LASIK - myopie -4.00D', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-15', patientId: 'p-3', date: '2026-08-28', type: 'consultation', title: 'Consultation de suivi', description: 'Sécheresse oculaire sévère - poursuite du traitement', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-16', patientId: 'p-3', date: '2025-11-10', type: 'intervention', title: 'Injection intravitréenne OG', description: 'Anti-VEGF (Lucentis) - œdème maculaire', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-17', patientId: 'p-4', date: '2026-08-15', type: 'intervention', title: 'Chirurgie de cataracte OD', description: 'Phaco-émulsification + IOL monofocale', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-18', patientId: 'p-4', date: '2026-08-15', type: 'traitement', title: 'Traitement postop', description: 'Tobradex 3x/jour pendant 3 semaines', doctor: 'Dr. Sabeg Ilias' },
  { id: 'tl-19', patientId: 'p-4', date: '2026-09-01', type: 'suivi', title: 'Contrôle postop J+15', description: 'AV OD 10/10 sans correction. Évolution favorable.', doctor: 'Dr. Sabeg Ilias' },
];
