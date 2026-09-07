import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Plus, ChevronLeft, ChevronRight,
  CalendarDays, CalendarRange,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { mockAppointments } from '@/data/mockAppointments';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';

type ViewMode = 'day' | 'week' | 'month';

const hours = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function Appointments() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 4));

  const todayAppointments = useMemo(() => {
    const dateStr = currentDate.toISOString().split('T')[0];
    return mockAppointments.filter(a => a.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
  }, [currentDate]);

  const weekAppointments = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return weekDays.map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      return {
        day: d,
        appointments: mockAppointments.filter(a => a.date === dateStr).sort((a, b) => a.time.localeCompare(b.time)),
      };
    });
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const days: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [currentDate]);

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + direction);
    else if (view === 'week') newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const dateLabel = useMemo(() => {
    if (view === 'day') return currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (view === 'week') {
      const start = weekAppointments[0]?.day;
      const end = weekAppointments[6]?.day;
      if (start && end) return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [view, currentDate, weekAppointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('appointmentsTitle')}</h1>
          <p className="text-muted-foreground">{todayAppointments.length} rendez-vous · {dateLabel}</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('newAppointment')}
        </Button>
      </div>

      {/* View controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                view === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {mode === 'day' && <Calendar className="h-3.5 w-3.5" />}
              {mode === 'week' && <CalendarRange className="h-3.5 w-3.5" />}
              {mode === 'month' && <CalendarDays className="h-3.5 w-3.5" />}
              {mode === 'day' ? t('day') : mode === 'week' ? t('week') : t('month')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(2026, 8, 4))}>
            {t('today')}
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => navigateDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day View */}
      {view === 'day' && (
        <Card className="p-4">
          <div className="space-y-1">
            {hours.map((hour) => {
              const apt = todayAppointments.find(a => a.time.startsWith(hour.split(':')[0]));
              return (
                <div key={hour} className="flex gap-3 border-b border-border/40 pb-1 last:border-0">
                  <div className="w-16 shrink-0 pt-2 text-xs font-medium text-muted-foreground">{hour}</div>
                  <div className="flex-1 min-h-[48px] py-1">
                    {apt ? (
                      <div
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-all hover:shadow-soft',
                          apt.status === 'cancelled' ? 'border-destructive/20 bg-destructive/5' :
                          apt.status === 'consulted' ? 'border-success/20 bg-success/5' :
                          apt.status === 'confirmed' ? 'border-primary/20 bg-primary/5' :
                          'border-warning/20 bg-warning/5'
                        )}
                        onClick={() => navigate('/waiting-room')}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                          {apt.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{apt.patientName}</p>
                          <p className="text-xs text-muted-foreground truncate">{apt.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{apt.time}</span>
                          <StatusBadge status={apt.status} />
                        </div>
                      </div>
                    ) : (
                      <button className="flex h-10 w-full items-center justify-center rounded-lg border border-dashed border-border/40 text-xs text-muted-foreground/50 opacity-0 hover:opacity-100 transition-opacity">
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Week View */}
      {view === 'week' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map((day, i) => {
              const date = weekAppointments[i]?.day;
              const isToday = date?.toDateString() === new Date(2026, 8, 4).toDateString();
              return (
                <div key={day} className={cn('border-e border-border p-3 last:border-0', isToday && 'bg-primary/5')}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{day}</p>
                  <p className={cn('text-lg font-bold', isToday ? 'text-primary' : '')}>{date?.getDate()}</p>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7">
            {weekAppointments.map((dayData, i) => (
              <div key={i} className="border-e border-border min-h-[300px] p-2 last:border-0 space-y-1.5">
                {dayData.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={cn(
                      'rounded-lg border p-2 cursor-pointer transition-all hover:shadow-soft',
                      apt.status === 'cancelled' ? 'border-destructive/20 bg-destructive/5' :
                      apt.status === 'consulted' ? 'border-success/20 bg-success/5' :
                      apt.status === 'confirmed' ? 'border-primary/20 bg-primary/5' :
                      'border-warning/20 bg-warning/5'
                    )}
                    onClick={() => navigate('/waiting-room')}
                  >
                    <p className="text-[11px] font-medium text-muted-foreground">{apt.time}</p>
                    <p className="text-xs font-medium truncate">{apt.patientName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{apt.reason}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Month View */}
      {view === 'month' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map((date, i) => {
              const dateStr = date?.toISOString().split('T')[0];
              const dayApts = date ? mockAppointments.filter(a => a.date === dateStr) : [];
              const isToday = date?.toDateString() === new Date(2026, 8, 4).toDateString();
              return (
                <div
                  key={i}
                  className={cn(
                    'border-e border-b border-border min-h-[100px] p-2 last:border-0',
                    !date && 'bg-muted/20',
                    isToday && 'bg-primary/5'
                  )}
                >
                  {date && (
                    <>
                      <p className={cn('text-sm font-medium', isToday ? 'text-primary font-bold' : 'text-foreground')}>{date.getDate()}</p>
                      <div className="mt-1 space-y-0.5">
                        {dayApts.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className={cn(
                              'truncate rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer',
                              apt.status === 'consulted' ? 'bg-success/10 text-success' :
                              apt.status === 'confirmed' ? 'bg-primary/10 text-primary' :
                              apt.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                              'bg-warning/10 text-warning'
                            )}
                            onClick={() => navigate('/waiting-room')}
                          >
                            {apt.time} {apt.patientName}
                          </div>
                        ))}
                        {dayApts.length > 3 && (
                          <p className="text-[10px] text-muted-foreground px-1.5">+{dayApts.length - 3} autres</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
