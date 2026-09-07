import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth, getWorkspacePath } from '@/auth/AuthContext';
import { Button } from '@/components/ui/button';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const homePath = user ? getWorkspacePath(user.role) : '/login';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Accès non autorisé</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Vous ne disposez pas des autorisations nécessaires pour accéder à cette ressource.
      </p>
      <Button
        className="mt-6 gap-2"
        onClick={() => navigate(homePath, { replace: true })}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à mon espace
      </Button>
    </div>
  );
}
