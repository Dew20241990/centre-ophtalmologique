import { Activity, Eye, Disc3, Layers, Stethoscope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpecialtyType } from '@/types/ophthalmology';

export const specialtyTabs: { id: SpecialtyType; label: string; icon: LucideIcon }[] = [
  { id: 'general', label: 'Examen général', icon: Eye },
  { id: 'glaucoma', label: 'Glaucome', icon: Activity },
  { id: 'cataract', label: 'Cataracte', icon: Disc3 },
  { id: 'retina', label: 'Rétine', icon: Eye },
  { id: 'cornea', label: 'Cornée', icon: Layers },
  { id: 'surgery', label: 'Chirurgie', icon: Stethoscope },
];

export function SpecialtyNavigation({
  active,
  onChange,
}: {
  active: SpecialtyType;
  onChange: (s: SpecialtyType) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
      {specialtyTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              active === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            <Icon className="h-3 w-3" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
