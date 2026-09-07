import type { UserRole, Permission } from './types';

// ── Role → Permission matrix ─────────────────────────────────────────────────

const MEDECIN_PERMISSIONS: Permission[] = [
  'patients.read', 'patients.write',
  'appointments.read', 'appointments.write',
  'consultations.read', 'consultations.write',
  'clinical.read', 'clinical.write',
  'prescriptions.read', 'prescriptions.write',
  'imaging.read', 'imaging.write',
  'surgery.read', 'surgery.write',
];

const SECRETARIAT_PERMISSIONS: Permission[] = [
  'patients.read', 'patients.write',
  'appointments.read', 'appointments.write',
];

const ADMINISTRATION_PERMISSIONS: Permission[] = [
  'patients.read',
  'users.read', 'users.write',
  'roles.manage',
  'audit.read',
  'settings.manage',
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  medecin: MEDECIN_PERMISSIONS,
  secretariat: SECRETARIAT_PERMISSIONS,
  administration: ADMINISTRATION_PERMISSIONS,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  medecin: 'Médecin',
  secretariat: 'Secrétariat',
  administration: 'Administration',
};

export const ROLE_WORKSPACES: Record<UserRole, string> = {
  medecin: '/medical',
  secretariat: '/secretariat',
  administration: '/administration',
};

// ── Authorization helpers ─────────────────────────────────────────────────────

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(
  user: { role: UserRole; permissions: Permission[] } | null,
  permission: Permission,
): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(
  user: { role: UserRole; permissions: Permission[] } | null,
  permissions: Permission[],
): boolean {
  if (!user) return false;
  return permissions.some((p) => user.permissions.includes(p));
}

export function hasRole(
  user: { role: UserRole } | null,
  role: UserRole,
): boolean {
  if (!user) return false;
  return user.role === role;
}

export function hasAnyRole(
  user: { role: UserRole } | null,
  roles: UserRole[],
): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
