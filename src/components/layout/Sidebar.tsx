import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarDays, Armchair, Stethoscope, Microscope,
  Image, Pill, CreditCard, FolderOpen, BarChart3,
  ShieldCheck, ScrollText, Settings, Eye, ClipboardList, Phone,
  Bell, SlidersHorizontal, Building2, UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { ROLE_LABELS, hasPermission } from '@/auth/permissions';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  permission?: Parameters<typeof hasPermission>[1];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const medicalSections: NavSection[] = [
  {
    title: 'Principal',
    items: [{ to: '/medical', label: 'Tableau de bord médical', icon: LayoutDashboard }],
  },
  {
    title: 'Clinique',
    items: [
      { to: '/patients', label: 'Patients', icon: Users, permission: 'patients.read' },
      { to: '/consultations', label: 'Consultations', icon: Stethoscope, permission: 'consultations.read' },
      { to: '/examinations', label: 'Examen ophtalmologique', icon: Microscope, permission: 'clinical.read' },
      { to: '/prescriptions', label: 'Prescriptions', icon: Pill, permission: 'prescriptions.read' },
      { to: '/imaging', label: 'Imagerie', icon: Image, permission: 'imaging.read' },
      { to: '/documents', label: 'Documents médicaux', icon: FolderOpen, permission: 'clinical.read' },
    ],
  },
  {
    title: 'Organisation',
    items: [
      { to: '/appointments', label: 'Rendez-vous', icon: CalendarDays, permission: 'appointments.read' },
      { to: '/waiting-room', label: "Salle d'attente", icon: Armchair, permission: 'appointments.read' },
      { to: '/billing', label: 'Facturation', icon: CreditCard },
      { to: '/statistics', label: 'Statistiques', icon: BarChart3 },
    ],
  },
];

const secretariatSections: NavSection[] = [
  { title: 'Principal', items: [{ to: '/secretariat', label: 'Tableau de bord', icon: LayoutDashboard }] },
  {
    title: 'Accueil',
    items: [
      { to: '/patients', label: 'Patients', icon: Users, permission: 'patients.read' },
      { to: '/appointments', label: 'Rendez-vous', icon: CalendarDays, permission: 'appointments.read' },
      { to: '/waiting-room', label: "Salle d'attente", icon: Armchair, permission: 'appointments.read' },
      { to: '/secretariat/accueil', label: 'Accueil', icon: UserRound },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: '/secretariat/dossiers', label: 'Dossiers administratifs', icon: ClipboardList },
      { to: '/secretariat/documents', label: 'Documents administratifs', icon: FolderOpen },
      { to: '/secretariat/contacts', label: 'Contacts', icon: Phone },
      { to: '/secretariat/notifications', label: 'Notifications', icon: Bell },
    ],
  },
];

const administrationSections: NavSection[] = [
  { title: 'Principal', items: [{ to: '/administration', label: 'Tableau de bord', icon: LayoutDashboard }] },
  {
    title: 'Gestion du système',
    items: [
      { to: '/users', label: 'Utilisateurs', icon: Users, permission: 'users.read' },
      { to: '/administration/roles', label: 'Rôles & permissions', icon: ShieldCheck, permission: 'roles.manage' },
      { to: '/audit-logs', label: 'Journal d’audit', icon: ScrollText, permission: 'audit.read' },
      { to: '/statistics', label: 'Statistiques', icon: BarChart3 },
      { to: '/settings', label: 'Paramètres', icon: Settings, permission: 'settings.manage' },
      { to: '/administration/configuration', label: 'Configuration', icon: SlidersHorizontal, permission: 'settings.manage' },
      { to: '/administration/centre', label: 'Gestion du centre', icon: Building2, permission: 'settings.manage' },
    ],
  },
];

function getSections(role: 'medecin' | 'secretariat' | 'administration'): NavSection[] {
  if (role === 'secretariat') return secretariatSections;
  if (role === 'administration') return administrationSections;
  return medicalSections;
}

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const sections = user ? getSections(user.role) : [];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy-deep/40 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
          collapsed ? 'w-[76px]' : 'w-[264px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-4">
          {collapsed ? (
            <div className="flex w-full justify-center">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white"><Eye className="h-5 w-5" strokeWidth={2.2} /></div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-teal-light ring-2 ring-card" />
              </div>
            </div>
          ) : <Logo size="md" />}
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
          {sections.map((section) => {
            const visibleItems = section.items.filter((item) => !item.permission || (user && hasPermission(user, item.permission)));
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.title} className="mb-5">
                {!collapsed && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{section.title}</p>}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/'));
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onCloseMobile}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          collapsed && 'justify-center',
                          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        {isActive && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary" />}
                        <Icon className={cn('h-[18px] w-[18px] shrink-0 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} strokeWidth={2} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {!collapsed && user && (
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{ROLE_LABELS[user.role]}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
