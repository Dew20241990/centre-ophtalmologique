import { useState } from 'react';
import { Check, X, Circle, ChevronDown, Copy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { EyeBadge } from '@/components/shared/EyeBadge';
import { cn } from '@/lib/utils';
import type { EyeSide, ExamStatus } from '@/types';

// ── ExamStatusButton ──────────────────────────────────────────────────────────

export function ExamStatusButton({ status, selected, onClick }: { status: ExamStatus; selected: boolean; onClick: () => void }) {
  const config: Record<ExamStatus, { label: string; icon: typeof Check; cls: string }> = {
    normal: { label: 'N', icon: Check, cls: 'bg-success/10 text-success border-success/30' },
    abnormal: { label: 'A', icon: X, cls: 'bg-destructive/10 text-destructive border-destructive/30' },
    not_examined: { label: '—', icon: Circle, cls: 'bg-muted text-muted-foreground border-border' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={-1}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-bold transition-all',
        selected ? c.cls : 'border-border text-muted-foreground hover:bg-muted'
      )}
      title={status === 'normal' ? 'Normal' : status === 'abnormal' ? 'Anormal' : 'Non examiné'}
    >
      <Icon className="h-3 w-3" />
    </button>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────

export function SectionHeader({ icon: Icon, title, id, accent, action }: { icon: LucideIcon; title: string; id: string; accent?: string; action?: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-20 flex items-center justify-between border-b border-border pb-2 mb-3">
      <div className="flex items-center gap-2.5">
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', accent || 'bg-primary/10 text-primary')}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
      </div>
      {action}
    </div>
  );
}

// ── EyeColumn ─────────────────────────────────────────────────────────────────

export function EyeColumn({ side, children }: { side: EyeSide; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <EyeBadge side={side} size="sm" />
      {children}
    </div>
  );
}

// ── CompactField ──────────────────────────────────────────────────────────────

export function CompactField({ label, placeholder, value, onChange, type = 'text', width }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void; type?: string; width?: string }) {
  return (
    <div style={width ? { width } : undefined}>
      <Label className="text-[10px] font-medium text-muted-foreground">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-7 text-xs tabular-nums"
      />
    </div>
  );
}

// ── FieldGrid ─────────────────────────────────────────────────────────────────

export function FieldGrid({ fields }: { fields: { key: string; label: string; placeholder: string }[] }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {fields.map((field) => (
        <div key={field.key}>
          <Label className="text-[10px] font-medium text-muted-foreground">{field.label}</Label>
          <Input placeholder={field.placeholder} className="h-7 text-xs tabular-nums" />
        </div>
      ))}
    </div>
  );
}

// ── CollapsibleSection ────────────────────────────────────────────────────────

export function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: LucideIcon; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <button type="button" className="flex w-full items-center justify-between p-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold">{title}</span>
            </div>
            <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border p-3.5">{children}</div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ── SegmentExamRow ────────────────────────────────────────────────────────────

export function SegmentExamRow({
  label, eyeStatuses, onStatusChange, hasNotes = false,
}: {
  label: string;
  eyeStatuses: { OD: ExamStatus; OG: ExamStatus };
  onStatusChange: (eye: EyeSide, status: ExamStatus) => void;
  hasNotes?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg hover:bg-muted/30 p-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-3">
        {(['OD', 'OG'] as EyeSide[]).map((eye) => (
          <div key={eye} className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground w-5">{eye}</span>
            {(['normal', 'abnormal', 'not_examined'] as ExamStatus[]).map((st) => (
              <ExamStatusButton
                key={st}
                status={st}
                selected={eyeStatuses[eye] === st}
                onClick={() => onStatusChange(eye, st)}
              />
            ))}
          </div>
        ))}
        {hasNotes && <Input placeholder="Notes..." className="h-7 w-24 text-xs" />}
      </div>
    </div>
  );
}

// ── CopyButton ────────────────────────────────────────────────────────────────

export function CopyButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handle}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
    >
      <Copy className="h-3 w-3" />
      {copied ? 'Copié' : label}
    </button>
  );
}
