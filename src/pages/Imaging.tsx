import { useState, useMemo } from 'react';
import {
  Image as ImageIcon, ZoomIn, GitCompare, Printer,
  Download, RotateCw, Maximize2, Eye, FileText,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { mockImagingRecords } from '@/data/mockImagingData';
import { mockPatients } from '@/data/mockPatients';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { EyeBadge } from '@/components/shared/EyeBadge';
import { cn } from '@/lib/utils';
import type { OphthalmicImaging, ImagingExamType, EyeSide, Attachment } from '@/types';

// ── Static config ────────────────────────────────────────────────────────────

const examTypeLabels: Record<ImagingExamType, string> = {
  OCT: 'OCT',
  'OCT-A': 'OCT-A',
  retinographie: 'Rétinographie',
  champ_visuel: 'Champ visuel',
  topographie_corneenne: 'Topographie cornéenne',
  tomographie_corneenne: 'Tomographie cornéenne',
  biometrie: 'Biométrie',
  pachymetrie: 'Pachymétrie',
  echographie_bscan: 'Échographie B-scan',
  angiographie_fluoresceine: 'Angiographie fluorescéine',
  ICG: 'ICG',
  autre: 'Autre',
};

const examTypeIcons: Record<ImagingExamType, LucideIcon> = {
  OCT: Eye,
  'OCT-A': Eye,
  retinographie: ImageIcon,
  champ_visuel: Eye,
  topographie_corneenne: Eye,
  tomographie_corneenne: Eye,
  biometrie: Eye,
  pachymetrie: Eye,
  echographie_bscan: Eye,
  angiographie_fluoresceine: Eye,
  ICG: Eye,
  autre: FileText,
};

const examTypeColors: Record<ImagingExamType, string> = {
  OCT: 'bg-primary/10 text-primary',
  'OCT-A': 'bg-primary/10 text-primary',
  retinographie: 'bg-accent/10 text-accent',
  champ_visuel: 'bg-warning/10 text-warning',
  topographie_corneenne: 'bg-chart-5/10 text-chart-5',
  tomographie_corneenne: 'bg-chart-5/10 text-chart-5',
  biometrie: 'bg-success/10 text-success',
  pachymetrie: 'bg-success/10 text-success',
  echographie_bscan: 'bg-muted text-muted-foreground',
  angiographie_fluoresceine: 'bg-destructive/10 text-destructive',
  ICG: 'bg-destructive/10 text-destructive',
  autre: 'bg-muted text-muted-foreground',
};

const allExamTypes = Object.keys(examTypeLabels) as ImagingExamType[];

// ── Sub-components ───────────────────────────────────────────────────────────

function AttachmentChip({ att }: { att: Attachment }) {
  const Icon = att.fileType === 'pdf' ? FileText : ImageIcon;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/60 p-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{att.fileName}</p>
        <p className="text-[10px] text-muted-foreground">{att.fileType.toUpperCase()} · {att.fileSize}</p>
      </div>
      {att.hasPreview && <Badge variant="outline" className="text-[9px]">Aperçu</Badge>}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function Imaging() {
  const { t } = useI18n();
  const patient = mockPatients[0];
  const records = mockImagingRecords;

  const [selected, setSelected] = useState<OphthalmicImaging | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ImagingExamType | 'all'>('all');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const filtered = useMemo(() => {
    let result = records;
    if (typeFilter !== 'all') result = result.filter(r => r.examType === typeFilter);
    return [...result].sort((a, b) => b.date.localeCompare(a.date));
  }, [records, typeFilter]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const openCompare = () => {
    if (compareIds.length === 2) setShowCompareDialog(true);
  };

  const resetViewer = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('imagingRecords')}</h1>
          <p className="text-muted-foreground">{patient.firstName} {patient.lastName} · {patient.patientId} · {filtered.length} examen(s)</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2', compareMode && 'border-primary text-primary')}
            onClick={() => { setCompareMode(!compareMode); setCompareIds([]); }}
          >
            <GitCompare className="h-4 w-4" />
            {compareMode ? 'Mode normal' : t('comparePrevious')}
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
            {t('addImaging')}
          </Button>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setTypeFilter('all')}
          className={cn(
            'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
            typeFilter === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
          )}
        >
          {t('allTypes')}
        </button>
        {allExamTypes.map((et) => (
          <button
            key={et}
            onClick={() => setTypeFilter(et)}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
              typeFilter === et ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
            )}
          >
            {examTypeLabels[et]}
          </button>
        ))}
      </div>

      {/* Examination history table */}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('date')}</th>
              <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('examType')}</th>
              <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('eye')}</th>
              <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('device')}</th>
              <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('indication')}</th>
              <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('conclusion')}</th>
              <th className="px-3 py-2 text-end text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const Icon = examTypeIcons[r.examType];
              return (
                <tr
                  key={r.id}
                  className={cn(
                    'border-b border-border/40 transition-colors hover:bg-muted/20 cursor-pointer',
                    compareMode && compareIds.includes(r.id) && 'bg-primary/5'
                  )}
                  onClick={() => !compareMode && setSelected(r)}
                >
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.date} {r.time}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', examTypeColors[r.examType])}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="font-medium">{examTypeLabels[r.examType]}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {r.eye === 'OU' ? <span className="text-xs font-bold">OU</span> : <EyeBadge side={r.eye as EyeSide} size="sm" />}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{r.device}</td>
                  <td className="px-3 py-2 text-muted-foreground max-w-[150px] truncate">{r.indication}</td>
                  <td className="px-3 py-2 max-w-[200px] truncate">{r.conclusion}</td>
                  <td className="px-3 py-2 text-end" onClick={(e) => e.stopPropagation()}>
                    {compareMode ? (
                      <button
                        onClick={() => toggleCompare(r.id)}
                        className={cn(
                          'rounded-md border px-2 py-1 text-xs font-medium transition-all',
                          compareIds.includes(r.id) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {compareIds.includes(r.id) ? '✓ Sélectionné' : 'Sélectionner'}
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setSelected(r)}>
                          <Eye className="h-3.5 w-3.5" /> {t('view')}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={t('print')}>
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Compare action bar */}
      {compareMode && compareIds.length === 2 && (
        <div className="flex justify-center">
          <Button size="sm" className="gap-2" onClick={openCompare}>
            <GitCompare className="h-4 w-4" />
            Comparer les {compareIds.length} examens sélectionnés
          </Button>
        </div>
      )}

      {/* ── Detail / Viewer Dialog ──────────────────────────────────────────── */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); resetViewer(); } }}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = examTypeIcons[selected.examType];
                    return <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', examTypeColors[selected.examType])}><Icon className="h-3.5 w-3.5" /></div>;
                  })()}
                  {examTypeLabels[selected.examType]} — {selected.eye}
                </DialogTitle>
                <DialogDescription>{selected.patientName} · {selected.date} à {selected.time} · {selected.device}</DialogDescription>
              </DialogHeader>

              {/* Image viewer area */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-center overflow-hidden" style={{ height: '300px' }}>
                  <div
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <ImageIcon className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                </div>
                {/* Viewer toolbar */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
                    <ZoomIn className="h-3 w-3 rotate-90" /> -
                  </Button>
                  <span className="text-xs text-muted-foreground tabular-nums w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
                    <ZoomIn className="h-3 w-3" /> +
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setRotation(r => r + 90)}>
                    <RotateCw className="h-3 w-3" /> {t('rotate')}
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={resetViewer}>
                    <Maximize2 className="h-3 w-3" /> {t('fullscreen')}
                  </Button>
                </div>
              </div>

              {/* Clinical details */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">{t('indication')}</Label>
                  <p className="text-sm">{selected.indication}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('device')}</Label>
                  <p className="text-sm">{selected.device}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('result')}</Label>
                  <p className="text-sm">{selected.result}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('interpretation')}</Label>
                  <p className="text-sm">{selected.interpretation}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">{t('conclusion')}</Label>
                  <p className="text-sm font-medium">{selected.conclusion}</p>
                </div>
                {selected.notes && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
                    <p className="text-sm text-muted-foreground">{selected.notes}</p>
                  </div>
                )}
              </div>

              {/* Attachments */}
              {selected.attachments.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">{t('attachments')}</Label>
                  <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {selected.attachments.map((att) => (
                      <AttachmentChip key={att.id} att={att} />
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" /> {t('print')}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> {t('download')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Compare Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              {t('comparePrevious')}
            </DialogTitle>
            <DialogDescription>{patient.firstName} {patient.lastName}</DialogDescription>
          </DialogHeader>
          {(() => {
            const [id1, id2] = compareIds;
            const r1 = records.find(r => r.id === id1);
            const r2 = records.find(r => r.id === id2);
            if (!r1 || !r2) return null;
            return (
              <div className="grid grid-cols-2 gap-4">
                {[r2, r1].map((r, i) => {
                  const Icon = examTypeIcons[r.examType];
                  return (
                    <div key={r.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {i === 0 ? t('previous') : t('current')}
                        </span>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', examTypeColors[r.examType])}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{examTypeLabels[r.examType]}</span>
                        {r.eye !== 'OU' && <EyeBadge side={r.eye as EyeSide} size="sm" />}
                      </div>
                      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <div className="space-y-1 text-xs">
                        <p><span className="text-muted-foreground">{t('indication')}: </span>{r.indication}</p>
                        <p><span className="text-muted-foreground">{t('conclusion')}: </span><span className="font-medium">{r.conclusion}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-bold text-muted-foreground">VS</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Imaging Dialog ─────────────────────────────────────────────── */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('addImaging')}
            </DialogTitle>
            <DialogDescription>{patient.firstName} {patient.lastName} · {patient.patientId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">{t('examType')}</Label>
                <select className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-1.5 text-sm">
                  {allExamTypes.map(et => <option key={et} value={et}>{examTypeLabels[et]}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('eye')}</Label>
                <div className="mt-1 flex gap-1">
                  {(['OD', 'OG', 'OU'] as const).map(e => (
                    <button key={e} type="button" className="rounded-md border border-border px-3 py-1 text-xs font-bold hover:bg-muted">
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('date')}</Label>
                <Input type="date" className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('time')}</Label>
                <Input type="time" className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('device')}</Label>
                <Input placeholder="OCT Cirrus 6000..." className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('indication')}</Label>
                <Input placeholder="Indication..." className="mt-1 h-8 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('result')}</Label>
              <Textarea placeholder="Résultat de l'examen..." rows={2} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('interpretation')}</Label>
              <Textarea placeholder="Interprétation clinique..." rows={2} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('conclusion')}</Label>
              <Input placeholder="Conclusion..." className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
              <Input placeholder="Notes..." className="mt-1 h-8 text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>{t('cancel')}</Button>
            <Button onClick={() => setShowAddDialog(false)}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
