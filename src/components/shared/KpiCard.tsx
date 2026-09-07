import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  iconBg?: string;
}

export function KpiCard({ label, value, icon: Icon, trend, trendLabel, iconBg }: KpiCardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          iconBg || 'bg-primary/10 text-primary'
        )}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold',
            isPositive ? 'text-success' : 'text-destructive'
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
