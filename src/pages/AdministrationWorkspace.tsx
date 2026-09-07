import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, ScrollText, BarChart3, Settings, SlidersHorizontal, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import RolesPermissions from './administration/RolesPermissions';
import Configuration from './administration/Configuration';
import Centre from './administration/Centre';

const cards = [
  { label: 'Utilisateurs', description: 'Gérer les comptes du personnel', icon: Users, path: '/users' },
  { label: 'Rôles & permissions', description: "Administrer les droits d'accès", icon: ShieldCheck, path: '/administration/roles' },
  { label: "Journal d'audit", description: 'Consulter les événements de sécurité', icon: ScrollText, path: '/audit-logs' },
  { label: 'Statistiques', description: 'Consulter les indicateurs du centre', icon: BarChart3, path: '/statistics' },
  { label: 'Paramètres', description: 'Gérer les paramètres du système', icon: Settings, path: '/settings' },
  { label: 'Configuration', description: "Configurer les options de fonctionnement", icon: SlidersHorizontal, path: '/administration/configuration' },
  { label: 'Gestion du centre', description: 'Administrer les informations du centre', icon: Building2, path: '/administration/centre' },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Espace administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bienvenue, {user?.name}. Gérez le fonctionnement de votre centre.</p>
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
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">L'administration système n'accorde pas automatiquement de droits de modification clinique.</p>
      </Card>
    </div>
  );
}

export default function AdministrationWorkspace() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="roles" element={<RolesPermissions />} />
      <Route path="configuration" element={<Configuration />} />
      <Route path="centre" element={<Centre />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
