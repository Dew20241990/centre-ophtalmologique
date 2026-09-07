import { Patient } from '@/types';

const firstNames = [
  'Ahmed', 'Mohamed', 'Karim', 'Yacine', 'Rachid', 'Sofiane', 'Amine', 'Nabil',
  'Bilal', 'Reda', 'Walid', 'Toufik', 'Said', 'Djamel', 'Hocine', 'Lyes',
  'Fatima', 'Amina', 'Yasmine', 'Nadia', 'Samira', 'Leila', 'Khadija', 'Souad',
  'Amel', 'Djamila', 'Nour', 'Imene', 'Sabrina', 'Wassila', 'Hafida', 'Zahra',
  'Boumediene', 'Abdelkader', 'Mustapha', 'Cherif', 'Salim', 'Omar', 'Farid', 'Kamel',
  'Houria', 'Faiza', 'Mouna', 'Sihem', 'Lamia', 'Rania', 'Asma', 'Hanane',
  'Mehdi', 'Abdessalam', 'Tarek', 'Zineb', 'Meriem', 'Dalila',
];

const lastNames = [
  'Benali', 'Cherif', 'Haddad', 'Bouzid', 'Mansouri', 'Saadi', 'Belkacem',
  'Khelifi', 'Brahimi', 'Ziani', 'Hamdi', 'Ould Ali', 'Bensalem', 'Larbi',
  'Meziane', 'Bouchama', 'Saidi', 'Touati', 'Achour', 'Belhadj', 'Gacem',
  'Rahmani', 'Benyahia', 'Chellouche', 'Mokrani', 'Berkane', 'Zerrouki',
  'Hamoudi', 'Belaid', 'Kheloufi', 'Soltani', 'Boudiaf', 'Medjahed',
  'Lahmar', 'Boukhalfa', 'Zitouni', 'Ait Ahmed', 'Belmokhtar', 'Djebbar',
  'Slimani', 'Fellah', 'Guerroudj', 'Benslimane', 'Hamitou', 'Toumi',
  'Boumediene', 'Bouaoune', 'Bekkar', 'Sahraoui', 'Hamadi',
];

const cities = ['Khenchela', 'Constantine', 'Batna', 'Biskra', 'Oum El Bouaghi', 'Tébessa', 'Sétif', 'Alger'];
const diagnoses = [
  'Cataracte', 'Glaucome', 'DMLA', 'Rétinopathie diabétique', 'Conjonctivite',
  'Myopie', 'Hypermétropie', 'Astigmatisme', 'Presbytie', 'Kératite',
  'Uvéite', 'Décollement de rétine', 'Blépharite', 'Strabisme', 'Amblyopie',
  'Sécheresse oculaire', 'Pterygion', 'Névrite optique', 'Diplopie', 'Non diagnostiqué',
];

function randomDate(startYear: number, endYear: number): string {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
}

function randomPhone(): string {
  const prefixes = ['0550', '0564', '0661', '0770', '0551', '0655', '0771'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(100000 + Math.random() * 899999);
  return `${prefix} ${String(num).slice(0, 2)} ${String(num).slice(2, 4)} ${String(num).slice(4, 6)}`;
}

export const mockPatients: Patient[] = Array.from({ length: 50 }, (_, i) => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const birthDate = randomDate(1945, 2015);
  const lastVisitDate = Math.random() > 0.3 ? randomDate(2025, 2026) : undefined;

  return {
    id: `p-${i + 1}`,
    patientId: `PAT-${String(i + 1).padStart(5, '0')}`,
    firstName,
    lastName,
    gender,
    birthDate,
    phone: randomPhone(),
    email: Math.random() > 0.6 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com` : undefined,
    address: Math.random() > 0.5 ? `${Math.floor(Math.random() * 100) + 1} Rue ${['Abbas Laghrour', 'Didouche Mourad', 'Larbi Ben M\'hidi', 'Hassiba Ben Bouali'][Math.floor(Math.random() * 4)]}` : undefined,
    city: cities[Math.floor(Math.random() * cities.length)],
    bloodType: Math.random() > 0.7 ? ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)] : undefined,
    insurance: Math.random() > 0.4 ? ['CNAS', 'CASNOS', 'SNMG', 'MUTUELLE'][Math.floor(Math.random() * 4)] : undefined,
    profession: Math.random() > 0.5 ? ['Enseignant', 'Ingénieur', 'Commerçant', 'Retraité', 'Étudiant', 'Médecin', 'Agriculteur', 'Fonctionnaire'][Math.floor(Math.random() * 8)] : undefined,
    status: Math.random() > 0.15 ? 'active' : 'inactive',
    createdAt: randomDate(2023, 2026),
    lastVisit: lastVisitDate,
    lastDiagnosis: lastVisitDate ? diagnoses[Math.floor(Math.random() * diagnoses.length)] : undefined,
  };
});
