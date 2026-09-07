import type { AuthenticatedUser, LoginCredentials, UserRole } from './types';
import { getRolePermissions } from './permissions';

// ── Mock authentication service ─────────────────────────────────────────────
//
// DEVELOPMENT / DEMO ONLY.
// This module is intentionally isolated from the UI layer so that a future
// backend (Node.js / Express / Sequelize / MySQL) can replace it without
// touching any component. The function signatures mirror what a real API
// client would expose: login, logout, getCurrentUser, and a session restore.
//
// Do NOT use these credentials in production. The real backend must implement
// secure server-side authentication with HTTP-only cookies / session tokens.

// ── Audit event types (for future server-side audit logging) ────────────────
//
// These types define the authentication events that a future backend should
// log. The mock service does not generate fake audit records — it only defines
// the structure so the real backend can implement them.

export type AuthEventType =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'access_denied';

export interface AuthEvent {
  type: AuthEventType;
  userId?: string;
  username?: string;
  timestamp: string;
  ip?: string;
  details?: string;
}

interface MockAccount {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  passwordHash: string;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  { id: 'u-1', name: 'Dr. Sabeg Ilias', username: 'medecin', role: 'medecin', passwordHash: 'fd8ec67daaacf3dd9aa02e853b2777848798b0b5f5215769e0d1a42b0d00123a' },
  { id: 'u-2', name: 'Secrétariat', username: 'secretariat', role: 'secretariat', passwordHash: '22290112541cc0c9e9022dd20ddcdde67ec4c064f574a72beba8065999c70eb3' },
  { id: 'u-3', name: 'Administrateur', username: 'admin', role: 'administration', passwordHash: 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7' },
];

const SESSION_KEY = 'co_session_uid';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function buildUser(account: MockAccount): AuthenticatedUser {
  return {
    id: account.id,
    name: account.name,
    username: account.username,
    role: account.role,
    permissions: getRolePermissions(account.role),
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    await delay(500);

    const account = MOCK_ACCOUNTS.find((a) => a.username === credentials.username);
    const passwordHash = await hashPassword(credentials.password);
    if (!account || passwordHash !== account.passwordHash) {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
    }

    const user = buildUser(account);
    if (credentials.rememberMe) {
      sessionStorage.setItem(SESSION_KEY, user.id);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
    return user;
  },

  async logout(): Promise<void> {
    await delay(200);
    sessionStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): AuthenticatedUser | null {
    const uid = sessionStorage.getItem(SESSION_KEY);
    if (!uid) return null;
    const account = MOCK_ACCOUNTS.find((a) => a.id === uid);
    if (!account) return null;
    return buildUser(account);
  },
};
