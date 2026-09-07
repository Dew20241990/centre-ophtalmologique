import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Loader2, ShieldCheck, Info } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth, getWorkspacePath } from '@/auth/AuthContext';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';

const DEMO_ACCOUNTS = [
  { username: 'medecin', label: 'Médecin' },
  { username: 'secretariat', label: 'Secrétariat' },
  { username: 'admin', label: 'Administration' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [showForgot, setShowForgot] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  function validateUsername(value: string): string | null {
    if (!value.trim()) return "Veuillez saisir votre nom d'utilisateur.";
    return null;
  }

  function validatePassword(value: string): string | null {
    if (!value) return 'Veuillez saisir votre mot de passe.';
    return null;
  }

  const usernameError = touched.username ? validateUsername(username) : null;
  const passwordError = touched.password ? validatePassword(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    setTouched({ username: true, password: true });
    if (uErr || pErr) {
      setError(uErr || pErr || '');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const user = await login({ username, password, rememberMe });
      const dest = from || getWorkspacePath(user.role);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(uname: string) {
    setUsername(uname);
    setPassword('');
    setError('');
    setTouched({ username: false, password: false });
    usernameRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--accent)) 0%, transparent 50%)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground font-medium">Votre Vision, Notre Engagement</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-card shadow-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight">Connexion</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Accédez à votre espace de travail.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={usernameRef}
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  className={cn(
                    'w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    usernameError ? 'border-destructive' : 'border-border',
                  )}
                  placeholder="identifiant"
                  aria-invalid={!!usernameError}
                  aria-describedby={usernameError ? 'username-error' : undefined}
                />
              </div>
              {usernameError && (
                <p id="username-error" className="text-xs text-destructive" role="alert">
                  {usernameError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={cn(
                    'w-full rounded-lg border bg-background py-2.5 pl-10 pr-10 text-sm outline-none transition-colors',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    passwordError ? 'border-destructive' : 'border-border',
                  )}
                  placeholder="••••••••"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-xs text-destructive" role="alert">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember + forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-sm text-muted-foreground">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5" role="alert">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors',
                'hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground">Comptes de démonstration</p>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => fillDemo(acc.username)}
                  className="flex w-full items-center justify-between rounded-md border border-border/50 bg-background px-3 py-1.5 text-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-medium">{acc.label}</span>
                  <span className="text-muted-foreground">{acc.username}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Accès réservé au personnel autorisé du Centre Ophtalmologique.</span>
        </div>
      </div>

      {/* Forgot password dialog */}
      <Dialog open={showForgot} onOpenChange={setShowForgot}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mot de passe oublié</DialogTitle>
            <DialogDescription>
              Cette fonctionnalité sera disponible avec l'authentification serveur.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              La réinitialisation du mot de passe nécessite une authentification serveur sécurisée. Veuillez contacter l'administrateur du centre.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForgot(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
