import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, Search, Bell, Moon, Sun, ChevronDown, LogOut,
  User, Settings, Command, CalendarDays, Pill, Microscope,
  ShieldCheck, Clock,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useAuth } from '@/auth/AuthContext';
import { ROLE_LABELS } from '@/auth/permissions';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTheme } from '@/hooks/use-theme';
import { mockNotifications } from '@/data/mockClinical';
import { mockPatients } from '@/data/mockPatients';
import { mockAppointments } from '@/data/mockAppointments';
import { mockPrescriptions, mockExaminations } from '@/data/mockClinical';
import { cn } from '@/lib/utils';
import { TranslationKey } from '@/i18n/translations';
import { LucideIcon } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';

function getInitials(name: string): string {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

interface TopNavProps {
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
}

const routeLabels: Record<string, TranslationKey> = {
  '/': 'dashboard',
  '/patients': 'patients',
  '/patient': 'patientProfile',
  '/appointments': 'appointments',
  '/waiting-room': 'waitingRoom',
  '/consultations': 'consultations',
  '/consultation': 'consultationWorkspace',
  '/examinations': 'examinations',
  '/imaging': 'medicalImaging',
  '/prescriptions': 'prescriptions',
  '/prescription': 'prescriptionBuilder',
  '/billing': 'billing',
  '/documents': 'documents',
  '/statistics': 'statistics',
  '/users': 'usersRoles',
  '/medications': 'medications',
  '/audit-logs': 'auditLogs',
  '/settings': 'settings',
};

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  route: string;
  icon: LucideIcon;
}

export function TopNav({ onToggleSidebar, onToggleMobile }: TopNavProps) {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.length === 0
    ? [t('dashboard')]
    : [t('dashboard'), ...pathSegments.map(seg => {
        const key = Object.entries(routeLabels).find(([route]) =>
          route !== '/' && (location.pathname === route || location.pathname.startsWith(route + '/') || location.pathname === route)
        )?.[1];
        return key ? t(key) : seg;
      })];

  const searchResults: SearchResult[] = (() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    mockPatients
      .filter(p => `${p.firstName} ${p.lastName} ${p.patientId}`.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(p => {
        results.push({ id: p.id, label: `${p.firstName} ${p.lastName}`, sublabel: p.patientId, route: `/patient/${p.id}`, icon: User });
      });

    mockAppointments
      .filter(a => a.patientName.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(a => {
        results.push({ id: a.id, label: a.patientName, sublabel: `RDV · ${a.date} ${a.time}`, route: '/appointments', icon: CalendarDays });
      });

    mockPrescriptions
      .filter(p => p.patientName.toLowerCase().includes(q) || p.prescriptionId.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(p => {
        results.push({ id: p.id, label: p.prescriptionId, sublabel: `Ordonnance · ${p.patientName}`, route: '/prescriptions', icon: Pill });
      });

    mockExaminations
      .filter(e => e.patientName.toLowerCase().includes(q) || e.type.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(e => {
        results.push({ id: e.id, label: e.type, sublabel: `Examen · ${e.patientName}`, route: '/examinations', icon: Microscope });
      });

    return results;
  })();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 lg:px-6">
        {/* Left: menu toggle + breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobile}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40">/</span>}
                <span className={cn(
                  i === breadcrumbs.length - 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <button
          onClick={() => setShowSearch(true)}
          className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors w-64 lg:w-80"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">{t('search')}</span>
          <kbd className="hidden lg:flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {/* Mobile search */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            title={theme === 'light' ? t('darkMode') : t('lightMode')}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-popover shadow-card animate-scale-in z-50">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold">{t('notifications')}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {unreadCount} nouveau(s)
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'flex gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer',
                        !n.read && 'bg-primary/5'
                      )}
                    >
                      <div className={cn(
                        'mt-1 h-2 w-2 shrink-0 rounded-full',
                        n.read ? 'bg-muted-foreground/30' : 'bg-primary'
                      )} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-muted/50 transition-colors">
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {user ? getInitials(user.name) : '??'}
              </div>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-card animate-scale-in z-50">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ''}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setShowProfile(false); setShowProfileDrawer(true); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Mon profil
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    {t('settings')}
                  </button>
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Déconnexion</AlertDialogTitle>
            <AlertDialogDescription>Voulez-vous vraiment vous déconnecter ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { void logout(); navigate('/login', { replace: true }); }}
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Global Search Command Palette */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
          <div className="absolute inset-0 bg-navy-deep/40 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-popover shadow-card animate-scale-in">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
              {searchQuery.trim() === '' ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Tapez pour rechercher patients, rendez-vous, ordonnances, examens...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Aucun résultat pour « {searchQuery} »
                </p>
              ) : (
                searchResults.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => { setShowSearch(false); setSearchQuery(''); navigate(r.route); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="flex-1 text-left font-medium">{r.label}</span>
                      <span className="text-xs text-muted-foreground">{r.sublabel}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
      {/* Profile Drawer */}
      <Sheet open={showProfileDrawer} onOpenChange={setShowProfileDrawer}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Mon profil</SheetTitle>
            <SheetDescription>Informations de votre compte.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {user ? getInitials(user.name) : '??'}
              </div>
              <div>
                <p className="text-lg font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user ? ROLE_LABELS[user.role] : ''}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nom</span>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nom d'utilisateur</span>
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rôle</span>
                  <span className="text-sm font-medium">{user ? ROLE_LABELS[user.role] : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Statut de session</span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Active
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Permissions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {user?.permissions.map((p) => (
                    <span key={p} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                La modification du profil sera disponible avec l'authentification serveur.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
