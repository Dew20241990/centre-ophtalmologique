import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EyeSide } from '@/types';

interface EyeBadgeProps {
  side: EyeSide;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EyeBadge({ side, size = 'md', className }: EyeBadgeProps) {
  const sizes = {
    sm: { box: 'h-6 px-2 text-[11px]', icon: 'h-3 w-3' },
    md: { box: 'h-7 px-2.5 text-xs', icon: 'h-3.5 w-3.5' },
    lg: { box: 'h-9 px-3 text-sm', icon: 'h-4 w-4' },
  };
  const s = sizes[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-bold',
        side === 'OD'
          ? 'bg-primary/10 text-primary'
          : 'bg-accent/10 text-accent',
        s.box,
        className,
      )}
    >
      <Eye className={s.icon} strokeWidth={2.5} />
      {side}
    </span>
  );
}

interface DualEyeFieldProps {
  label?: string;
  children: (side: EyeSide) => React.ReactNode;
  className?: string;
}

export function DualEyeField({ label, children, className }: DualEyeFieldProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <EyeBadge side="OD" size="sm" />
          {children('OD')}
        </div>
        <div className="space-y-2">
          <EyeBadge side="OG" size="sm" />
          {children('OG')}
        </div>
      </div>
    </div>
  );
}
