import { GlassesPrescription, ContactLensPrescription, PrescriptionHistoryEntry } from '@/types';

const emptyGlassesEye = { sph: '', cyl: '', axis: '', add: '', prisme: '', base: '', va: '' };
const emptyContactEye = { manufacturer: '', brand: '', lensType: '', bc: '', dia: '', power: '', cyl: '', axis: '', add: '', material: '', replacement: '', wearMode: '' };

export const mockGlassesPrescriptions: GlassesPrescription[] = [
  {
    id: 'gp-1',
    prescriptionId: 'LUN-2026-0001',
    patientId: 'p-1',
    patientName: 'Ahmed Benali',
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: '2026-09-04',
    type: 'progressive',
    OD: { sph: '-2.50', cyl: '-0.75', axis: '90', add: '+2.00', prisme: '', base: '', va: '10/10' },
    OG: { sph: '-3.00', cyl: '-1.00', axis: '85', add: '+2.00', prisme: '', base: '', va: '10/10' },
    pd: '63',
    pdMonoOD: '31.5',
    pdMonoOG: '31.5',
    pdNear: '60',
    heightOD: '22',
    heightOG: '22',
    lensType: 'Progressive',
    material: 'Organique',
    index: '1.6',
    design: 'Premium',
    treatments: 'Anti-reflet, Photochromique',
    options: 'Mineralisation',
    notes: 'Adaptation progressive - première paire',
    status: 'validee',
  },
  {
    id: 'gp-2',
    prescriptionId: 'LUN-2026-0002',
    patientId: 'p-2',
    patientName: 'Fatima Cherif',
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: '2026-08-20',
    type: 'loin',
    OD: { sph: '-1.00', cyl: '-0.50', axis: '180', add: '', prisme: '', base: '', va: '12/10' },
    OG: { sph: '-0.75', cyl: '-0.25', axis: '90', add: '', prisme: '', base: '', va: '12/10' },
    pd: '62',
    pdMonoOD: '31',
    pdMonoOG: '31',
    pdNear: '59',
    heightOD: '',
    heightOG: '',
    lensType: 'Unifocal',
    material: 'Organique',
    index: '1.5',
    design: 'Sphérique',
    treatments: 'Anti-reflet',
    options: '',
    notes: '',
    status: 'imprimee',
  },
];

export const mockContactLensPrescriptions: ContactLensPrescription[] = [
  {
    id: 'clp-1',
    prescriptionId: 'LEN-2026-0001',
    patientId: 'p-3',
    patientName: 'Karim Haddad',
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: '2026-08-15',
    type: 'torique',
    OD: { manufacturer: 'Alcon', brand: 'Air Optix Aqua', lensType: 'Silicone hydrogel', bc: '8.6', dia: '14.0', power: '-2.50', cyl: '-0.75', axis: '90', add: '', material: 'Lotrafilcon B', replacement: 'Mensuel', wearMode: 'Journalier' },
    OG: { manufacturer: 'Alcon', brand: 'Air Optix Aqua', lensType: 'Silicone hydrogel', bc: '8.6', dia: '14.0', power: '-3.00', cyl: '-1.00', axis: '85', add: '', material: 'Lotrafilcon B', replacement: 'Mensuel', wearMode: 'Journalier' },
    trialLens: 'Air Optix Toric -2.50/-0.75x90',
    overRefraction: '0.00',
    movement: 'Normal',
    centration: 'Centrée',
    comfort: 'Bon',
    tearFilm: 'Stable',
    wearingTime: '10h',
    finalLens: 'Oui',
    followUp: '1 semaine',
    notes: 'Bonne adaptation',
    status: 'validee',
  },
];

export const mockPrescriptionHistory: PrescriptionHistoryEntry[] = [
  {
    id: 'ph-1', prescriptionId: 'LUN-2026-0001', patientId: 'p-1', date: '2026-09-04',
    type: 'lunettes', subType: 'Progressive',
    OD: '-2.50 (-0.75) 90°', OG: '-3.00 (-1.00) 85°', add: '+2.00', pd: '63',
    doctor: 'Dr. Sabeg Ilias', notes: 'Adaptation progressive', status: 'validee',
  },
  {
    id: 'ph-2', prescriptionId: 'LUN-2025-0014', patientId: 'p-1', date: '2025-06-12',
    type: 'lunettes', subType: 'Bifocale',
    OD: '-2.25 (-0.75) 90°', OG: '-2.75 (-1.00) 85°', add: '+1.50', pd: '63',
    doctor: 'Dr. Sabeg Ilias', notes: 'Première bifocale', status: 'imprimee',
  },
  {
    id: 'ph-3', prescriptionId: 'LUN-2024-0008', patientId: 'p-1', date: '2024-03-05',
    type: 'lunettes', subType: 'Unifocal',
    OD: '-2.00', OG: '-2.50', add: '', pd: '63',
    doctor: 'Dr. Sabeg Ilias', notes: '', status: 'imprimee',
  },
  {
    id: 'ph-4', prescriptionId: 'LEN-2026-0001', patientId: 'p-1', date: '2026-08-15',
    type: 'lentilles', subType: 'Torique',
    OD: '-2.50 (-0.75) 90°', OG: '-3.00 (-1.00) 85°', add: '', pd: '',
    doctor: 'Dr. Sabeg Ilias', notes: 'Air Optix Toric mensuel', status: 'validee',
  },
];

export { emptyGlassesEye, emptyContactEye };
