import { Consultation } from '@/types';

const normalExam = { status: 'normal' as const, notes: '' };
const abnormalExam = { status: 'abnormal' as const, notes: '' };

export const mockConsultations: Consultation[] = Array.from({ length: 20 }, (_, i) => {
  const patientNames = [
    'Ahmed Benali', 'Fatima Cherif', 'Karim Haddad', 'Amina Bouzid', 'Yacine Mansouri',
    'Nadia Saadi', 'Rachid Belkacem', 'Samira Khelifi', 'Sofiane Brahimi', 'Leila Ziani',
    'Amine Hamdi', 'Khadija Ould Ali', 'Nabil Bensalem', 'Souad Larbi', 'Bilal Meziane',
    'Amel Bouchama', 'Reda Saidi', 'Djamila Touati', 'Walid Achour', 'Nour Belhadj',
  ];
  const reasons = ['Baisse de vision', 'Douleur oculaire', 'Suivi', 'Contrôle', 'Rougeur', 'Céphalées'];
  const diagnoses = [
    'Cataracte sénile', 'Glaucome à angle ouvert', 'DMLA forme sèche', 'Rétinopathie diabétique',
    'Conjonctivite allergique', 'Myopie forte', 'Kératite', 'Sécheresse oculaire',
    'Blépharite', 'Presbytie', 'Astigmatisme', 'Uvéite antérieure',
  ];

  const hasAbnormal = i % 3 === 0;

  return {
    id: `c-${i + 1}`,
    patientId: `p-${(i % 50) + 1}`,
    patientName: patientNames[i],
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: new Date(2026, 8, 4 - i).toISOString().split('T')[0],
    reason: reasons[i % reasons.length],
    visualAcuity: {
      OD: {
        farWithoutCorrection: i % 4 === 0 ? '3/10' : '8/10',
        farWithCorrection: i % 4 === 0 ? '8/10' : '10/10',
        nearWithoutCorrection: 'Parfait',
        nearWithCorrection: 'Parfait',
      },
      OG: {
        farWithoutCorrection: i % 5 === 0 ? '2/10' : '9/10',
        farWithCorrection: i % 5 === 0 ? '7/10' : '10/10',
        nearWithoutCorrection: 'Parfait',
        nearWithCorrection: 'Parfait',
      },
    },
    refraction: {
      OD: { sph: i % 3 === 0 ? '-2.50' : '-0.50', cyl: '-0.75', axis: '90', add: '+2.00', correctedVA: '10/10' },
      OG: { sph: i % 3 === 0 ? '-3.00' : '-0.25', cyl: '-1.00', axis: '85', add: '+2.00', correctedVA: '10/10' },
    },
    tonometry: {
      OD: { pressure: String(14 + (i % 8)), method: 'goldmann' },
      OG: { pressure: String(15 + (i % 6)), method: 'goldmann' },
    },
    anteriorSegment: {
      eyelids: hasAbnormal ? { ...abnormalExam, notes: 'Chalazion paupière supérieure' } : normalExam,
      conjunctiva: normalExam,
      cornea: hasAbnormal ? { ...abnormalExam, notes: 'Taie cornéenne' } : normalExam,
      anteriorChamber: normalExam,
      iris: normalExam,
      pupil: normalExam,
      lens: i % 4 === 0 ? { ...abnormalExam, notes: 'Cataracte nucléaire grade 2' } : normalExam,
    },
    posteriorSegment: {
      vitreous: normalExam,
      opticDisc: i % 5 === 0 ? { ...abnormalExam, notes: 'Excavation papillaire augmentée' } : normalExam,
      macula: i % 6 === 0 ? { ...abnormalExam, notes: 'Drusen maculaires' } : normalExam,
      retina: normalExam,
      vessels: normalExam,
    },
    primaryDiagnosis: diagnoses[i % diagnoses.length],
    associatedDiagnoses: i % 3 === 0 ? ['Hypertension artérielle oculaire'] : [],
    clinicalNotes: i % 2 === 0
      ? "Patient présentant une baisse d'acuité visuelle progressive. Examen complet réalisé. Traitement médical instauré."
      : 'Consultation de contrôle. Évolution favorable sous traitement.',
    treatmentPlan: i % 2 === 0
      ? 'Collyre hypotenseur + contrôle à 1 mois'
      : 'Maintien du traitement actuel + contrôle à 3 mois',
    followUpDate: new Date(2026, 9, 4 + (i % 30)).toISOString().split('T')[0],
    followUpPeriod: i % 2 === 0 ? '1 mois' : '3 mois',
  };
});
