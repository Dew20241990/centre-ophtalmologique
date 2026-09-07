import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Check, UserX, Clock,
  User, ArrowRight,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import { WaitingStatus } from '@/types';

interface WaitingPatient {
  id: string;
  number: number;
  patientName: string;
  patientId: string;
  appointmentTime: string;
  reason: string;
  status: WaitingStatus;
  waitingMinutes: number;
}

const initialQueue: WaitingPatient[] = [
  { id: 'w-1', number: 1, patientName: 'Ahmed Benali', patientId: 'PAT-00001', appointmentTime: '08:00', reason: 'Baisse de vision', status: 'completed', waitingMinutes: 0 },
  { id: 'w-2', number: 2, patientName: 'Fatima Cherif', patientId: 'PAT-00002', appointmentTime: '08:30', reason: 'Suivi', status: 'completed', waitingMinutes: 0 },
  { id: 'w-3', number: 3, patientName: 'Karim Haddad', patientId: 'PAT-00003', appointmentTime: '09:00', reason: 'Douleur oculaire', status: 'in_consultation', waitingMinutes: 0 },
  { id: 'w-4', number: 4, patientName: 'Amina Bouzid', patientId: 'PAT-00004', appointmentTime: '09:30', reason: 'Contrôle', status: 'waiting', waitingMinutes: 15 },
  { id: 'w-5', number: 5, patientName: 'Yacine Mansouri', patientId: 'PAT-00005', appointmentTime: '10:00', reason: 'Rougeur', status: 'waiting', waitingMinutes: 10 },
  { id: 'w-6', number: 6, patientName: 'Nadia Saadi', patientId: 'PAT-00006', appointmentTime: '10:30', reason: 'Céphalées', status: 'waiting', waitingMinutes: 5 },
  { id: 'w-7', number: 7, patientName: 'Rachid Belkacem', patientId: 'PAT-00007', appointmentTime: '11:00', reason: 'Suivi post-op', status: 'waiting', waitingMinutes: 2 },
  { id: 'w-8', number: 8, patientName: 'Samira Khelifi', patientId: 'PAT-00008', appointmentTime: '11:30', reason: 'Consultation', status: 'absent', waitingMinutes: 0 },
];

export default function WaitingRoom() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<WaitingPatient[]>(initialQueue);

  const updateStatus = (id: string, status: WaitingStatus) => {
    setQueue(queue.map(p => p.id === id ? { ...p, status } : p));
  };

  const stats = {
    waiting: queue.filter(p => p.status === 'waiting').length,
    inConsultation: queue.filter(p => p.status === 'in_consultation').length,
    completed: queue.filter(p => p.status === 'completed').length,
    absent: queue.filter(p => p.status === 'absent').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('waitingRoomTitle')}</h1>
          <p className="text-muted-foreground">{queue.length} patients · {stats.waiting} en attente</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.waiting}</p>
              <p className="text-xs text-muted-foreground">{t('waiting')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inConsultation}</p>
              <p className="text-xs text-muted-foreground">{t('inConsultation')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">{t('completed')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <UserX className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.absent}</p>
              <p className="text-xs text-muted-foreground">{t('absent')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Queue */}
      <div className="space-y-3">
        {queue.map((patient) => (
          <Card
            key={patient.id}
            className={cn(
              'p-4 transition-all',
              patient.status === 'in_consultation' && 'border-primary/30 shadow-glow',
              patient.status === 'completed' && 'opacity-60',
              patient.status === 'absent' && 'opacity-50'
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Patient info */}
              <div className="flex items-center gap-3">
                {/* Queue number */}
                <div className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
                  patient.status === 'in_consultation' ? 'bg-primary text-primary-foreground' :
                  patient.status === 'completed' ? 'bg-success/10 text-success' :
                  patient.status === 'absent' ? 'bg-muted text-muted-foreground' :
                  'bg-primary/10 text-primary'
                )}>
                  {patient.number}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{patient.patientName}</p>
                  <p className="text-xs text-muted-foreground">{patient.patientId} · {patient.appointmentTime}</p>
                </div>
              </div>

              {/* Reason + waiting time */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <p className="text-xs text-muted-foreground">{t('reason')}</p>
                  <p className="text-sm font-medium">{patient.reason}</p>
                </div>
                {patient.status === 'waiting' && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-warning" />
                    <span className="font-medium text-warning">{patient.waitingMinutes} min</span>
                  </div>
                )}
                <StatusBadge status={patient.status} type="waiting" size="md" />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {patient.status === 'waiting' && (
                  <>
                    <Button size="sm" className="gap-1.5" onClick={() => updateStatus(patient.id, 'in_consultation')}>
                      <Stethoscope className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t('startConsultation')}</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => updateStatus(patient.id, 'absent')}>
                      <UserX className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t('markAbsent')}</span>
                    </Button>
                  </>
                )}
                {patient.status === 'in_consultation' && (
                  <>
                    <Button size="sm" className="gap-1.5" onClick={() => navigate('/consultation')}>
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t('consultationWorkspace')}</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => updateStatus(patient.id, 'completed')}>
                      <Check className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t('complete')}</span>
                    </Button>
                  </>
                )}
                {patient.status === 'completed' && (
                  <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => navigate('/consultation')}>
                    <User className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t('view')}</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
