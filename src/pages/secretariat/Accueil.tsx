import { useNavigate } from 'react-router-dom';
import { CalendarDays, Armchair, UserPlus, ClipboardList, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockAppointments } from '@/data/mockAppointments';

const today = new Date().toISOString().split('T')[0];
const todayAppointments = mockAppointments
  .filter((a) => a.date === today)
  .sort((a, b) => a.time.localeCompare(b.time));

export default function Accueil() {
  const navigate = useNavigate();

  const expected = todayAppointments.length;
  const consulted = todayAppointments.filter((a) => a.status === 'consulted').length;
  const waiting = todayAppointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accueil</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vue d'ensemble de la journée du centre.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expected}</p>
              <p className="text-xs text-muted-foreground">Rendez-vous aujourd'hui</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{consulted}</p>
              <p className="text-xs text-muted-foreground">Patients consultés</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Armchair className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{waiting}</p>
              <p className="text-xs text-muted-foreground">En attente</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate('/patients')}>
          <UserPlus className="mr-2 h-4 w-4" /> Nouveau patient
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>
          <CalendarDays className="mr-2 h-4 w-4" /> Rendez-vous
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/waiting-room')}>
          <Armchair className="mr-2 h-4 w-4" /> Salle d'attente
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/secretariat/dossiers')}>
          <ClipboardList className="mr-2 h-4 w-4" /> Dossiers
        </Button>
      </div>

      {/* Today's appointments */}
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Rendez-vous d'aujourd'hui</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>Voir tout</Button>
        </div>
        <div className="space-y-2">
          {todayAppointments.slice(0, 8).map((apt) => (
            <div key={apt.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{apt.patientName}</p>
                <p className="text-xs text-muted-foreground">{apt.time} · {apt.reason}</p>
              </div>
              <StatusBadge status={apt.status} />
            </div>
          ))}
          {todayAppointments.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucun rendez-vous aujourd'hui.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
