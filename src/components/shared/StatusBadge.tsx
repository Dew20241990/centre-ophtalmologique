import { cn } from '@/lib/utils';
import { AppointmentStatus, WaitingStatus, PaymentStatus } from '@/types';

const appointmentStatusConfig: Record<AppointmentStatus, { label: string; className: string; dot: string }> = {
  pending: { label: 'En attente', className: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  confirmed: { label: 'Confirmé', className: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  consulted: { label: 'Consulté', className: 'bg-success/10 text-success', dot: 'bg-success' },
  cancelled: { label: 'Annulé', className: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  absent: { label: 'Absent', className: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
};

const waitingStatusConfig: Record<WaitingStatus, { label: string; className: string; dot: string }> = {
  waiting: { label: 'En attente', className: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  in_consultation: { label: 'En consultation', className: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  completed: { label: 'Terminé', className: 'bg-success/10 text-success', dot: 'bg-success' },
  absent: { label: 'Absent', className: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string; dot: string }> = {
  paid: { label: 'Payé', className: 'bg-success/10 text-success', dot: 'bg-success' },
  partial: { label: 'Partiel', className: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  unpaid: { label: 'Impayé', className: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
};

interface StatusBadgeProps {
  status: AppointmentStatus | WaitingStatus | PaymentStatus;
  type?: 'appointment' | 'waiting' | 'payment';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, type = 'appointment', size = 'sm' }: StatusBadgeProps) {
  const config = type === 'waiting'
    ? waitingStatusConfig[status as WaitingStatus]
    : type === 'payment'
    ? paymentStatusConfig[status as PaymentStatus]
    : appointmentStatusConfig[status as AppointmentStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
