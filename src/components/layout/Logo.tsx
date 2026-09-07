import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'h-9 w-9', text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'h-12 w-12', text: 'text-xl', sub: 'text-xs' },
  };
  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative">
        <div className={cn(
          'flex items-center justify-center rounded-lg bg-primary text-white shadow-soft',
          s.icon
        )}>
          <Eye className="h-1/2 w-1/2" strokeWidth={2.2} />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-teal-light ring-2 ring-background" />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn('font-bold tracking-tight', s.text)}>CENTRE OPHTALMOLOGIQUE</span>
          <span className={cn('text-muted-foreground font-medium', s.sub)}>Dr. Sabeg Ilias</span>
        </div>
      )}
    </div>
  );
}
