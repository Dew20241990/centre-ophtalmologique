import { ShieldCheck, Eye, Stethoscope, UserRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ROLE_PERMISSIONS, ROLE_LABELS } from '@/auth/permissions';
import type { UserRole, Permission } from '@/auth/types';

const roleIcons: Record<UserRole, typeof Eye> = {
  medecin: Stethoscope,
  secretariat: UserRound,
  administration: ShieldCheck,
};

const permissionLabels: Record<Permission, string> = {
  'patients.read': 'Patients (lecture)',
  'patients.write': 'Patients (écriture)',
  'appointments.read': 'Rendez-vous (lecture)',
  'appointments.write': 'Rendez-vous (écriture)',
  'consultations.read': 'Consultations (lecture)',
  'consultations.write': 'Consultations (écriture)',
  'clinical.read': 'Dossier clinique (lecture)',
  'clinical.write': 'Dossier clinique (écriture)',
  'prescriptions.read': 'Ordonnances (lecture)',
  'prescriptions.write': 'Ordonnances (écriture)',
  'imaging.read': 'Imagerie (lecture)',
  'imaging.write': 'Imagerie (écriture)',
  'surgery.read': 'Chirurgie (lecture)',
  'surgery.write': 'Chirurgie (écriture)',
  'users.read': 'Utilisateurs (lecture)',
  'users.write': 'Utilisateurs (écriture)',
  'roles.manage': 'Gestion des rôles',
  'audit.read': 'Journal d\'audit',
  'settings.manage': 'Paramètres système',
};

const allPermissions = Object.keys(permissionLabels) as Permission[];
const roles: UserRole[] = ['medecin', 'secretariat', 'administration'];

export default function RolesPermissions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rôles & permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Structure actuelle des droits d'accès par rôle.</p>
      </div>

      {/* Role cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map((role) => {
          const Icon = roleIcons[role];
          const perms = ROLE_PERMISSIONS[role];
          return (
            <Card key={role} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{ROLE_LABELS[role]}</p>
                  <p className="text-xs text-muted-foreground">{perms.length} permission(s)</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Permission matrix */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Permission</th>
                {roles.map((role) => (
                  <th key={role} className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                    {ROLE_LABELS[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((perm) => (
                <tr key={perm} className="border-b border-border/50">
                  <td className="px-4 py-3 text-sm font-medium">{permissionLabels[perm]}</td>
                  {roles.map((role) => {
                    const has = ROLE_PERMISSIONS[role].includes(perm);
                    return (
                      <td key={role} className="px-4 py-3 text-center">
                        {has ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
                            <CheckIcon className="h-3 w-3 text-green-600" />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                            <XIcon className="h-3 w-3 text-muted-foreground" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex items-start gap-3 border-primary/20 bg-primary/5 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          La structure des rôles et permissions est gérée par le système RBAC. Toute modification nécessite une intervention au niveau du backend.
        </p>
      </Card>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
