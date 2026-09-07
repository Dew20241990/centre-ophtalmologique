import { Examination, MedicalImage, Prescription, Invoice, Notification, AuditLog, TimelineEvent, ClinicalDocument } from '@/types';

const patientNames = [
  'Ahmed Benali', 'Fatima Cherif', 'Karim Haddad', 'Amina Bouzid', 'Yacine Mansouri',
  'Nadia Saadi', 'Rachid Belkacem', 'Samira Khelifi', 'Sofiane Brahimi', 'Leila Ziani',
  'Amine Hamdi', 'Khadija Ould Ali', 'Nabil Bensalem', 'Souad Larbi', 'Bilal Meziane',
];

const examTypes: Examination['type'][] = ['OCT', 'retinography', 'visual_field', 'corneal_topography', 'biometry', 'pachymetry', 'ultrasound', 'angiography'];

export const mockExaminations: Examination[] = Array.from({ length: 15 }, (_, i) => ({
  id: `e-${i + 1}`,
  patientId: `p-${(i % 50) + 1}`,
  patientName: patientNames[i % patientNames.length],
  type: examTypes[i % examTypes.length],
  eye: i % 3 === 0 ? 'OD' : i % 3 === 1 ? 'OG' : 'both',
  date: new Date(2026, 7, 4 - i).toISOString().split('T')[0],
  result: i % 3 === 0 ? 'Anormal' : 'Normal',
  doctorId: 'u-1',
  doctorName: 'Dr. Sabeg Ilias',
  notes: i % 2 === 0 ? 'Examen réalisé dans des conditions optimales' : 'Patient coopératif',
}));

export const mockMedicalImages: MedicalImage[] = Array.from({ length: 12 }, (_, i) => ({
  id: `img-${i + 1}`,
  patientId: `p-${(i % 50) + 1}`,
  patientName: patientNames[i % patientNames.length],
  type: ['OCT Macula', 'Rétinographie', 'OCT Papille', 'Champ visuel'][i % 4],
  eye: i % 2 === 0 ? 'OD' : 'OG',
  date: new Date(2026, 7, 4 - i).toISOString().split('T')[0],
  url: '',
  notes: i % 3 === 0 ? 'Lésion détectée' : 'Examen normal',
}));

export const mockPrescriptions: Prescription[] = Array.from({ length: 10 }, (_, i) => ({
  id: `pr-${i + 1}`,
  prescriptionId: `ORD-${2026}-${String(i + 1).padStart(4, '0')}`,
  patientId: `p-${(i % 50) + 1}`,
  patientName: patientNames[i % patientNames.length],
  doctorId: 'u-1',
  doctorName: 'Dr. Sabeg Ilias',
  date: new Date(2026, 8, 4 - i).toISOString().split('T')[0],
  items: [
    {
      id: `pi-${i}-1`,
      medicationName: ['Tobradex', 'Xalatan', 'Timolol', 'Refresh Tears', 'Vitabakt'][i % 5],
      dci: ['Tobramycine + Dexaméthasone', 'Latanoprost', 'Timolol', 'Carmellose', 'Picloxydine'][i % 5],
      dosage: ['0.3%', '0.005%', '0.5%', '0.5%', '0.05%'][i % 5],
      form: 'Collyre',
      posology: '1 goutte',
      frequency: ['3 fois / jour', '1 fois / jour (soir)', '2 fois / jour', '4 fois / jour', '2 fois / jour'][i % 5],
      duration: ['7 jours', '30 jours', '60 jours', '15 jours', '10 jours'][i % 5],
      route: 'Voie ophtalmique',
      instructions: i % 2 === 0 ? 'À conserver au réfrigérateur' : '',
      isFreeText: false,
    },
  ],
  notes: i % 3 === 0 ? 'Traitement à revoir dans 1 mois' : undefined,
}));

export const mockInvoices: Invoice[] = Array.from({ length: 10 }, (_, i) => {
  const total = [2000, 3500, 1500, 5000, 2500, 4000, 3000, 1800, 4500, 2200][i];
  const paid = i % 3 === 0 ? total : i % 3 === 1 ? Math.floor(total / 2) : 0;
  return {
    id: `inv-${i + 1}`,
    invoiceNumber: `FAC-2026-${String(i + 1).padStart(4, '0')}`,
    patientId: `p-${(i % 50) + 1}`,
    patientName: patientNames[i % patientNames.length],
    date: new Date(2026, 8, 4 - i).toISOString().split('T')[0],
    items: [
      { description: 'Consultation ophtalmologique', quantity: 1, unitPrice: total, total },
    ],
    total,
    paid,
    remaining: total - paid,
    paymentMethod: ['cash', 'card', 'other'][i % 3] as Invoice['paymentMethod'],
    paymentStatus: paid === total ? 'paid' : paid > 0 ? 'partial' : 'unpaid',
  };
});

export const mockNotifications: Notification[] = [
  { id: 'n-1', type: 'appointment', title: 'Rendez-vous à venir', message: 'Ahmed Benali à 10:30', time: 'Il y a 5 min', read: false },
  { id: 'n-2', type: 'waiting', title: 'Patient en attente', message: 'Fatima Cherif attend depuis 15 min', time: 'Il y a 15 min', read: false },
  { id: 'n-3', type: 'payment', title: 'Paiement en attente', message: 'Facture FAC-2026-0003 impayée', time: 'Il y a 1 h', read: false },
  { id: 'n-4', type: 'follow_up', title: 'Suivi requis', message: 'Karim Haddad - contrôle dans 3 jours', time: 'Il y a 2 h', read: true },
  { id: 'n-5', type: 'system', title: 'Sauvegarde complète', message: 'Sauvegarde automatique réussie', time: 'Il y a 3 h', read: true },
];

export const mockDocuments: ClinicalDocument[] = Array.from({ length: 10 }, (_, i) => {
  const types: ClinicalDocument['type'][] = ['prescription', 'medical_report', 'exam_report', 'imaging', 'certificate', 'administrative'];
  const type = types[i % types.length];
  const titles: Record<string, string> = {
    prescription: 'Ordonnance',
    medical_report: 'Compte-rendu',
    exam_report: 'Rapport d\'examen',
    imaging: 'Imagerie',
    certificate: 'Certificat médical',
    administrative: 'Document administratif',
  };
  return {
    id: `doc-${i + 1}`,
    patientId: `p-${(i % 50) + 1}`,
    patientName: patientNames[i % patientNames.length],
    type,
    title: `${titles[type]} ${i + 1}`,
    date: new Date(2026, 8, 4 - i).toISOString().split('T')[0],
    size: `${Math.floor(Math.random() * 3000) + 50} KB`,
    uploadedBy: i % 2 === 0 ? 'Dr. Sabeg Ilias' : 'Secrétaire Amel',
  };
});

export const mockAuditLogs: AuditLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `log-${i + 1}`,
  user: ['Dr. Sabeg Ilias', 'Secrétaire Amel', 'Admin Karim'][i % 3],
  action: ['Créé patient', 'Modifié consultation', 'Créé ordonnance', 'Téléversé examen', 'Modifié rendez-vous', 'Supprimé document'][i % 6],
  module: ['Patients', 'Consultations', 'Prescriptions', 'Examinations', 'Appointments', 'Documents'][i % 6],
  patient: patientNames[i % patientNames.length],
  date: new Date(2026, 8, 4).toISOString().split('T')[0],
  time: `${String(8 + Math.floor(i / 3)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
  ip: '192.168.1.100',
  description: ['Nouveau patient ajouté au système', 'Consultation mise à jour', 'Ordonnance générée', 'Examen OCT téléversé', 'Rendez-vous modifié', 'Document supprimé'][i % 6],
}));

export const mockTimelineEvents: TimelineEvent[] = [
  { id: 't-1', patientId: 'p-1', date: '2026-09-04', type: 'consultation', title: 'Consultation', description: 'Consultation de contrôle - diagnostic: Glaucome', doctor: 'Dr. Sabeg Ilias' },
  { id: 't-2', patientId: 'p-1', date: '2026-09-04', type: 'examen', title: 'OCT', description: 'OCT maculaire - résultat normal', doctor: 'Dr. Sabeg Ilias' },
  { id: 't-3', patientId: 'p-1', date: '2026-09-04', type: 'prescription', title: 'Ordonnance', description: 'Xalatan 0.005% - 1 fois/jour', doctor: 'Dr. Sabeg Ilias' },
  { id: 't-4', patientId: 'p-1', date: '2026-06-15', type: 'suivi', title: 'Suivi', description: 'Suivi post-traitement - évolution favorable', doctor: 'Dr. Sabeg Ilias' },
  { id: 't-5', patientId: 'p-1', date: '2026-03-12', type: 'consultation', title: 'Première consultation', description: 'Baisse de vision - diagnostic initial: Glaucome', doctor: 'Dr. Sabeg Ilias' },
];
