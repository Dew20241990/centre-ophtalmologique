import { Appointment } from '@/types';

const patientNames = [
  'Ahmed Benali', 'Fatima Cherif', 'Karim Haddad', 'Amina Bouzid', 'Yacine Mansouri',
  'Nadia Saadi', 'Rachid Belkacem', 'Samira Khelifi', 'Sofiane Brahimi', 'Leila Ziani',
  'Amine Hamdi', 'Khadija Ould Ali', 'Nabil Bensalem', 'Souad Larbi', 'Bilal Meziane',
  'Amel Bouchama', 'Reda Saidi', 'Djamila Touati', 'Walid Achour', 'Nour Belhadj',
  'Toufik Gacem', 'Imene Rahmani', 'Said Benyahia', 'Sabrina Chellouche', 'Djamel Mokrani',
  'Wassila Berkane', 'Hocine Zerrouki', 'Hanane Hamoudi', 'Lyes Belaid', 'Rania Kheloufi',
  'Mehdi Soltani', 'Zineb Boudiaf', 'Abdessalam Medjahed', 'Meriem Lahmar', 'Tarek Boukhalfa',
];

const reasons = [
  'Baisse de vision', 'Douleur oculaire', 'Rougeur', 'Céphalées', 'Suivi post-opératoire',
  'Contrôle annuel', 'Consultation de routine', 'Lentilles de contact', 'Chute de vision progressive',
  'Vision floue', 'Sécheresse oculaire', 'Strabisme enfant', 'Examen pré-opératoire',
];

const types: Appointment['type'][] = ['consultation', 'follow_up', 'examination', 'procedure', 'emergency'];

const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const mockAppointments: Appointment[] = [];

// Generate today's appointments
for (let i = 0; i < 32; i++) {
  const status: Appointment['status'] = i < 18 ? 'consulted' : i < 24 ? 'confirmed' : i < 28 ? 'pending' : i < 30 ? 'absent' : 'cancelled';
  mockAppointments.push({
    id: `apt-${i + 1}`,
    patientId: `p-${(i % 50) + 1}`,
    patientName: patientNames[i % patientNames.length],
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: todayISO(0),
    time: times[i % times.length],
    duration: 30,
    type: types[i % types.length],
    reason: reasons[i % reasons.length],
    status,
    notes: i % 4 === 0 ? 'Patient nécessite un examen OCT' : undefined,
  });
}

// Generate past and future appointments
for (let i = 32; i < 60; i++) {
  const offset = i < 46 ? -(i - 31) : i - 45;
  mockAppointments.push({
    id: `apt-${i + 1}`,
    patientId: `p-${(i % 50) + 1}`,
    patientName: patientNames[i % patientNames.length],
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: todayISO(offset),
    time: times[i % times.length],
    duration: 30,
    type: types[i % types.length],
    reason: reasons[i % reasons.length],
    status: offset < 0 ? (Math.random() > 0.2 ? 'consulted' : 'absent') : 'confirmed',
  });
}
