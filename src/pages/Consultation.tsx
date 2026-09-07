import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, Activity, Save, FileText,
  Clock, Check, Pill, Calendar, User, Phone, HeartPulse,
  Droplet, Thermometer, Ruler, FlaskConical, Image as ImageIcon,
  Stethoscope, Glasses, Contact, History, ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { mockPatients } from '@/data/mockPatients';
import { mockConsultations } from '@/data/mockConsultations';
import { mockPrescriptions } from '@/data/mockClinical';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  SectionHeader, EyeColumn, CompactField,
  CollapsibleSection, SegmentExamRow, CopyButton,
} from '@/components/shared/exam/ExamParts';
import { SpecialtyNavigation } from '@/components/consultation/specialties/SpecialtyNavigation';
import { GlaucomaSection } from '@/components/consultation/specialties/GlaucomaSection';
import { CataractSection } from '@/components/consultation/specialties/CataractSection';
import { RetinaSection } from '@/components/consultation/specialties/RetinaSection';
import { CorneaSection } from '@/components/consultation/specialties/CorneaSection';
import { SurgicalSection } from '@/components/consultation/specialties/SurgicalSection';
import type { SpecialtyType } from '@/types/ophthalmology';
import { EyeBadge } from '@/components/shared/EyeBadge';
import { cn } from '@/lib/utils';
import type { EyeSide, ExamStatus, EyeScope, VANotation, RefractionKind, TonometryMethod, GlassesType, ContactLensType, TreatmentActionType } from '@/types';

// ── Static data ──────────────────────────────────────────────────────────────

const reasons = [
  'Baisse de vision', 'Douleur oculaire', 'Rougeur', 'Céphalées',
  'Suivi', 'Contrôle', 'Autre',
];

const anteriorSegmentItems: { key: string; label: string; hasNotes?: boolean }[] = [
  { key: 'eyelids', label: 'Paupières' },
  { key: 'conjunctiva', label: 'Conjonctive' },
  { key: 'cornea', label: 'Cornée' },
  { key: 'tearFilm', label: 'Film lacrymal / surface oculaire' },
  { key: 'anteriorChamber', label: 'Chambre antérieure' },
  { key: 'iris', label: 'Iris' },
  { key: 'lens', label: 'Cristallin' },
];

const fundusItems: { key: string; label: string }[] = [
  { key: 'vitreous', label: 'Vitré' },
  { key: 'opticDisc', label: 'Papille' },
  { key: 'macula', label: 'Macula' },
  { key: 'retina', label: 'Rétine' },
  { key: 'vessels', label: 'Vaisseaux' },
  { key: 'peripheralRetina', label: 'Rétine périphérique' },
];

const commonDiagnoses = [
  'Cataracte sénile', 'Glaucome à angle ouvert', 'DMLA forme sèche',
  'Rétinopathie diabétique', 'Conjonctivite', 'Myopie', 'Presbytie',
  'Kératite', 'Sécheresse oculaire', 'Blépharite', 'Astigmatisme',
];

const tonometryMethods: { key: TonometryMethod; label: string }[] = [
  { key: 'goldmann', label: 'Goldmann' },
  { key: 'non_contact', label: 'Non-contact' },
  { key: 'icare', label: 'iCare' },
  { key: 'autre', label: 'Autre' },
];

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

const treatmentActionTypes: { key: TreatmentActionType; label: string }[] = [
  { key: 'medicament', label: 'Médicament' },
  { key: 'procedure', label: 'Procédure' },
  { key: 'laser', label: 'Laser' },
  { key: 'injection', label: 'Injection' },
  { key: 'chirurgie', label: 'Chirurgie planifiée' },
  { key: 'orientation', label: 'Orientation / avis spécialisé' },
];

const navSections: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'motif', label: 'Motif', icon: Stethoscope },
  { id: 'acuite', label: 'Acuité', icon: Eye },
  { id: 'refraction', label: 'Réfraction', icon: Eye },
  { id: 'kerato', label: 'Kérato.', icon: Ruler },
  { id: 'tono', label: 'Tono.', icon: Activity },
  { id: 'pachy', label: 'Pachy.', icon: Ruler },
  { id: 'pupilles', label: 'Pupilles', icon: Eye },
  { id: 'motilite', label: 'Motilité', icon: Activity },
  { id: 'anterieur', label: 'Seg. ant.', icon: Eye },
  { id: 'fond', label: 'Fond', icon: Eye },
  { id: 'diagnostic', label: 'Diagnostic', icon: FileText },
  { id: 'traitement', label: 'Traitement', icon: Pill },
  { id: 'lunettes', label: 'Lunettes', icon: Glasses },
  { id: 'lentilles', label: 'Lentilles', icon: Contact },
];

// ── Default empty states ─────────────────────────────────────────────────────

const emptyRefraction = { sph: '', cyl: '', axis: '', add: '', prisme: '', base: '', obtainedVA: '', pd: '', pdMonoOD: '', pdMonoOG: '', pdNear: '', vertexDistance: '', notes: '' };

// ── Main component ───────────────────────────────────────────────────────────

export default function Consultation() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const patient = mockPatients[0];
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
  const previousConsultations = mockConsultations.slice(0, 2);
  const previousPrescriptions = mockPrescriptions.slice(0, 2);

  const [selectedReason, setSelectedReason] = useState('Baisse de vision');
  const [activeSection, setActiveSection] = useState('motif');
  const [showComparison, setShowComparison] = useState(false);
  const [activeSpecialty, setActiveSpecialty] = useState<SpecialtyType>('general');
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Visual Acuity state ────────────────────────────────────────────────────
  const [vaNotation, setVaNotation] = useState<VANotation>('decimale');
  const [vaData, setVaData] = useState({
    OD: { farWithoutCorrection: '', farWithCorrection: '', nearWithoutCorrection: '', nearWithCorrection: '', pinhole: '', notes: '' },
    OG: { farWithoutCorrection: '', farWithCorrection: '', nearWithoutCorrection: '', nearWithCorrection: '', pinhole: '', notes: '' },
  });

  // ── Refraction state ───────────────────────────────────────────────────────
  const [refractionData, setRefractionData] = useState({
    auto: { OD: { ...emptyRefraction }, OG: { ...emptyRefraction } },
    subjective: { OD: { ...emptyRefraction }, OG: { ...emptyRefraction } },
    finale: { OD: { ...emptyRefraction }, OG: { ...emptyRefraction } },
  });

  // ── Keratometry state ──────────────────────────────────────────────────────
  const [keratoData, setKeratoData] = useState({
    OD: { k1: '', axis1: '', k2: '', axis2: '', kAvg: '', astigmatism: '', notes: '' },
    OG: { k1: '', axis1: '', k2: '', axis2: '', kAvg: '', astigmatism: '', notes: '' },
  });

  // ── Tonometry state ────────────────────────────────────────────────────────
  const [tonoData, setTonoData] = useState({
    OD: { iop: '', method: 'goldmann' as TonometryMethod, time: '', device: '', correctedValue: '', notes: '' },
    OG: { iop: '', method: 'goldmann' as TonometryMethod, time: '', device: '', correctedValue: '', notes: '' },
  });

  // ── Pachymetry state ────────────────────────────────────────────────────────
  const [pachyData, setPachyData] = useState({
    OD: { cct: '', device: '', date: '', notes: '' },
    OG: { cct: '', device: '', date: '', notes: '' },
  });

  // ── Pupils state ────────────────────────────────────────────────────────────
  const [pupilsData, setPupilsData] = useState({
    sizeOD: '', sizeOG: '', shape: '', reactivity: '', directReflex: '', consensualReflex: '', rapd: '', notes: '',
  });

  // ── Motility state ──────────────────────────────────────────────────────────
  const [motilityData, setMotilityData] = useState({
    motility: '', diplopia: '', coverTest: '', alignment: '', strabismus: '', vergences: '', notes: '',
  });

  // ── Segment exam statuses ──────────────────────────────────────────────────
  const [anteriorStatuses, setAnteriorStatuses] = useState<Record<string, { OD: ExamStatus; OG: ExamStatus }>>({});
  const [fundusStatuses, setFundusStatuses] = useState<Record<string, { OD: ExamStatus; OG: ExamStatus }>>({});

  // ── Fundus extra fields ─────────────────────────────────────────────────────
  const [fundusExtra, setFundusExtra] = useState({
    OD: { cdRatio: '', papilledema: '', pallor: '', excavation: '', neovascularization: '', notes: '' },
    OG: { cdRatio: '', papilledema: '', pallor: '', excavation: '', neovascularization: '', notes: '' },
  });

  // ── Diagnosis state ──────────────────────────────────────────────────────────
  const [diagnosis, setDiagnosis] = useState({
    primary: '', secondary: [] as string[], eye: 'OU' as EyeScope, icd10: '', notes: '',
  });

  // ── Treatment state ──────────────────────────────────────────────────────────
  const [treatment, setTreatment] = useState({
    medication: '', type: 'ophtalmique' as 'ophtalmique' | 'systémique', eye: 'OU' as EyeScope,
    posology: '', frequency: '', route: '', duration: '', instructions: '', recommendations: '',
    actionType: 'medicament' as TreatmentActionType, notes: '',
  });

  // ── Glasses prescription state ──────────────────────────────────────────────
  const [glasses, setGlasses] = useState({
    type: 'progressive' as GlassesType,
    sphOD: '', cylOD: '', axisOD: '', addOD: '', prismeOD: '', baseOD: '',
    sphOG: '', cylOG: '', axisOG: '', addOG: '', prismeOG: '', baseOG: '',
    pd: '', pdMonoOD: '', pdMonoOG: '', height: '',
    lensType: '', material: '', index: '', design: '', treatments: '', notes: '',
  });

  // ── Contact lens state ───────────────────────────────────────────────────────
  const [contactLens, setContactLens] = useState({
    type: 'spherique' as ContactLensType,
    manufacturer: '', brand: '', lensType: '', bc: '', dia: '', power: '', cyl: '', axis: '', add: '',
    material: '', replacement: '', wearMode: '', eye: 'OU' as EyeScope,
    trialLens: '', overRefraction: '', movement: '', centration: '', comfort: '', tearFilm: '',
    wearingTime: '', finalLens: '', followUp: '', notes: '',
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getSegmentStatus = (key: string, store: typeof anteriorStatuses): { OD: ExamStatus; OG: ExamStatus } => {
    return store[key] || { OD: 'not_examined', OG: 'not_examined' };
  };

  const setSegmentStatus = (
    key: string, eye: EyeSide, status: ExamStatus,
    store: typeof anteriorStatuses, setter: typeof setAnteriorStatuses,
  ) => {
    setter(prev => {
      const current = prev[key] || { OD: 'not_examined' as ExamStatus, OG: 'not_examined' as ExamStatus };
      return { ...prev, [key]: { ...current, [eye]: status } };
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  // ── Copy final refraction to glasses ─────────────────────────────────────────
  const copyRefractionToGlasses = useCallback(() => {
    const fr = refractionData.finale;
    setGlasses(prev => ({
      ...prev,
      sphOD: fr.OD.sph, cylOD: fr.OD.cyl, axisOD: fr.OD.axis, addOD: fr.OD.add, prismeOD: fr.OD.prisme, baseOD: fr.OD.base,
      sphOG: fr.OG.sph, cylOG: fr.OG.cyl, axisOG: fr.OG.axis, addOG: fr.OG.add, prismeOG: fr.OG.prisme, baseOG: fr.OG.base,
      pd: fr.OD.pd, pdMonoOD: fr.OD.pdMonoOD, pdMonoOG: fr.OG.pdMonoOG,
    }));
  }, [refractionData.finale]);

  // ── Copy final refraction to contact lens ───────────────────────────────────
  const copyRefractionToContactLens = useCallback(() => {
    const fr = refractionData.finale;
    setContactLens(prev => ({
      ...prev,
      power: fr.OD.sph || fr.OG.sph,
      cyl: fr.OD.cyl || fr.OG.cyl,
      axis: fr.OD.axis || fr.OG.axis,
      add: fr.OD.add || fr.OG.add,
    }));
  }, [refractionData.finale]);

  // ── Update helpers ──────────────────────────────────────────────────────────
  const updateVA = (side: EyeSide, field: string, value: string) => {
    setVaData(prev => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  };

  const updateRefraction = (kind: RefractionKind, side: EyeSide, field: string, value: string) => {
    setRefractionData(prev => ({
      ...prev,
      [kind]: { ...prev[kind], [side]: { ...prev[kind][side], [field]: value } },
    }));
  };

  const updateKerato = (side: EyeSide, field: string, value: string) => {
    setKeratoData(prev => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  };

  const updateTono = (side: EyeSide, field: string, value: string) => {
    setTonoData(prev => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  };

  const updatePachy = (side: EyeSide, field: string, value: string) => {
    setPachyData(prev => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  };

  const updateFundusExtra = (side: EyeSide, field: string, value: string) => {
    setFundusExtra(prev => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
  };

  const refractionFields: { key: string; label: string; placeholder: string }[] = [
    { key: 'sph', label: 'SPH', placeholder: '0.00' },
    { key: 'cyl', label: 'CYL', placeholder: '0.00' },
    { key: 'axis', label: 'AXE', placeholder: '0°' },
    { key: 'add', label: 'ADD', placeholder: '0.00' },
    { key: 'prisme', label: 'PRISME', placeholder: '0.0' },
    { key: 'base', label: 'BASE', placeholder: '—' },
    { key: 'obtainedVA', label: 'AV', placeholder: '10/10' },
    { key: 'pd', label: 'PD', placeholder: '63' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t('consultationWorkspace')}</h1>
            <p className="text-sm text-muted-foreground">
              {patient.firstName} {patient.lastName} · {patient.patientId} · {age} ans · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowComparison(true)}>
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">{t('previousExamComparison')}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            {t('saveDraft')}
          </Button>
          <Button size="sm" className="gap-2">
            <Check className="h-4 w-4" />
            {t('submit')}
          </Button>
        </div>
      </div>

      {/* ── 3-column layout ────────────────────────────────────────────────── */}
      <div className="grid gap-3 mt-3 xl:grid-cols-[240px_1fr_240px] min-h-0">
        {/* LEFT: Patient Summary + Previous Data */}
        <div className="space-y-3">
          <Card className="p-3.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-base font-bold text-primary">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{patient.firstName} {patient.lastName}</p>
                <p className="text-xs text-muted-foreground">{patient.patientId} · {age} ans · {patient.gender === 'male' ? 'Homme' : 'Femme'}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3" />
                {patient.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3 w-3" />
                {patient.insurance || 'Non renseigné'}
              </div>
            </div>
          </Card>

          {/* Last tonometry */}
          <Card className="p-3.5">
            <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold">
              <Activity className="h-3.5 w-3.5 text-accent" />
              Dernière tonométrie
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-primary/5 p-2.5 text-center">
                <EyeBadge side="OD" size="sm" />
                <p className="mt-1 text-lg font-bold text-primary tabular-nums">14</p>
                <p className="text-[10px] text-muted-foreground">mmHg</p>
              </div>
              <div className="rounded-lg bg-accent/5 p-2.5 text-center">
                <EyeBadge side="OG" size="sm" />
                <p className="mt-1 text-lg font-bold text-accent tabular-nums">15</p>
                <p className="text-[10px] text-muted-foreground">mmHg</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">12 juin 2026 · Goldmann</p>
          </Card>

          {/* Last refraction */}
          <Card className="p-3.5">
            <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold">
              <Eye className="h-3.5 w-3.5 text-primary" />
              Dernière réfraction
            </h3>
            <div className="space-y-2">
              {(['OD', 'OG'] as EyeSide[]).map((side) => (
                <div key={side} className="rounded-lg border border-border/60 p-2">
                  <EyeBadge side={side} size="sm" />
                  <div className="mt-1.5 grid grid-cols-3 gap-1 text-xs tabular-nums">
                    <div><span className="text-muted-foreground">SPH</span> <span className="font-medium">-2.50</span></div>
                    <div><span className="text-muted-foreground">CYL</span> <span className="font-medium">-0.75</span></div>
                    <div><span className="text-muted-foreground">AXE</span> <span className="font-medium">90°</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Previous consultations (collapsible) */}
          <CollapsibleSection title="Consultations précédentes" icon={Clock}>
            <div className="space-y-2">
              {previousConsultations.map((c) => (
                <div key={c.id} className="rounded-lg border border-border/60 p-2.5">
                  <p className="text-xs font-medium">{c.date}</p>
                  <p className="text-xs text-muted-foreground">{c.reason}</p>
                  <p className="mt-1 text-xs font-medium text-primary">{c.primaryDiagnosis}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* CENTER: Continuous Clinical Examination Sheet */}
        <div className="min-w-0">
          {/* Sticky clinical navigation bar */}
          <div className="sticky top-2 z-30 mb-3">
            <Card className="p-1.5 shadow-card">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
                {navSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all',
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* The examination sheet — all main sections visible */}
          <div ref={scrollRef} className="space-y-4">
            {/* ═══ 1. Motif / Anamnèse ═══ */}
            <Card className="p-4">
              <SectionHeader id="motif" icon={Stethoscope} title={t('reasonConsultation')} />
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setSelectedReason(reason)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                        selectedReason === reason
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('anamnesis')}</Label>
                  <Textarea placeholder="Histoire de la maladie actuelle, symptômes, durée d'évolution..." rows={2} className="mt-1 text-sm" />
                </div>
              </div>
            </Card>

            {/* ═══ 1. Acuité visuelle ═══ */}
            <Card className="p-4">
              <SectionHeader id="acuite" icon={Eye} title={t('visualAcuity')} accent="bg-primary/10 text-primary" />
              <div className="space-y-4">
                {/* Notation selector */}
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">{t('notation')}</Label>
                  <div className="flex gap-1">
                    {(['decimale', 'snellen', 'logmar'] as VANotation[]).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setVaNotation(n)}
                        className={cn(
                          'rounded-md border px-2 py-1 text-[11px] font-medium transition-all',
                          vaNotation === n ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {n === 'decimale' ? t('decimale') : n === 'snellen' ? t('snellen') : t('logmar')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vision de loin */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('farVision')}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {(['OD', 'OG'] as EyeSide[]).map((side) => (
                      <EyeColumn key={side} side={side}>
                        <div className="grid grid-cols-3 gap-1.5">
                          <CompactField label={t('withoutCorrection')} placeholder="10/10" value={vaData[side].farWithoutCorrection} onChange={(v) => updateVA(side, 'farWithoutCorrection', v)} />
                          <CompactField label={t('withCorrection')} placeholder="10/10" value={vaData[side].farWithCorrection} onChange={(v) => updateVA(side, 'farWithCorrection', v)} />
                          <CompactField label={t('pinhole')} placeholder="10/10" value={vaData[side].pinhole} onChange={(v) => updateVA(side, 'pinhole', v)} />
                        </div>
                      </EyeColumn>
                    ))}
                  </div>
                </div>

                {/* Vision de près */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('nearVision')}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {(['OD', 'OG'] as EyeSide[]).map((side) => (
                      <EyeColumn key={side} side={side}>
                        <div className="grid grid-cols-2 gap-1.5">
                          <CompactField label={t('withoutCorrection')} placeholder="Parfait" value={vaData[side].nearWithoutCorrection} onChange={(v) => updateVA(side, 'nearWithoutCorrection', v)} />
                          <CompactField label={t('withCorrection')} placeholder="Parfait" value={vaData[side].nearWithCorrection} onChange={(v) => updateVA(side, 'nearWithCorrection', v)} />
                        </div>
                      </EyeColumn>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <Input placeholder="Notes acuité visuelle..." className="mt-0.5 h-8 text-sm" />
                </div>
              </div>
            </Card>

            {/* ═══ 2. Réfraction ═══ */}
            <Card className="p-4">
              <SectionHeader id="refraction" icon={Eye} title={t('refraction')} accent="bg-primary/10 text-primary" />
              <div className="space-y-4">
                {(['auto', 'subjective', 'finale'] as RefractionKind[]).map((kind) => (
                  <div key={kind} className={cn('rounded-lg border p-3', kind === 'finale' && 'border-primary/40 bg-primary/5')}>
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {kind === 'auto' ? t('refractionAuto') : kind === 'subjective' ? t('refractionSubjective') : t('refractionFinale')}
                      </p>
                      {kind === 'finale' && (
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px]">
                          Source de vérité clinique
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(['OD', 'OG'] as EyeSide[]).map((side) => (
                        <EyeColumn key={side} side={side}>
                          <div className="grid grid-cols-4 gap-1.5">
                            {refractionFields.map((field) => (
                              <CompactField
                                key={field.key}
                                label={field.label}
                                placeholder={field.placeholder}
                                value={refractionData[kind][side][field.key as keyof typeof refractionData.finale.OD] as string}
                                onChange={(v) => updateRefraction(kind, side, field.key, v)}
                              />
                            ))}
                          </div>
                        </EyeColumn>
                      ))}
                    </div>
                    {/* PD fields for finale */}
                    {kind === 'finale' && (
                      <div className="mt-2 grid grid-cols-4 gap-1.5">
                        <CompactField label={t('pdMonoOD')} placeholder="31.5" value={refractionData.finale.OD.pdMonoOD} onChange={(v) => updateRefraction('finale', 'OD', 'pdMonoOD', v)} />
                        <CompactField label={t('pdMonoOG')} placeholder="31.5" value={refractionData.finale.OG.pdMonoOG} onChange={(v) => updateRefraction('finale', 'OG', 'pdMonoOG', v)} />
                        <CompactField label={t('pdNear')} placeholder="60" value={refractionData.finale.OD.pdNear} onChange={(v) => updateRefraction('finale', 'OD', 'pdNear', v)} />
                        <CompactField label={t('vertexDistance')} placeholder="12 mm" value={refractionData.finale.OD.vertexDistance} onChange={(v) => updateRefraction('finale', 'OD', 'vertexDistance', v)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* ═══ 3. Kératométrie ═══ */}
            <Card className="p-4">
              <SectionHeader id="kerato" icon={Ruler} title={t('keratometry')} accent="bg-accent/10 text-accent" />
              <div className="grid grid-cols-2 gap-4">
                {(['OD', 'OG'] as EyeSide[]).map((side) => (
                  <EyeColumn key={side} side={side}>
                    <div className="grid grid-cols-3 gap-1.5">
                      <CompactField label={t('k1')} placeholder="43.00" value={keratoData[side].k1} onChange={(v) => updateKerato(side, 'k1', v)} />
                      <CompactField label={t('axisK1')} placeholder="90°" value={keratoData[side].axis1} onChange={(v) => updateKerato(side, 'axis1', v)} />
                      <CompactField label={t('k2')} placeholder="44.00" value={keratoData[side].k2} onChange={(v) => updateKerato(side, 'k2', v)} />
                      <CompactField label={t('axisK2')} placeholder="180°" value={keratoData[side].axis2} onChange={(v) => updateKerato(side, 'axis2', v)} />
                      <CompactField label={t('kAvg')} placeholder="43.50" value={keratoData[side].kAvg} onChange={(v) => updateKerato(side, 'kAvg', v)} />
                      <CompactField label={t('astigmatism')} placeholder="1.00" value={keratoData[side].astigmatism} onChange={(v) => updateKerato(side, 'astigmatism', v)} />
                    </div>
                  </EyeColumn>
                ))}
              </div>
            </Card>

            {/* ═══ 4. Tonométrie ═══ */}
            <Card className="p-4">
              <SectionHeader id="tono" icon={Activity} title={t('tonometry')} accent="bg-warning/10 text-warning" />
              <div className="grid grid-cols-2 gap-4">
                {(['OD', 'OG'] as EyeSide[]).map((side) => (
                  <EyeColumn key={side} side={side}>
                    <div className="flex items-center gap-2">
                      <CompactField label={t('iop')} placeholder="14" value={tonoData[side].iop} onChange={(v) => updateTono(side, 'iop', v)} width="70px" />
                      <span className="text-xs text-muted-foreground mt-4">mmHg</span>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium text-muted-foreground">Méthode</Label>
                      <div className="flex flex-wrap gap-1">
                        {tonometryMethods.map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            tabIndex={-1}
                            onClick={() => updateTono(side, 'method', m.key)}
                            className={cn(
                              'rounded-md border px-2 py-1 text-[11px] transition-all',
                              tonoData[side].method === m.key
                                ? 'border-warning bg-warning/10 text-warning'
                                : 'border-border text-muted-foreground hover:bg-muted'
                            )}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <CompactField label={t('time')} placeholder="09:00" value={tonoData[side].time} onChange={(v) => updateTono(side, 'time', v)} />
                      <CompactField label={t('device')} placeholder="Goldmann" value={tonoData[side].device} onChange={(v) => updateTono(side, 'device', v)} />
                    </div>
                    <CompactField label={t('correctedValue')} placeholder="15" value={tonoData[side].correctedValue} onChange={(v) => updateTono(side, 'correctedValue', v)} />
                  </EyeColumn>
                ))}
              </div>
            </Card>

            {/* ═══ 5. Pachymétrie ═══ */}
            <Card className="p-4">
              <SectionHeader id="pachy" icon={Ruler} title={t('pachymetry')} accent="bg-accent/10 text-accent" />
              <div className="grid grid-cols-2 gap-4">
                {(['OD', 'OG'] as EyeSide[]).map((side) => (
                  <EyeColumn key={side} side={side}>
                    <div className="flex items-center gap-2">
                      <CompactField label={t('cct')} placeholder="540" value={pachyData[side].cct} onChange={(v) => updatePachy(side, 'cct', v)} width="70px" />
                      <span className="text-xs text-muted-foreground mt-4">µm</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <CompactField label={t('device')} placeholder="Pachymètre" value={pachyData[side].device} onChange={(v) => updatePachy(side, 'device', v)} />
                      <CompactField label={t('date')} placeholder="JJ/MM/AAAA" value={pachyData[side].date} onChange={(v) => updatePachy(side, 'date', v)} />
                    </div>
                  </EyeColumn>
                ))}
              </div>
            </Card>

            {/* ═══ 6. Pupilles ═══ */}
            <Card className="p-4">
              <SectionHeader id="pupilles" icon={Eye} title={t('pupilles')} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <EyeBadge side="OD" size="sm" />
                  <CompactField label={t('pupilSize') + ' (mm)'} placeholder="3.0" value={pupilsData.sizeOD} onChange={(v) => setPupilsData(p => ({ ...p, sizeOD: v }))} />
                </div>
                <div className="space-y-2">
                  <EyeBadge side="OG" size="sm" />
                  <CompactField label={t('pupilSize') + ' (mm)'} placeholder="3.0" value={pupilsData.sizeOG} onChange={(v) => setPupilsData(p => ({ ...p, sizeOG: v }))} />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <CompactField label={t('pupilShape')} placeholder="Ronde" value={pupilsData.shape} onChange={(v) => setPupilsData(p => ({ ...p, shape: v }))} />
                <CompactField label={t('pupilReactivity')} placeholder="Normale" value={pupilsData.reactivity} onChange={(v) => setPupilsData(p => ({ ...p, reactivity: v }))} />
                <CompactField label={t('directReflex')} placeholder="Présent" value={pupilsData.directReflex} onChange={(v) => setPupilsData(p => ({ ...p, directReflex: v }))} />
                <CompactField label={t('consensualReflex')} placeholder="Présent" value={pupilsData.consensualReflex} onChange={(v) => setPupilsData(p => ({ ...p, consensualReflex: v }))} />
              </div>
              <div className="mt-2">
                <CompactField label={t('rapd')} placeholder="Négatif" value={pupilsData.rapd} onChange={(v) => setPupilsData(p => ({ ...p, rapd: v }))} />
              </div>
            </Card>

            {/* ═══ 7. Motilité oculaire ═══ */}
            <Card className="p-4">
              <SectionHeader id="motilite" icon={Activity} title={t('motility')} accent="bg-accent/10 text-accent" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <CompactField label={t('motilityExtrinsic')} placeholder="Normale" value={motilityData.motility} onChange={(v) => setMotilityData(p => ({ ...p, motility: v }))} />
                <CompactField label={t('diplopia')} placeholder="Non" value={motilityData.diplopia} onChange={(v) => setMotilityData(p => ({ ...p, diplopia: v }))} />
                <CompactField label={t('coverTest')} placeholder="Sans déviation" value={motilityData.coverTest} onChange={(v) => setMotilityData(p => ({ ...p, coverTest: v }))} />
                <CompactField label={t('alignment')} placeholder="Aligné" value={motilityData.alignment} onChange={(v) => setMotilityData(p => ({ ...p, alignment: v }))} />
                <CompactField label="Strabisme" placeholder="Non" value={motilityData.strabismus} onChange={(v) => setMotilityData(p => ({ ...p, strabismus: v }))} />
                <CompactField label={t('vergences')} placeholder="Normales" value={motilityData.vergences} onChange={(v) => setMotilityData(p => ({ ...p, vergences: v }))} />
              </div>
            </Card>

            {/* ═══ 8. Segment antérieur ═══ */}
            <Card className="p-4">
              <SectionHeader id="anterieur" icon={Eye} title={t('anteriorSegment')} />
              <div className="space-y-1">
                {anteriorSegmentItems.map((item) => (
                  <SegmentExamRow
                    key={item.key}
                    label={item.label}
                    eyeStatuses={getSegmentStatus(item.key, anteriorStatuses)}
                    onStatusChange={(eye, status) => setSegmentStatus(item.key, eye, status, anteriorStatuses, setAnteriorStatuses)}
                    hasNotes={item.hasNotes}
                  />
                ))}
                <div className="rounded-lg p-1.5">
                  <Label className="text-sm font-medium">{t('otherObservations')}</Label>
                  <Input placeholder="Autres observations..." className="mt-1 h-8 text-sm" />
                </div>
              </div>
            </Card>

            {/* ═══ 9. Fond d'œil ═══ */}
            <Card className="p-4">
              <SectionHeader id="fond" icon={Eye} title={t('fundusExam')} accent="bg-chart-5/10 text-chart-5" />
              <div className="space-y-1">
                {fundusItems.map((item) => (
                  <SegmentExamRow
                    key={item.key}
                    label={item.label}
                    eyeStatuses={getSegmentStatus(item.key, fundusStatuses)}
                    onStatusChange={(eye, status) => setSegmentStatus(item.key, eye, status, fundusStatuses, setFundusStatuses)}
                  />
                ))}
              </div>
              {/* Extra fundus fields per eye */}
              <div className="mt-3 grid grid-cols-2 gap-4">
                {(['OD', 'OG'] as EyeSide[]).map((side) => (
                  <div key={side} className="space-y-2">
                    <EyeBadge side={side} size="sm" />
                    <div className="grid grid-cols-3 gap-1.5">
                      <CompactField label={t('cdRatio')} placeholder="0.4" value={fundusExtra[side].cdRatio} onChange={(v) => updateFundusExtra(side, 'cdRatio', v)} />
                      <CompactField label={t('papilledema')} placeholder="Non" value={fundusExtra[side].papilledema} onChange={(v) => updateFundusExtra(side, 'papilledema', v)} />
                      <CompactField label={t('pallor')} placeholder="Non" value={fundusExtra[side].pallor} onChange={(v) => updateFundusExtra(side, 'pallor', v)} />
                      <CompactField label={t('excavation')} placeholder="Normale" value={fundusExtra[side].excavation} onChange={(v) => updateFundusExtra(side, 'excavation', v)} />
                      <CompactField label={t('neovascularization')} placeholder="Non" value={fundusExtra[side].neovascularization} onChange={(v) => updateFundusExtra(side, 'neovascularization', v)} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ═══ 10. Diagnostic ═══ */}
            <Card className="p-4">
              <SectionHeader id="diagnostic" icon={FileText} title={t('primaryDiagnosis')} accent="bg-success/10 text-success" />
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">{t('primaryDiagnosis')}</Label>
                  <Input
                    placeholder="Sélectionner ou saisir un diagnostic..."
                    className="mt-1"
                    list="diagnoses"
                    value={diagnosis.primary}
                    onChange={(e) => setDiagnosis(d => ({ ...d, primary: e.target.value }))}
                  />
                  <datalist id="diagnoses">
                    {commonDiagnoses.map((d) => <option key={d} value={d} />)}
                  </datalist>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('secondaryDiagnoses')}</Label>
                  <Input
                    placeholder="Ajouter un diagnostic secondaire..."
                    className="mt-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          setDiagnosis(d => ({ ...d, secondary: [...d.secondary, val] }));
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  {diagnosis.secondary.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {diagnosis.secondary.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {s}
                          <button
                            type="button"
                            onClick={() => setDiagnosis(d => ({ ...d, secondary: d.secondary.filter((_, idx) => idx !== i) }))}
                            className="ms-1 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('eye')}</Label>
                    <div className="mt-1 flex gap-1">
                      {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setDiagnosis(d => ({ ...d, eye: e }))}
                          className={cn(
                            'rounded-md border px-3 py-1 text-xs font-bold transition-all',
                            diagnosis.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                          )}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('icd10')}</Label>
                    <Input placeholder="H26.9" className="mt-1 h-8 text-sm" value={diagnosis.icd10} onChange={(e) => setDiagnosis(d => ({ ...d, icd10: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Notes cliniques</Label>
                  <Textarea placeholder="Notes cliniques..." rows={2} className="mt-1 text-sm" />
                </div>
              </div>
            </Card>

            {/* ═══ 11. Traitement ═══ */}
            <Card className="p-4">
              <SectionHeader id="traitement" icon={Pill} title={t('treatmentPlan')} accent="bg-success/10 text-success" />
              <div className="space-y-3">
                {/* Action type selector */}
                <div>
                  <Label className="text-xs text-muted-foreground">Type d'action</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {treatmentActionTypes.map((a) => (
                      <button
                        key={a.key}
                        type="button"
                        onClick={() => setTreatment(prev => ({ ...prev, actionType: a.key }))}
                        className={cn(
                          'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                          treatment.actionType === a.key
                            ? 'border-success bg-success/10 text-success'
                            : 'border-border text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {treatment.actionType === 'medicament' && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <CompactField label={t('medication')} placeholder="Latanoprost 0.005%" value={treatment.medication} onChange={(v) => setTreatment(p => ({ ...p, medication: v }))} />
                    <div>
                      <Label className="text-[10px] font-medium text-muted-foreground">{t('treatmentType')}</Label>
                      <div className="mt-0.5 flex gap-1">
                        {(['ophtalmique', 'systémique'] as const).map((tp) => (
                          <button
                            key={tp}
                            type="button"
                            onClick={() => setTreatment(p => ({ ...p, type: tp }))}
                            className={cn(
                              'rounded-md border px-2 py-1 text-[11px] transition-all',
                              treatment.type === tp ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                            )}
                          >
                            {tp === 'ophtalmique' ? 'Ophtalmique' : 'Systémique'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium text-muted-foreground">{t('eye')}</Label>
                      <div className="mt-0.5 flex gap-1">
                        {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => setTreatment(p => ({ ...p, eye: e }))}
                            className={cn(
                              'rounded-md border px-2 py-1 text-[11px] font-bold transition-all',
                              treatment.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                            )}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                    <CompactField label={t('posology')} placeholder="1 goutte" value={treatment.posology} onChange={(v) => setTreatment(p => ({ ...p, posology: v }))} />
                    <CompactField label={t('frequency')} placeholder="1x/jour" value={treatment.frequency} onChange={(v) => setTreatment(p => ({ ...p, frequency: v }))} />
                    <CompactField label={t('route')} placeholder="Ophtalmique" value={treatment.route} onChange={(v) => setTreatment(p => ({ ...p, route: v }))} />
                    <CompactField label={t('treatmentDuration')} placeholder="30 jours" value={treatment.duration} onChange={(v) => setTreatment(p => ({ ...p, duration: v }))} />
                  </div>
                )}

                {(treatment.actionType === 'laser' || treatment.actionType === 'injection' || treatment.actionType === 'chirurgie') && (
                  <div className="grid grid-cols-2 gap-3">
                    <CompactField label={treatment.actionType === 'laser' ? t('laser') : treatment.actionType === 'injection' ? t('injection') : t('plannedSurgery')} placeholder={treatment.actionType === 'laser' ? 'Laser Argon' : treatment.actionType === 'injection' ? 'Anti-VEGF' : 'Phaco-émulsification'} />
                    <CompactField label={t('eye')} placeholder="OD / OG / OU" />
                  </div>
                )}

                {treatment.actionType === 'orientation' && (
                  <CompactField label={t('specialistReferral')} placeholder="Orientation vers..." />
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('treatmentInstructions')}</Label>
                    <Textarea placeholder="Instructions au patient..." rows={2} className="mt-1 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('recommendations')}</Label>
                    <Textarea placeholder="Recommandations..." rows={2} className="mt-1 text-sm" />
                  </div>
                </div>
              </div>
            </Card>

            {/* ═══ 12. Prescription de lunettes ═══ */}
            <Card className="p-4">
              <SectionHeader
                id="lunettes"
                icon={Glasses}
                title={t('glassesPrescription')}
                accent="bg-primary/10 text-primary"
                action={<CopyButton onClick={copyRefractionToGlasses} label={t('copyFromRefraction')} />}
              />
              <div className="mb-3">
                <Label className="text-xs text-muted-foreground">{t('glassesType')}</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {glassesTypes.map((gt) => (
                    <button
                      key={gt.key}
                      type="button"
                      onClick={() => setGlasses(p => ({ ...p, type: gt.key }))}
                      className={cn(
                        'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                        glasses.type === gt.key
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {gt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(['OD', 'OG'] as EyeSide[]).map((side) => {
                  const suffix = side === 'OD' ? 'OD' : 'OG';
                  return (
                    <EyeColumn key={side} side={side}>
                      <div className="grid grid-cols-3 gap-1.5">
                        <CompactField label="SPH" placeholder="0.00" value={glasses[`sph${suffix}` as keyof typeof glasses] as string} onChange={(v) => setGlasses(p => ({ ...p, [`sph${suffix}`]: v }))} />
                        <CompactField label="CYL" placeholder="0.00" value={glasses[`cyl${suffix}` as keyof typeof glasses] as string} onChange={(v) => setGlasses(p => ({ ...p, [`cyl${suffix}`]: v }))} />
                        <CompactField label="AXE" placeholder="0°" value={glasses[`axis${suffix}` as keyof typeof glasses] as string} onChange={(v) => setGlasses(p => ({ ...p, [`axis${suffix}`]: v }))} />
                        <CompactField label="ADD" placeholder="0.00" value={glasses[`add${suffix}` as keyof typeof glasses] as string} onChange={(v) => setGlasses(p => ({ ...p, [`add${suffix}`]: v }))} />
                        <CompactField label="PRISME" placeholder="0.0" value={glasses[`prisme${suffix}` as keyof typeof glasses] as string} onChange={(v) => setGlasses(p => ({ ...p, [`prisme${suffix}`]: v }))} />
                        <CompactField label="BASE" placeholder="—" value={glasses[`base${suffix}` as keyof typeof glasses] as string} onChange={(v) => setGlasses(p => ({ ...p, [`base${suffix}`]: v }))} />
                      </div>
                    </EyeColumn>
                  );
                })}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <CompactField label="PD" placeholder="63" value={glasses.pd} onChange={(v) => setGlasses(p => ({ ...p, pd: v }))} />
                <CompactField label={t('pdMonoOD')} placeholder="31.5" value={glasses.pdMonoOD} onChange={(v) => setGlasses(p => ({ ...p, pdMonoOD: v }))} />
                <CompactField label={t('pdMonoOG')} placeholder="31.5" value={glasses.pdMonoOG} onChange={(v) => setGlasses(p => ({ ...p, pdMonoOG: v }))} />
                <CompactField label={t('height')} placeholder="20 mm" value={glasses.height} onChange={(v) => setGlasses(p => ({ ...p, height: v }))} />
                <CompactField label={t('lensType')} placeholder="Unifocal" value={glasses.lensType} onChange={(v) => setGlasses(p => ({ ...p, lensType: v }))} />
                <CompactField label={t('lensMaterial')} placeholder="Organique" value={glasses.material} onChange={(v) => setGlasses(p => ({ ...p, material: v }))} />
                <CompactField label={t('lensIndex')} placeholder="1.6" value={glasses.index} onChange={(v) => setGlasses(p => ({ ...p, index: v }))} />
                <CompactField label={t('lensDesign')} placeholder="Sphérique" value={glasses.design} onChange={(v) => setGlasses(p => ({ ...p, design: v }))} />
                <CompactField label={t('lensTreatments')} placeholder="Anti-reflet" value={glasses.treatments} onChange={(v) => setGlasses(p => ({ ...p, treatments: v }))} />
              </div>
            </Card>

            {/* ═══ 13. Lentilles de contact ═══ */}
            <Card className="p-4">
              <SectionHeader
                id="lentilles"
                icon={Contact}
                title={t('contactLenses')}
                accent="bg-accent/10 text-accent"
                action={<CopyButton onClick={copyRefractionToContactLens} label={t('copyFromRefraction')} />}
              />
              <div className="mb-3">
                <Label className="text-xs text-muted-foreground">{t('contactLensType')}</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {contactLensTypes.map((ct) => (
                    <button
                      key={ct.key}
                      type="button"
                      onClick={() => setContactLens(p => ({ ...p, type: ct.key }))}
                      className={cn(
                        'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                        contactLens.type === ct.key
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <CompactField label={t('manufacturer')} placeholder="Alcon" value={contactLens.manufacturer} onChange={(v) => setContactLens(p => ({ ...p, manufacturer: v }))} />
                <CompactField label={t('clBrand')} placeholder="Air Optix" value={contactLens.brand} onChange={(v) => setContactLens(p => ({ ...p, brand: v }))} />
                <CompactField label={t('lensType')} placeholder="Silicone hydrogel" value={contactLens.lensType} onChange={(v) => setContactLens(p => ({ ...p, lensType: v }))} />
                <CompactField label={t('lensMaterial')} placeholder="Lotrafilcon B" value={contactLens.material} onChange={(v) => setContactLens(p => ({ ...p, material: v }))} />
                <CompactField label={t('bc')} placeholder="8.6" value={contactLens.bc} onChange={(v) => setContactLens(p => ({ ...p, bc: v }))} />
                <CompactField label={t('dia')} placeholder="14.0" value={contactLens.dia} onChange={(v) => setContactLens(p => ({ ...p, dia: v }))} />
                <CompactField label={t('power')} placeholder="0.00" value={contactLens.power} onChange={(v) => setContactLens(p => ({ ...p, power: v }))} />
                <CompactField label="CYL" placeholder="0.00" value={contactLens.cyl} onChange={(v) => setContactLens(p => ({ ...p, cyl: v }))} />
                <CompactField label="AXE" placeholder="0°" value={contactLens.axis} onChange={(v) => setContactLens(p => ({ ...p, axis: v }))} />
                <CompactField label="ADD" placeholder="0.00" value={contactLens.add} onChange={(v) => setContactLens(p => ({ ...p, add: v }))} />
                <CompactField label={t('replacement')} placeholder="Mensuel" value={contactLens.replacement} onChange={(v) => setContactLens(p => ({ ...p, replacement: v }))} />
                <CompactField label={t('wearMode')} placeholder="Journalier" value={contactLens.wearMode} onChange={(v) => setContactLens(p => ({ ...p, wearMode: v }))} />
              </div>
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">{t('eye')}</Label>
                <div className="mt-1 flex gap-1">
                  {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setContactLens(p => ({ ...p, eye: e }))}
                      className={cn(
                        'rounded-md border px-3 py-1 text-xs font-bold transition-all',
                        contactLens.eye === e ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              {/* Fitting / evaluation fields */}
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <CompactField label={t('trialLens')} placeholder="Essai" value={contactLens.trialLens} onChange={(v) => setContactLens(p => ({ ...p, trialLens: v }))} />
                <CompactField label={t('overRefraction')} placeholder="0.00" value={contactLens.overRefraction} onChange={(v) => setContactLens(p => ({ ...p, overRefraction: v }))} />
                <CompactField label={t('movement')} placeholder="Normal" value={contactLens.movement} onChange={(v) => setContactLens(p => ({ ...p, movement: v }))} />
                <CompactField label={t('centration')} placeholder="Centrée" value={contactLens.centration} onChange={(v) => setContactLens(p => ({ ...p, centration: v }))} />
                <CompactField label={t('comfort')} placeholder="Bon" value={contactLens.comfort} onChange={(v) => setContactLens(p => ({ ...p, comfort: v }))} />
                <CompactField label={t('tearFilm')} placeholder="Stable" value={contactLens.tearFilm} onChange={(v) => setContactLens(p => ({ ...p, tearFilm: v }))} />
                <CompactField label={t('wearingTime')} placeholder="8h" value={contactLens.wearingTime} onChange={(v) => setContactLens(p => ({ ...p, wearingTime: v }))} />
                <CompactField label={t('finalLens')} placeholder="Oui" value={contactLens.finalLens} onChange={(v) => setContactLens(p => ({ ...p, finalLens: v }))} />
              </div>
            </Card>

            {/* ═══ Spécialités ophtalmologiques ═══ */}
            <div className="space-y-4 pt-2">
              <Card className="p-1.5 shadow-card">
                <SpecialtyNavigation active={activeSpecialty} onChange={setActiveSpecialty} />
              </Card>
              {activeSpecialty === 'glaucoma' && <GlaucomaSection />}
              {activeSpecialty === 'cataract' && <CataractSection />}
              {activeSpecialty === 'retina' && <RetinaSection />}
              {activeSpecialty === 'cornea' && <CorneaSection />}
              {activeSpecialty === 'surgery' && <SurgicalSection />}
            </div>

            {/* ── Secondary collapsible sections ────────────────────────── */}
            <div className="space-y-2 pt-2">
              <CollapsibleSection title={t('antecedents')} icon={HeartPulse}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Antécédents médicaux</Label>
                    <Textarea placeholder="HTA, diabète..." rows={2} className="mt-1 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Antécédents chirurgicaux</Label>
                    <Textarea placeholder="Chirurgie de cataracte..." rows={2} className="mt-1 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Antécédents familiaux</Label>
                    <Textarea placeholder="Glaucome familial..." rows={2} className="mt-1 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Antécédents ophtalmologiques</Label>
                    <Textarea placeholder="Port de lunettes depuis..." rows={2} className="mt-1 text-sm" />
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title={t('allergies') + ' / ' + t('treatments')} icon={Droplet}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('allergies')}</Label>
                    <Textarea placeholder="Pénicilline, iode..." rows={2} className="mt-1 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('treatments')}</Label>
                    <Textarea placeholder="Latanoprost 0.005%..." rows={2} className="mt-1 text-sm" />
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title={t('constants')} icon={Thermometer}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">TA (mmHg)</Label>
                    <Input placeholder="120/80" className="mt-1 h-8 text-sm tabular-nums" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">FC (bpm)</Label>
                    <Input placeholder="72" className="mt-1 h-8 text-sm tabular-nums" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Poids (kg)</Label>
                    <Input placeholder="70" className="mt-1 h-8 text-sm tabular-nums" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Taille (cm)</Label>
                    <Input placeholder="170" className="mt-1 h-8 text-sm tabular-nums" />
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Imagerie demandée" icon={ImageIcon}>
                <Textarea placeholder="OCT, rétinographie, angiographie..." rows={2} className="text-sm" />
              </CollapsibleSection>

              <CollapsibleSection title="Analyses biologiques" icon={FlaskConical}>
                <Textarea placeholder="Glycémie, HbA1c, bilan lipidique..." rows={2} className="text-sm" />
              </CollapsibleSection>

              <CollapsibleSection title={t('followUp')} icon={Calendar}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('nextAppointment')}</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('followUpPeriod')}</Label>
                    <Input placeholder="1 mois" className="mt-1" />
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>

        {/* RIGHT: Quick Actions */}
        <div className="space-y-3">
          <Card className="p-3.5">
            <h3 className="mb-2.5 text-sm font-semibold">Actions rapides</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/prescriptions')}>
                <Pill className="h-4 w-4" />
                {t('prescription')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/appointments')}>
                <Calendar className="h-4 w-4" />
                {t('appointment')}
              </Button>
              <div className="my-1.5 border-t border-border/40" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Ajouter</p>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/imaging')}>
                <ImageIcon className="h-4 w-4" />
                {t('addImaging')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/imaging')}>
                <Stethoscope className="h-4 w-4" />
                {t('addExam')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/documents')}>
                <FlaskConical className="h-4 w-4" />
                {t('addLabResult')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/documents')}>
                <FileText className="h-4 w-4" />
                {t('addDocument')}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Previous Exam Comparison Drawer ─────────────────────────────────── */}
      <Sheet open={showComparison} onOpenChange={setShowComparison}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              {t('previousExamComparison')}
            </SheetTitle>
            <SheetDescription>
              {patient.firstName} {patient.lastName} · {patient.patientId}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {/* Acuité visuelle */}
            <ComparisonCard title={t('previousVA')} icon={Eye}>
              <ComparisonRow label={`${t('farVision')} OD`} prev="8/10" current={vaData.OD.farWithoutCorrection || '—'} />
              <ComparisonRow label={`${t('farVision')} OG`} prev="9/10" current={vaData.OG.farWithoutCorrection || '—'} />
              <ComparisonRow label={`${t('nearVision')} OD`} prev="Parfait" current={vaData.OD.nearWithoutCorrection || '—'} />
              <ComparisonRow label={`${t('nearVision')} OG`} prev="Parfait" current={vaData.OG.nearWithoutCorrection || '—'} />
            </ComparisonCard>

            {/* Réfraction */}
            <ComparisonCard title={t('previousRefraction')} icon={Eye}>
              {(['OD', 'OG'] as EyeSide[]).map((side) => (
                <div key={side} className="mb-2">
                  <p className="text-xs font-bold text-muted-foreground">{side}</p>
                  <ComparisonRow label="SPH" prev="-2.50" current={refractionData.finale[side].sph || '—'} />
                  <ComparisonRow label="CYL" prev="-0.75" current={refractionData.finale[side].cyl || '—'} />
                  <ComparisonRow label="AXE" prev="90°" current={refractionData.finale[side].axis || '—'} />
                </div>
              ))}
            </ComparisonCard>

            {/* PIO */}
            <ComparisonCard title={t('previousIOP')} icon={Activity}>
              <ComparisonRow label="OD" prev="14 mmHg" current={tonoData.OD.iop ? `${tonoData.OD.iop} mmHg` : '—'} />
              <ComparisonRow label="OG" prev="15 mmHg" current={tonoData.OG.iop ? `${tonoData.OG.iop} mmHg` : '—'} />
            </ComparisonCard>

            {/* Pachymétrie */}
            <ComparisonCard title={t('previousPachymetry')} icon={Ruler}>
              <ComparisonRow label="OD" prev="540 µm" current={pachyData.OD.cct ? `${pachyData.OD.cct} µm` : '—'} />
              <ComparisonRow label="OG" prev="545 µm" current={pachyData.OG.cct ? `${pachyData.OG.cct} µm` : '—'} />
            </ComparisonCard>

            {/* Kératométrie */}
            <ComparisonCard title={t('previousKeratometry')} icon={Ruler}>
              {(['OD', 'OG'] as EyeSide[]).map((side) => (
                <div key={side} className="mb-2">
                  <p className="text-xs font-bold text-muted-foreground">{side}</p>
                  <ComparisonRow label="K1" prev="43.00" current={keratoData[side].k1 || '—'} />
                  <ComparisonRow label="K2" prev="44.00" current={keratoData[side].k2 || '—'} />
                </div>
              ))}
            </ComparisonCard>

            {/* Diagnostics */}
            <ComparisonCard title={t('previousDiagnoses')} icon={FileText}>
              {previousConsultations.map((c) => (
                <div key={c.id} className="mb-2 rounded-lg border border-border/60 p-2">
                  <p className="text-xs text-muted-foreground">{c.date}</p>
                  <p className="text-sm font-medium">{c.primaryDiagnosis}</p>
                </div>
              ))}
            </ComparisonCard>

            {/* Prescriptions */}
            <ComparisonCard title={t('previousPrescriptions')} icon={Pill}>
              {previousPrescriptions.map((p) => (
                <div key={p.id} className="mb-2 rounded-lg border border-border/60 p-2">
                  <p className="text-xs text-muted-foreground">{p.date} · {p.prescriptionId}</p>
                  <p className="text-sm font-medium">{p.items[0]?.medicationName}</p>
                </div>
              ))}
            </ComparisonCard>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ── Comparison sub-components ─────────────────────────────────────────────────

function ComparisonCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 p-3">
      <div className="mb-2 flex items-center gap-2 border-b border-border/40 pb-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      </div>
      {children}
    </div>
  );
}

function ComparisonRow({ label, prev, current }: { label: string; prev: string; current: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground/70">{prev}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
        <span className="font-medium tabular-nums">{current}</span>
      </div>
    </div>
  );
}
