import { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockNotifications } from '@/data/mockClinical';

const typeConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  appointment: { icon: Clock, color: 'text-primary', label: 'Rendez-vous' },
  waiting: { icon: AlertCircle, color: 'text-amber-600', label: 'Salle d\'attente' },
  payment: { icon: AlertCircle, color: 'text-destructive', label: 'Paiement' },
  follow_up: { icon: CheckCircle2, color: 'text-green-600', label: 'Suivi' },
  system: { icon: Info, color: 'text-muted-foreground', label: 'Système' },
};

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filtered = mockNotifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Rappels et notifications administratives.</p>
        </div>
        {unreadCount > 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {unreadCount} non lue(s)
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Toutes' : f === 'unread' ? 'Non lues' : 'Lues'}
          </Button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.map((n) => {
          const config = typeConfig[n.type] || typeConfig.system;
          const Icon = config.icon;
          return (
            <Card
              key={n.id}
              className={`flex items-start gap-3 p-4 transition-colors ${!n.read ? 'border-primary/20 bg-primary/5' : ''}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted ${config.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {config.label}
                </span>
              </div>
              {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune notification.</p>
        )}
      </div>
    </div>
  );
}
