import { useState, useCallback } from 'react';
import {
  Pill, Search, Plus, Trash2, Printer, ArrowLeft,
  Eye, Glasses, Contact, History, Check, FileCheck,
  Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nContext';
import { mockMedications } from '@/data/mockMedications';
import { mockPatients } from '@/data/mockPatients';
import { mockPrescriptions } from '@/data/mockClinical';
import {
  mockGlassesPrescriptions, mockContactLensPrescriptions,
  mockPrescriptionHistory, emptyGlassesEye, emptyContactEye,
} from '@/data/mockPrescriptionData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { EyeBadge } from '@/components/shared/EyeBadge';
import { CopyButton } from '@/components/shared/exam/ExamParts';
import { GlassesPrintPreview, ContactLensPrintPreview } from '@/components/shared/exam/PrintPreview';
import { cn } from '@/lib/utils';
import type {
  PrescriptionItem, GlassesType, ContactLensType,
  GlassesPrescription, ContactLensPrescription,
  PrescriptionHistoryEntry, PrescriptionStatus,
} from '@/types';

// ── Static data ──────────────────────────────────────────────────────────────

const glassesTypes: { key: GlassesType; label: string }[] = [
  { key: 'loin', label: 'Vision de loin' },
  { key: 'pres', label: 'Vision de près' },
  { key: 'intermediaire', label: 'Vision intermédiaire' },
  { key: 'progressive', label: 'Progressive' },
  { key: 'bifocale', label: 'Bifocale' },
  { key: 'anti_fatigue', label: 'Anti-fatigue' },
  { key: 'autre', label: 'Autre' },
];

const contactLensTypes: { key: ContactLensType; label: string }[] = [
  { key: 'spherique', label: 'Sphérique' },
  { key: 'torique', label: 'Torique' },
  { key: 'multifocale', label: 'Multifocale' },
  { key: 'rgp', label: 'RGP' },
  { key: 'autre', label: 'Autre' },
];

const statusConfig: Record<PrescriptionStatus, { label: string; cls: string; icon: LucideIcon }> = {
  brouillon: { label: 'Brouillon', cls: 'bg-muted text-muted-foreground border-border', icon: Pill },
  validee: { label: 'Validée', cls: 'bg-success/10 text-success border-success/30', icon: Check },
  imprimee: { label: 'Imprimée', cls: 'bg-primary/10 text-primary border-primary/30', icon: Printer },
};

// ── Helper: CompactField ──────────────────────────────────────────────────────

function RxField({ label, placeholder, value, onChange, disabled }: { label: string; placeholder?: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <Label className="text-[10px] font-medium text-muted-foreground">{label}</Label>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-7 text-xs tabular-nums"
      />
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PrescriptionStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium', cfg.cls)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function Prescriptions() {
  const { t } = useI18n();
  const patient = mockPatients[0];
  const patientAge = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();

  const [view, setView] = useState<'list' | 'glasses' | 'contactLens' | 'medications'>('list');

  // ── Medication prescription state ──────────────────────────────────────────
  const [medItems, setMedItems] = useState<PrescriptionItem[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showFreeForm, setShowFreeForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [freeTextItem, setFreeTextItem] = useState<Partial<PrescriptionItem>>({});

  // ── Glasses prescription state ──────────────────────────────────────────────
  const [glassesRx, setGlassesRx] = useState<GlassesPrescription>({
    id: 'gp-new',
    prescriptionId: 'LUN-2026-0003',
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: new Date().toISOString().split('T')[0],
    type: 'progressive',
    OD: { ...emptyGlassesEye },
    OG: { ...emptyGlassesEye },
    pd: '', pdMonoOD: '', pdMonoOG: '', pdNear: '',
    heightOD: '', heightOG: '',
    lensType: '', material: '', index: '', design: '', treatments: '', options: '', notes: '',
    status: 'brouillon',
  });

  // ── Contact lens prescription state ───────────────────────────────────────────
  const [contactLensRx, setContactLensRx] = useState<ContactLensPrescription>({
    id: 'clp-new',
    prescriptionId: 'LEN-2026-0002',
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctorId: 'u-1',
    doctorName: 'Dr. Sabeg Ilias',
    date: new Date().toISOString().split('T')[0],
    type: 'spherique',
    OD: { ...emptyContactEye },
    OG: { ...emptyContactEye },
    trialLens: '', overRefraction: '', movement: '', centration: '',
    comfort: '', tearFilm: '', wearingTime: '', finalLens: '', followUp: '', notes: '',
    status: 'brouillon',
  });

  // ── Show comparison / print ───────────────────────────────────────────────────
  const [showComparison, setShowComparison] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showValidateDialog, setShowValidateDialog] = useState(false);

  // ── Mock final refraction (for copy) ──────────────────────────────────────────
  const finalRefraction = {
    OD: { sph: '-2.50', cyl: '-0.75', axis: '90', add: '+2.00', prisme: '', base: '', va: '10/10', pd: '63', pdMono: '31.5' },
    OG: { sph: '-3.00', cyl: '-1.00', axis: '85', add: '+2.00', prisme: '', base: '', va: '10/10', pd: '63', pdMono: '31.5' },
  };

  // ── Copy refraction to glasses ────────────────────────────────────────────────
  const copyRefractionToGlasses = useCallback(() => {
    setGlassesRx(prev => ({
      ...prev,
      OD: { ...prev.OD, sph: finalRefraction.OD.sph, cyl: finalRefraction.OD.cyl, axis: finalRefraction.OD.axis, add: finalRefraction.OD.add, prisme: finalRefraction.OD.prisme, base: finalRefraction.OD.base, va: finalRefraction.OD.va },
      OG: { ...prev.OG, sph: finalRefraction.OG.sph, cyl: finalRefraction.OG.cyl, axis: finalRefraction.OG.axis, add: finalRefraction.OG.add, prisme: finalRefraction.OG.prisme, base: finalRefraction.OG.base, va: finalRefraction.OG.va },
      pd: finalRefraction.OD.pd,
      pdMonoOD: finalRefraction.OD.pdMono,
      pdMonoOG: finalRefraction.OG.pdMono,
    }));
    toast.success(t('copiedFromRefraction'));
  }, [t]);

  // ── Copy refraction to contact lens ───────────────────────────────────────────
  const copyRefractionToContactLens = useCallback(() => {
    setContactLensRx(prev => ({
      ...prev,
      OD: { ...prev.OD, power: finalRefraction.OD.sph, cyl: finalRefraction.OD.cyl, axis: finalRefraction.OD.axis, add: finalRefraction.OD.add },
      OG: { ...prev.OG, power: finalRefraction.OG.sph, cyl: finalRefraction.OG.cyl, axis: finalRefraction.OG.axis, add: finalRefraction.OG.add },
    }));
    toast.success(t('copiedFromRefraction'));
  }, [t]);

  // ── Validate prescription ────────────────────────────────────────────────────
  const validateGlasses = () => {
    setGlassesRx(prev => ({ ...prev, status: 'validee' }));
    setShowValidateDialog(false);
    toast.success(t('prescriptionValidated'));
  };

  const validateContactLens = () => {
    setContactLensRx(prev => ({ ...prev, status: 'validee' }));
    setShowValidateDialog(false);
    toast.success(t('prescriptionValidated'));
  };

  const markPrinted = (which: 'glasses' | 'contactLens') => {
    if (which === 'glasses') {
      setGlassesRx(prev => ({ ...prev, status: 'imprimee' }));
    } else {
      setContactLensRx(prev => ({ ...prev, status: 'imprimee' }));
    }
    toast.success(t('prescriptionPrinted'));
  };

  // ── Reuse from history ────────────────────────────────────────────────────────
  const reuseHistory = (entry: PrescriptionHistoryEntry) => {
    if (entry.type === 'lunettes') {
      const source = mockGlassesPrescriptions.find(g => g.prescriptionId === entry.prescriptionId);
      if (source) {
        setGlassesRx(prev => ({
          ...prev,
          type: source.type,
          OD: { ...source.OD },
          OG: { ...source.OG },
          pd: source.pd, pdMonoOD: source.pdMonoOD, pdMonoOG: source.pdMonoOG, pdNear: source.pdNear,
          heightOD: source.heightOD, heightOG: source.heightOG,
          lensType: source.lensType, material: source.material, index: source.index,
          design: source.design, treatments: source.treatments, options: source.options,
          notes: source.notes || '', status: 'brouillon',
        }));
        setView('glasses');
        toast.success('Prescription réutilisée');
      }
    } else if (entry.type === 'lentilles') {
      const source = mockContactLensPrescriptions.find(c => c.prescriptionId === entry.prescriptionId);
      if (source) {
        setContactLensRx(prev => ({
          ...prev,
          type: source.type,
          OD: { ...source.OD },
          OG: { ...source.OG },
          trialLens: source.trialLens, overRefraction: source.overRefraction,
          movement: source.movement, centration: source.centration,
          comfort: source.comfort, tearFilm: source.tearFilm,
          wearingTime: source.wearingTime, finalLens: source.finalLens,
          followUp: source.followUp, notes: source.notes || '', status: 'brouillon',
        }));
        setView('contactLens');
        toast.success('Prescription réutilisée');
      }
    }
  };

  // ── Medication helpers ────────────────────────────────────────────────────────
  const filteredMeds = mockMedications.filter(m =>
    m.commercialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.dci.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.dosage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addMedication = (med: typeof mockMedications[0]) => {
    const newItem: PrescriptionItem = {
      id: `pi-${Date.now()}`,
      medicationName: med.commercialName,
      dci: med.dci,
      dosage: med.dosage,
      form: med.form,
      posology: '1 goutte',
      frequency: '2 fois / jour',
      duration: '7 jours',
      route: 'Voie ophtalmique',
      instructions: '',
      isFreeText: false,
    };
    setMedItems([...medItems, newItem]);
    setShowSearch(false);
    setSearchQuery('');
  };

  const addFreeText = () => {
    if (!freeTextItem.medicationName) return;
    const newItem: PrescriptionItem = {
      id: `pi-${Date.now()}`,
      medicationName: freeTextItem.medicationName || '',
      dosage: freeTextItem.dosage || '',
      form: freeTextItem.form || '',
      posology: freeTextItem.posology || '',
      frequency: freeTextItem.frequency || '',
      duration: freeTextItem.duration || '',
      route: 'Voie ophtalmique',
      instructions: freeTextItem.instructions || '',
      isFreeText: true,
    };
    setMedItems([...medItems, newItem]);
    setShowFreeForm(false);
    setFreeTextItem({});
  };

  const removeMedItem = (id: string) => {
    setMedItems(medItems.filter(i => i.id !== id));
  };

  // ── Update helpers ────────────────────────────────────────────────────────────
  const updateGlassesEye = (side: 'OD' | 'OG', field: string, value: string) => {
    setGlassesRx(prev => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  };

  const updateContactLensEye = (side: 'OD' | 'OG', field: string, value: string) => {
    setContactLensRx(prev => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  };

  const isGlassesLocked = glassesRx.status === 'validee' || glassesRx.status === 'imprimee';
  const isContactLensLocked = contactLensRx.status === 'validee' || contactLensRx.status === 'imprimee';

  // ═══ LIST VIEW ══════════════════════════════════════════════════════════════
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('prescriptions')}</h1>
            <p className="text-muted-foreground">{mockPrescriptions.length} ordonnances · {mockGlassesPrescriptions.length} lunettes · {mockContactLensPrescriptions.length} lentilles</p>
          </div>
        </div>

        {/* Prescription type cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          <button onClick={() => setView('glasses')} className="text-start">
            <Card className="p-4 transition-all hover:shadow-card hover:border-primary/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Glasses className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{t('glassesRx')}</p>
                  <p className="text-xs text-muted-foreground">Prescription de lunettes</p>
                </div>
              </div>
            </Card>
          </button>
          <button onClick={() => setView('contactLens')} className="text-start">
            <Card className="p-4 transition-all hover:shadow-card hover:border-accent/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Contact className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{t('contactLensRx')}</p>
                  <p className="text-xs text-muted-foreground">Lentilles de contact</p>
                </div>
              </div>
            </Card>
          </button>
          <button onClick={() => setView('medications')} className="text-start">
            <Card className="p-4 transition-all hover:shadow-card hover:border-success/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{t('medicationRx')}</p>
                  <p className="text-xs text-muted-foreground">Ordonnance médicale</p>
                </div>
              </div>
            </Card>
          </button>
        </div>

        {/* Prescription history */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold tracking-tight">{t('prescriptionHistory')}</h2>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowComparison(true)}>
              <History className="h-4 w-4" />
              {t('compare')}
            </Button>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('date')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('prescriptionType')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">OD</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">OG</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">ADD</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">PD</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('doctor')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('prescriptionStatus')}</th>
                  <th className="px-3 py-2 text-end text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {mockPrescriptionHistory.map((h) => (
                  <tr key={h.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-3 py-2 text-muted-foreground">{h.date}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        {h.type === 'lunettes' && <Glasses className="h-3.5 w-3.5 text-primary" />}
                        {h.type === 'lentilles' && <Contact className="h-3.5 w-3.5 text-accent" />}
                        {h.type === 'medicaments' && <Pill className="h-3.5 w-3.5 text-success" />}
                        <span className="font-medium">{h.subType}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{h.OD || '—'}</td>
                    <td className="px-3 py-2 tabular-nums">{h.OG || '—'}</td>
                    <td className="px-3 py-2 tabular-nums">{h.add || '—'}</td>
                    <td className="px-3 py-2 tabular-nums">{h.pd || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{h.doctor}</td>
                    <td className="px-3 py-2"><StatusBadge status={h.status} /></td>
                    <td className="px-3 py-2 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => reuseHistory(h)}>
                          {t('reuse')}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={t('print')}>
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Comparison dialog */}
        <Dialog open={showComparison} onOpenChange={setShowComparison}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-4 w-4" />
                {t('compare')} — {t('prescriptionHistory')}
              </DialogTitle>
              <DialogDescription>{patient.firstName} {patient.lastName} · {patient.patientId}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {mockPrescriptionHistory.filter(h => h.type === 'lunettes').map((h, i, arr) => {
                const next = arr[i + 1];
                if (!next) return null;
                return (
                  <div key={h.id} className="rounded-lg border border-border/60 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {next.date} → {h.date}
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground">{t('previous')} ({next.date})</p>
                        <p className="font-medium tabular-nums">OD: {next.OD}</p>
                        <p className="font-medium tabular-nums">OG: {next.OG}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground">{t('current')} ({h.date})</p>
                        <p className="font-medium tabular-nums">OD: {h.OD}</p>
                        <p className="font-medium tabular-nums">OG: {h.OG}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground">{t('evolution')}</p>
                        <p className="text-xs text-success">OD: {next.OD === h.OD ? t('noChange') : t('improved')}</p>
                        <p className="text-xs text-success">OG: {next.OG === h.OG ? t('noChange') : t('improved')}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ═══ GLASSES PRESCRIPTION VIEW ═══════════════════════════════════════════════
  if (view === 'glasses') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('glassesRx')}</h1>
              <p className="text-sm text-muted-foreground">{glassesRx.prescriptionId} · {patient.firstName} {patient.lastName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={glassesRx.status} />
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowPrint(true)}>
              <Eye className="h-4 w-4" />
              {t('printPreview')}
            </Button>
            <Button
              size="sm"
              className="gap-2"
              disabled={isGlassesLocked}
              onClick={() => setShowValidateDialog(true)}
            >
              {isGlassesLocked ? <Lock className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
              {t('validate')}
            </Button>
          </div>
        </div>

        {/* Prescription form */}
        <Card className="p-4">
          {/* Type selector */}
          <div className="mb-3">
            <Label className="text-xs text-muted-foreground">{t('glassesType')}</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {glassesTypes.map((gt) => (
                <button
                  key={gt.key}
                  type="button"
                  disabled={isGlassesLocked}
                  onClick={() => setGlassesRx(p => ({ ...p, type: gt.key }))}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                    glassesRx.type === gt.key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted',
                    isGlassesLocked && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {gt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Copy button */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {glassesRx.sourceRefractionId && (
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[10px]">
                  {t('sourceRefraction')}
                </Badge>
              )}
            </div>
            <CopyButton onClick={copyRefractionToGlasses} label={t('copyFromFinalRefraction')} />
          </div>

          {/* OD / OG fields */}
          <div className="grid grid-cols-2 gap-4">
            {(['OD', 'OG'] as const).map((side) => (
              <div key={side} className="space-y-2">
                <EyeBadge side={side} size="sm" />
                <div className="grid grid-cols-4 gap-1.5">
                  <RxField label="SPH" placeholder="0.00" value={glassesRx[side].sph} onChange={(v) => updateGlassesEye(side, 'sph', v)} disabled={isGlassesLocked} />
                  <RxField label="CYL" placeholder="0.00" value={glassesRx[side].cyl} onChange={(v) => updateGlassesEye(side, 'cyl', v)} disabled={isGlassesLocked} />
                  <RxField label="AXE" placeholder="0°" value={glassesRx[side].axis} onChange={(v) => updateGlassesEye(side, 'axis', v)} disabled={isGlassesLocked} />
                  <RxField label="ADD" placeholder="0.00" value={glassesRx[side].add} onChange={(v) => updateGlassesEye(side, 'add', v)} disabled={isGlassesLocked} />
                  <RxField label="PRISME" placeholder="0.0" value={glassesRx[side].prisme} onChange={(v) => updateGlassesEye(side, 'prisme', v)} disabled={isGlassesLocked} />
                  <RxField label="BASE" placeholder="—" value={glassesRx[side].base} onChange={(v) => updateGlassesEye(side, 'base', v)} disabled={isGlassesLocked} />
                  <RxField label={t('vaObtained')} placeholder="10/10" value={glassesRx[side].va} onChange={(v) => updateGlassesEye(side, 'va', v)} disabled={isGlassesLocked} />
                </div>
              </div>
            ))}
          </div>

          {/* PD + height fields */}
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            <RxField label="PD" placeholder="63" value={glassesRx.pd} onChange={(v) => setGlassesRx(p => ({ ...p, pd: v }))} disabled={isGlassesLocked} />
            <RxField label={t('pdMonoOD')} placeholder="31.5" value={glassesRx.pdMonoOD} onChange={(v) => setGlassesRx(p => ({ ...p, pdMonoOD: v }))} disabled={isGlassesLocked} />
            <RxField label={t('pdMonoOG')} placeholder="31.5" value={glassesRx.pdMonoOG} onChange={(v) => setGlassesRx(p => ({ ...p, pdMonoOG: v }))} disabled={isGlassesLocked} />
            <RxField label={t('pdNear')} placeholder="60" value={glassesRx.pdNear} onChange={(v) => setGlassesRx(p => ({ ...p, pdNear: v }))} disabled={isGlassesLocked} />
            <RxField label={t('heightOD')} placeholder="22" value={glassesRx.heightOD} onChange={(v) => setGlassesRx(p => ({ ...p, heightOD: v }))} disabled={isGlassesLocked} />
            <RxField label={t('heightOG')} placeholder="22" value={glassesRx.heightOG} onChange={(v) => setGlassesRx(p => ({ ...p, heightOG: v }))} disabled={isGlassesLocked} />
          </div>

          {/* Lens fields */}
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <RxField label={t('lensType')} placeholder="Unifocal" value={glassesRx.lensType} onChange={(v) => setGlassesRx(p => ({ ...p, lensType: v }))} disabled={isGlassesLocked} />
            <RxField label={t('lensMaterial')} placeholder="Organique" value={glassesRx.material} onChange={(v) => setGlassesRx(p => ({ ...p, material: v }))} disabled={isGlassesLocked} />
            <RxField label={t('lensIndex')} placeholder="1.6" value={glassesRx.index} onChange={(v) => setGlassesRx(p => ({ ...p, index: v }))} disabled={isGlassesLocked} />
            <RxField label={t('lensDesign')} placeholder="Sphérique" value={glassesRx.design} onChange={(v) => setGlassesRx(p => ({ ...p, design: v }))} disabled={isGlassesLocked} />
            <RxField label={t('lensTreatments')} placeholder="Anti-reflet" value={glassesRx.treatments} onChange={(v) => setGlassesRx(p => ({ ...p, treatments: v }))} disabled={isGlassesLocked} />
            <RxField label={t('lensOptions')} placeholder="—" value={glassesRx.options} onChange={(v) => setGlassesRx(p => ({ ...p, options: v }))} disabled={isGlassesLocked} />
          </div>

          {/* Notes */}
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={glassesRx.notes || ''}
              onChange={(e) => setGlassesRx(p => ({ ...p, notes: e.target.value }))}
              disabled={isGlassesLocked}
              className="mt-1 text-sm"
            />
          </div>
        </Card>

        {/* Validate dialog */}
        <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-success" />
                {t('validatePrescription')}
              </DialogTitle>
              <DialogDescription>{t('confirmValidateDesc')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowValidateDialog(false)}>{t('cancel')}</Button>
              <Button onClick={validateGlasses} className="gap-2">
                <Check className="h-4 w-4" />
                {t('confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Print preview dialog */}
        <Dialog open={showPrint} onOpenChange={setShowPrint}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('printPreview')} — {t('a4Format')}</DialogTitle>
            </DialogHeader>
            <div className="rounded-lg border border-border">
              <GlassesPrintPreview rx={glassesRx} patientAge={patientAge} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPrint(false)}>{t('close')}</Button>
              <Button className="gap-2" onClick={() => { markPrinted('glasses'); window.print(); }}>
                <Printer className="h-4 w-4" />
                {t('print')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ═══ CONTACT LENS PRESCRIPTION VIEW ══════════════════════════════════════════
  if (view === 'contactLens') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('contactLensRx')}</h1>
              <p className="text-sm text-muted-foreground">{contactLensRx.prescriptionId} · {patient.firstName} {patient.lastName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={contactLensRx.status} />
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowPrint(true)}>
              <Eye className="h-4 w-4" />
              {t('printPreview')}
            </Button>
            <Button
              size="sm"
              className="gap-2"
              disabled={isContactLensLocked}
              onClick={() => setShowValidateDialog(true)}
            >
              {isContactLensLocked ? <Lock className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
              {t('validate')}
            </Button>
          </div>
        </div>

        {/* Prescription form */}
        <Card className="p-4">
          {/* Type selector */}
          <div className="mb-3">
            <Label className="text-xs text-muted-foreground">{t('contactLensType')}</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {contactLensTypes.map((ct) => (
                <button
                  key={ct.key}
                  type="button"
                  disabled={isContactLensLocked}
                  onClick={() => setContactLensRx(p => ({ ...p, type: ct.key }))}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                    contactLensRx.type === ct.key
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted-foreground hover:bg-muted',
                    isContactLensLocked && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Copy button */}
          <div className="mb-3 flex justify-end">
            <CopyButton onClick={copyRefractionToContactLens} label={t('copyFromFinalRefraction')} />
          </div>

          {/* OD / OG fields */}
          <div className="grid grid-cols-2 gap-4">
            {(['OD', 'OG'] as const).map((side) => (
              <div key={side} className="space-y-2">
                <EyeBadge side={side} size="sm" />
                <div className="grid grid-cols-3 gap-1.5">
                  <RxField label={t('manufacturer')} placeholder="Alcon" value={contactLensRx[side].manufacturer} onChange={(v) => updateContactLensEye(side, 'manufacturer', v)} disabled={isContactLensLocked} />
                  <RxField label={t('clBrand')} placeholder="Air Optix" value={contactLensRx[side].brand} onChange={(v) => updateContactLensEye(side, 'brand', v)} disabled={isContactLensLocked} />
                  <RxField label={t('lensType')} placeholder="Silicone" value={contactLensRx[side].lensType} onChange={(v) => updateContactLensEye(side, 'lensType', v)} disabled={isContactLensLocked} />
                  <RxField label={t('bc')} placeholder="8.6" value={contactLensRx[side].bc} onChange={(v) => updateContactLensEye(side, 'bc', v)} disabled={isContactLensLocked} />
                  <RxField label={t('dia')} placeholder="14.0" value={contactLensRx[side].dia} onChange={(v) => updateContactLensEye(side, 'dia', v)} disabled={isContactLensLocked} />
                  <RxField label={t('power')} placeholder="0.00" value={contactLensRx[side].power} onChange={(v) => updateContactLensEye(side, 'power', v)} disabled={isContactLensLocked} />
                  <RxField label="CYL" placeholder="0.00" value={contactLensRx[side].cyl} onChange={(v) => updateContactLensEye(side, 'cyl', v)} disabled={isContactLensLocked} />
                  <RxField label="AXE" placeholder="0°" value={contactLensRx[side].axis} onChange={(v) => updateContactLensEye(side, 'axis', v)} disabled={isContactLensLocked} />
                  <RxField label="ADD" placeholder="0.00" value={contactLensRx[side].add} onChange={(v) => updateContactLensEye(side, 'add', v)} disabled={isContactLensLocked} />
                  <RxField label={t('lensMaterial')} placeholder="Lotrafilcon" value={contactLensRx[side].material} onChange={(v) => updateContactLensEye(side, 'material', v)} disabled={isContactLensLocked} />
                  <RxField label={t('replacement')} placeholder="Mensuel" value={contactLensRx[side].replacement} onChange={(v) => updateContactLensEye(side, 'replacement', v)} disabled={isContactLensLocked} />
                  <RxField label={t('wearMode')} placeholder="Journalier" value={contactLensRx[side].wearMode} onChange={(v) => updateContactLensEye(side, 'wearMode', v)} disabled={isContactLensLocked} />
                </div>
              </div>
            ))}
          </div>

          {/* Fitting fields */}
          <div className="mt-3 border-t border-border/60 pt-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Adaptation</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <RxField label={t('trialLens')} placeholder="Essai" value={contactLensRx.trialLens} onChange={(v) => setContactLensRx(p => ({ ...p, trialLens: v }))} disabled={isContactLensLocked} />
              <RxField label={t('overRefraction')} placeholder="0.00" value={contactLensRx.overRefraction} onChange={(v) => setContactLensRx(p => ({ ...p, overRefraction: v }))} disabled={isContactLensLocked} />
              <RxField label={t('movement')} placeholder="Normal" value={contactLensRx.movement} onChange={(v) => setContactLensRx(p => ({ ...p, movement: v }))} disabled={isContactLensLocked} />
              <RxField label={t('centration')} placeholder="Centrée" value={contactLensRx.centration} onChange={(v) => setContactLensRx(p => ({ ...p, centration: v }))} disabled={isContactLensLocked} />
              <RxField label={t('comfort')} placeholder="Bon" value={contactLensRx.comfort} onChange={(v) => setContactLensRx(p => ({ ...p, comfort: v }))} disabled={isContactLensLocked} />
              <RxField label={t('tearFilm')} placeholder="Stable" value={contactLensRx.tearFilm} onChange={(v) => setContactLensRx(p => ({ ...p, tearFilm: v }))} disabled={isContactLensLocked} />
              <RxField label={t('wearingTime')} placeholder="8h" value={contactLensRx.wearingTime} onChange={(v) => setContactLensRx(p => ({ ...p, wearingTime: v }))} disabled={isContactLensLocked} />
              <RxField label={t('finalLens')} placeholder="Oui" value={contactLensRx.finalLens} onChange={(v) => setContactLensRx(p => ({ ...p, finalLens: v }))} disabled={isContactLensLocked} />
              <RxField label={t('followUp')} placeholder="1 semaine" value={contactLensRx.followUp} onChange={(v) => setContactLensRx(p => ({ ...p, followUp: v }))} disabled={isContactLensLocked} />
            </div>
          </div>

          {/* Notes */}
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={contactLensRx.notes || ''}
              onChange={(e) => setContactLensRx(p => ({ ...p, notes: e.target.value }))}
              disabled={isContactLensLocked}
              className="mt-1 text-sm"
            />
          </div>
        </Card>

        {/* Validate dialog */}
        <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-success" />
                {t('validatePrescription')}
              </DialogTitle>
              <DialogDescription>{t('confirmValidateDesc')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowValidateDialog(false)}>{t('cancel')}</Button>
              <Button onClick={validateContactLens} className="gap-2">
                <Check className="h-4 w-4" />
                {t('confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Print preview dialog */}
        <Dialog open={showPrint} onOpenChange={setShowPrint}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('printPreview')} — {t('a4Format')}</DialogTitle>
            </DialogHeader>
            <div className="rounded-lg border border-border">
              <ContactLensPrintPreview rx={contactLensRx} patientAge={patientAge} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPrint(false)}>{t('close')}</Button>
              <Button className="gap-2" onClick={() => { markPrinted('contactLens'); window.print(); }}>
                <Printer className="h-4 w-4" />
                {t('print')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ═══ MEDICATION PRESCRIPTION VIEW ═════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t('medicationRx')}</h1>
            <p className="text-sm text-muted-foreground">ORD-2026-0001 · {patient.firstName} {patient.lastName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            {t('print')}
          </Button>
        </div>
      </div>

      {/* Add medication buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => { setShowSearch(!showSearch); setShowFreeForm(false); }}>
          <Plus className="h-4 w-4" />
          {t('addMedication')}
        </Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => { setShowFreeForm(!showFreeForm); setShowSearch(false); }}>
          <Plus className="h-4 w-4" />
          {t('freePrescription')}
        </Button>
      </div>

      {/* Medication search panel */}
      {showSearch && (
        <Card className="p-4 animate-scale-in">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ms-3" />
            <Input autoFocus placeholder={t('searchMedication')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ps-9" />
          </div>
          <div className="mt-3 max-h-64 overflow-y-auto scrollbar-thin space-y-1.5">
            {filteredMeds.map((med) => (
              <button key={med.id} onClick={() => addMedication(med)} className="flex w-full items-center justify-between rounded-lg border border-border/60 p-3 text-start hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold">{med.commercialName} <span className="text-muted-foreground font-normal">{med.dosage}</span></p>
                  <p className="text-xs text-muted-foreground">{med.dci} · {med.form} · {med.laboratory}</p>
                </div>
                <Plus className="h-4 w-4 text-primary" />
              </button>
            ))}
            {filteredMeds.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">{t('noResults')}</p>}
          </div>
        </Card>
      )}

      {/* Free text form */}
      {showFreeForm && (
        <Card className="p-4 animate-scale-in">
          <h3 className="mb-3 text-sm font-semibold">{t('freePrescription')}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t('medicationName')}</Label>
              <Input value={freeTextItem.medicationName || ''} onChange={(e) => setFreeTextItem({ ...freeTextItem, medicationName: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('dosage')}</Label>
              <Input value={freeTextItem.dosage || ''} onChange={(e) => setFreeTextItem({ ...freeTextItem, dosage: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('form')}</Label>
              <Input value={freeTextItem.form || ''} onChange={(e) => setFreeTextItem({ ...freeTextItem, form: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('posology')}</Label>
              <Input value={freeTextItem.posology || ''} onChange={(e) => setFreeTextItem({ ...freeTextItem, posology: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('frequency')}</Label>
              <Input value={freeTextItem.frequency || ''} onChange={(e) => setFreeTextItem({ ...freeTextItem, frequency: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('duration')}</Label>
              <Input value={freeTextItem.duration || ''} onChange={(e) => setFreeTextItem({ ...freeTextItem, duration: e.target.value })} className="mt-1" />
            </div>
          </div>
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">{t('instructions')}</Label>
            <Input value={freeTextItem.instructions || ''} onChange={(e) => setFreeTextItem({ ...freeTextItem, instructions: e.target.value })} className="mt-1" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={addFreeText}>{t('save')}</Button>
            <Button size="sm" variant="outline" onClick={() => setShowFreeForm(false)}>{t('cancel')}</Button>
          </div>
        </Card>
      )}

      {/* Prescription document */}
      <Card className="mx-auto max-w-3xl print-page overflow-hidden p-0">
        {/* Header */}
        <div className="bg-primary px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <Eye className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight">CENTRE OPHTALMOLOGIQUE</p>
                  <p className="text-sm text-white/80">Dr. Sabeg Ilias</p>
                </div>
              </div>
              <p className="mt-1 text-xs text-white/70">Médecin Spécialiste en Ophtalmologie</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Patient info */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient</p>
              <p className="text-sm font-bold">{patient.firstName} {patient.lastName}</p>
              <p className="text-xs text-muted-foreground">{patient.patientId} · {patientAge} ans</p>
            </div>
            <div className="space-y-1 text-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('date')}: </span>
                <span className="text-sm font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('prescriptionNumber')}: </span>
                <span className="text-sm font-medium">ORD-2026-0001</span>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="space-y-4">
            {medItems.map((item) => (
              <MedItemRow key={item.id} item={item} onRemove={() => removeMedItem(item.id)} />
            ))}
            {medItems.length === 0 && mockPrescriptions[0].items.length > 0 && (
              <div className="space-y-4">
                {mockPrescriptions[0].items.map((item) => (
                  <MedItemRow key={item.id} item={item} onRemove={() => {}} />
                ))}
              </div>
            )}
            {medItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Pill className="h-10 w-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm font-medium">Aucun médicament ajouté</p>
                <p className="text-xs text-muted-foreground">Cliquez sur "Ajouter un médicament" pour commencer</p>
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <div className="mb-2 h-16 w-48 border-b border-border" />
              <p className="text-sm font-semibold">{t('doctorName')}</p>
              <p className="text-xs text-muted-foreground">{t('doctorTitle')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-8 py-4 text-center">
          <p className="text-xs font-medium text-muted-foreground">"Votre Vision, Notre Engagement"</p>
        </div>
      </Card>
    </div>
  );
}

// ── Medication item row ──────────────────────────────────────────────────────

function MedItemRow({ item, onRemove }: { item: PrescriptionItem; onRemove: () => void }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-bold">{item.medicationName}</p>
            <span className="text-sm text-muted-foreground">{item.dosage}</span>
          </div>
          <p className="text-xs text-muted-foreground">{item.form}{item.dci ? ` · ${item.dci}` : ''}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span><span className="text-muted-foreground">Posologie:</span> <span className="font-medium">{item.posology}</span></span>
            <span><span className="text-muted-foreground">Fréquence:</span> <span className="font-medium">{item.frequency}</span></span>
            <span><span className="text-muted-foreground">Durée:</span> <span className="font-medium">{item.duration}</span></span>
            <span><span className="text-muted-foreground">Voie:</span> <span className="font-medium">{item.route}</span></span>
          </div>
          {item.instructions && <p className="mt-1 text-xs text-muted-foreground italic">{item.instructions}</p>}
        </div>
        <button onClick={onRemove} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
