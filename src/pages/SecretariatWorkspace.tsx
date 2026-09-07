import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ClipboardList, FileText, Users, Bell, Phone, Armchair } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import Accueil from './secretariat/Accueil';
import Dossiers from './secretariat/Dossiers';
import DocumentsAdmin from './secretariat/DocumentsAdmin';
import Contacts from './secretariat/Contacts';
import Notifications from './secretariat/Notifications';

const cards = [
  { label: 'Patients', description: 'Gérer les informations administratives des patients', icon: Users, path: '/patients' },
  { label: 'Rendez-vous', description: 'Planifier et suivre les rendez-vous', icon: CalendarDays, path: '/appointments' },
  { label: "Salle d'attente", description: "Suivre l'accueil et la présence des patients", icon: Armchair, path: '/waiting-room' },
  { label: 'Dossiers administratifs', description: 'Accéder aux éléments administratifs des dossiers', icon: ClipboardList, path: '/secretariat/dossiers' },
  { label: 'Documents administratifs', description: 'Organiser les documents non cliniques', icon: FileText, path: '/secretariat/documents' },
  { label: 'Contacts', description: 'Gérer les contacts du centre', icon: Phone, path: '/secretariat/contacts' },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Espace secrétariat</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bienvenue, {user?.name}. Retrouvez ici les tâches administratives du centre.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, description, icon: Icon, path }) => (
          <Card key={label} className="p-5 transition-shadow hover:shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-sm font-semibold">{label}</h2>
            <p className="mt-1 min-h-10 text-xs leading-relaxed text-muted-foreground">{description}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate(path)}>Ouvrir</Button>
          </Card>
        ))}
      </div>
      <Card className="flex items-start gap-3 border-primary/20 bg-primary/5 p-4">
        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">Les informations cliniques détaillées restent réservées à l'espace médical.</p>
      </Card>
    </div>
  );
}

export default function SecretariatWorkspace() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="accueil" element={<Accueil />} />
      <Route path="dossiers" element={<Dossiers />} />
      <Route path="documents" element={<DocumentsAdmin />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
