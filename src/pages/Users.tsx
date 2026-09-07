import { ShieldCheck, Plus, Stethoscope, Armchair } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const roles = [
  {
    name: 'Médecin',
    icon: Stethoscope,
    color: 'bg-primary/10 text-primary',
    permissions: ['Patients', 'Consultations', 'Examens', 'Imagerie', 'Ordonnances', 'Facturation', 'Documents', 'Statistiques'],
  },
  {
    name: 'Secrétaire',
    icon: Armchair,
    color: 'bg-accent/10 text-accent',
    permissions: ['Patients', 'Rendez-vous', 'Salle d\'attente', 'Paiements', 'Documents administratifs'],
  },
  {
    name: 'Administrateur',
    icon: ShieldCheck,
    color: 'bg-chart-5/10 text-chart-5',
    permissions: ['Utilisateurs', 'Rôles', 'Paramètres', 'Journaux d\'audit', 'Médicaments'],
  },
];

const users = [
  { id: 'u-1', name: 'Dr. Sabeg Ilias', email: 'sabeg@centre-ophtalmo.dz', role: 'Médecin', active: true, lastLogin: '2026-09-04 08:00' },
  { id: 'u-2', name: 'Amel Bouchama', email: 'amel@centre-ophtalmo.dz', role: 'Secrétaire', active: true, lastLogin: '2026-09-04 07:45' },
  { id: 'u-3', name: 'Karim Mansouri', email: 'karim@centre-ophtalmo.dz', role: 'Administrateur', active: true, lastLogin: '2026-09-03 18:30' },
];

export default function Users() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('usersRoles')}</h1>
          <p className="text-muted-foreground">{users.length} utilisateurs · {roles.length} rôles</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Roles overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card key={role.name} className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', role.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{role.name}</h3>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {role.permissions.map((perm) => (
                  <span key={perm} className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                    {perm}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Users table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('name')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rôle</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dernière connexion</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-center">
                    {user.active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <span className="h-2 w-2 rounded-full bg-success" /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Inactif
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
