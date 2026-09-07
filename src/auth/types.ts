// ── Authentication & RBAC domain types ─────────────────────────────────────

export type UserRole = 'medecin' | 'secretariat' | 'administration';

export type Permission =
  | 'patients.read'
  | 'patients.write'
  | 'appointments.read'
  | 'appointments.write'
  | 'consultations.read'
  | 'consultations.write'
  | 'clinical.read'
  | 'clinical.write'
  | 'prescriptions.read'
  | 'prescriptions.write'
  | 'imaging.read'
  | 'imaging.write'
  | 'surgery.read'
  | 'surgery.write'
  | 'users.read'
  | 'users.write'
  | 'roles.manage'
  | 'audit.read'
  | 'settings.manage';

export interface AuthenticatedUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  permissions: Permission[];
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}
