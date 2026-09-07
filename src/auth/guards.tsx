import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, getWorkspacePath } from './AuthContext';
import type { UserRole, Permission } from './types';
import { hasPermission, hasAnyPermission, hasRole, hasAnyRole } from './permissions';

// ── Route-level authentication guard ────────────────────────────────────────

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ── Role guard ───────────────────────────────────────────────────────────────

export function RoleGuard({
  roles,
  children,
}: {
  roles: UserRole[];
  children: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !hasAnyRole(user, roles)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}

// ── Permission guard ─────────────────────────────────────────────────────────

export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !hasPermission(user, permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}

export function RequireAnyPermission({
  permissions,
  children,
}: {
  permissions: Permission[];
  children: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !hasAnyPermission(user, permissions)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}

// ── Convenience re-exports for components ────────────────────────────────────

export { hasPermission, hasAnyPermission, hasRole, hasAnyRole, getWorkspacePath };
