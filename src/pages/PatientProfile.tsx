import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, User, Droplet, Briefcase,
  Shield, Stethoscope, CalendarPlus, Pill, Microscope,
  FileText, CreditCard, Activity, Clock, AlertTriangle, Eye,
  Syringe, Heart, ChevronRight, Filter,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { mockPatients } from '@/data/mockPatients';
import { mockConsultations } from '@/data/mockConsultations';
import { mockPrescriptions, mockExaminations, mockInvoices, mockDocuments } from '@/data/mockClinical';
import {
  mockAllergies, mockTreatments, mockMedicalHistory,
  mockOphthoHistory, mockSurgicalHistory, mockPatientTimeline,
} from '@/data/mockMedicalRecords';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { EyeBadge } from '@/components/shared/EyeBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import type {
  TimelineType, Allergy, CurrentTreatment, MedicalHistoryEntry,
  OphthalmologicalHistoryEntry, SurgicalRecord,
} from '@/types';

// ── Timeline config ──────────────────────────────────────────────────────────

const timelineIcons: Record<TimelineType, LucideIcon> = {
  consultation: Stethoscope,
  examen: Microscope,
  diagnostic: FileText,
  prescription: Pill,
  imagerie: Eye,
  laboratoire: FileText,
  intervention: Syringe,
  traitement: Pill,
  suivi: Calendar,
  document: FileText,
};

const timelineColors: Record<TimelineType, string> = {
  consultation: 'bg-primary/10 text-primary',
  examen: 'bg-accent/10 text-accent',
  diagnostic: 'bg-chart-5/10 text-chart-5',
  prescription: 'bg-success/10 text-success',
  imagerie: 'bg-warning/10 text-warning',
  laboratoire: 'bg-muted text-muted-foreground',
  intervention: 'bg-destructive/10 text-destructive',
  traitement: 'bg-success/10 text-success',
  suivi: 'bg-chart-5/10 text-chart-5',
  document: 'bg-muted text-muted-foreground',
};

const timelineTypeLabels: Record<TimelineType, string> = {
  consultation: 'Consultation',
  examen: 'Examen',
  diagnostic: 'Diagnostic',
  prescription: 'Prescription',
  imagerie: 'Imagerie',
  laboratoire: 'Laboratoire',
  intervention: 'Intervention',
  traitement: 'Traitement',
  suivi: 'Suivi',
  document: 'Document',
};

const severityColors: Record<string, string> = {
  légère: 'bg-success/10 text-success border-success/30',
  modérée: 'bg-warning/10 text-warning border-warning/30',
  sévère: 'bg-destructive/10 text-destructive border-destructive/30',
  inconnue: 'bg-muted text-muted-foreground border-border',
};

// ── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, accent }: { icon: LucideIcon; title: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-2 mb-3">
      <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', accent || 'bg-primary/10 text-primary')}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <h3 className="text-sm font-bold tracking-tight">{title}</h3>
    </div>
  );
}

function DenseTable<T>({
  columns, rows, renderRow, onRowClick,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
}) {
  if (rows.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">Aucune donnée</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {columns.map((col) => (
              <th key={col.key} className={cn('px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground', col.className)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn('border-b border-border/40 transition-colors hover:bg-muted/20', onRowClick && 'cursor-pointer')}
              onClick={() => onRowClick?.(row)}
            >
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const patient = mockPatients.find(p => p.id === id) || mockPatients[0];
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();

  const [timelineFilter, setTimelineFilter] = useState<TimelineType | 'all'>('all');
  const [detailItem, setDetailItem] = useState<SurgicalRecord | MedicalHistoryEntry | null>(null);
  const [detailType, setDetailType] = useState<'surgical' | 'medical'>('surgical');

  // Filter data for this patient
  const allergies = mockAllergies.filter(a => a.patientId === patient.id);
  const treatments = mockTreatments.filter(tr => tr.patientId === patient.id);
  const medicalHistory = mockMedicalHistory.filter(mh => mh.patientId === patient.id);
  const ophthoHistory = mockOphthoHistory.filter(oh => oh.patientId === patient.id);
  const surgicalHistory = mockSurgicalHistory.filter(s => s.patientId === patient.id);
  const timeline = mockPatientTimeline.filter(tl => tl.patientId === patient.id);
  const consultations = mockConsultations.filter(c => c.patientId === patient.id);
  const prescriptions = mockPrescriptions.filter(p => p.patientId === patient.id);
  const exams = mockExaminations.filter(e => e.patientId === patient.id);
  const invoices = mockInvoices.filter(inv => inv.patientId === patient.id);
  const documents = mockDocuments.filter(d => d.patientId === patient.id);

  const filteredTimeline = useMemo(() => {
    let result = timeline;
    if (timelineFilter !== 'all') {
      result = result.filter(e => e.type === timelineFilter);
    }
    return [...result].sort((a, b) => b.date.localeCompare(a.date));
  }, [timeline, timelineFilter]);

  const criticalAllergies = allergies.filter(a => a.severity === 'sévère' || a.severity === 'modérée');

  const openSurgicalDetail = (s: SurgicalRecord) => {
    setDetailItem(s);
    setDetailType('surgical');
  };

  const openMedicalDetail = (m: MedicalHistoryEntry) => {
    setDetailItem(m);
    setDetailType('medical');
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('back')}
      </button>

      {/* ── Patient Header ─────────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-16 border-b border-border bg-primary/5" />
        <div className="px-5 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between -mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card text-2xl font-bold text-primary shadow-card ring-4 ring-card">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div className="pb-1">
                <h1 className="text-lg font-bold tracking-tight">{patient.firstName} {patient.lastName}</h1>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{patient.patientId}</span>
                  <span>·</span>
                  <span>{age} ans</span>
                  <span>·</span>
                  <span>{patient.gender === 'male' ? t('male') : t('female')}</span>
                  <span>·</span>
                  <span>{patient.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="gap-2" onClick={() => navigate('/consultation')}>
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">{t('newConsultation')}</span>
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => navigate('/appointments')}>
                <CalendarPlus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('appointment')}</span>
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => navigate('/prescriptions')}>
                <Pill className="h-4 w-4" />
                <span className="hidden sm:inline">{t('prescription')}</span>
              </Button>
            </div>
          </div>

          {/* Alert banner */}
          {criticalAllergies.length > 0 && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-destructive">{t('importantAlerts')}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {criticalAllergies.map(a => (
                    <Badge key={a.id} variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-xs">
                      {a.substance} ({a.severity})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 overflow-x-auto bg-muted/50 p-1.5">
          <TabsTrigger value="overview" className="gap-1.5">{t('overview')}</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">{t('medicalHistory')}</TabsTrigger>
          <TabsTrigger value="ophtho" className="gap-1.5">{t('ophthalmologicalHistory')}</TabsTrigger>
          <TabsTrigger value="surgical" className="gap-1.5">{t('surgicalHistory')}</TabsTrigger>
          <TabsTrigger value="consultations" className="gap-1.5">{t('previousConsultations')}</TabsTrigger>
          <TabsTrigger value="prescriptions" className="gap-1.5">{t('previousPrescriptions')}</TabsTrigger>
          <TabsTrigger value="exams" className="gap-1.5">{t('examHistory')}</TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">{t('documents')}</TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5">{t('billing')}</TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1.5">{t('clinicalTimeline')}</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ───────────────────────────────────────────────── */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Identity */}
            <Card className="p-4">
              <SectionTitle icon={User} title={t('identity')} />
              <div className="space-y-2.5 text-sm">
                <InfoRow icon={Calendar} label={t('birthDate')} value={patient.birthDate} />
                <InfoRow icon={User} label={t('gender')} value={patient.gender === 'male' ? t('male') : t('female')} />
                <InfoRow icon={Phone} label={t('phone')} value={patient.phone} />
                <InfoRow icon={Mail} label={t('email')} value={patient.email} />
                <InfoRow icon={MapPin} label={t('address')} value={patient.address} />
                <InfoRow icon={MapPin} label={t('city')} value={patient.city} />
                <InfoRow icon={Briefcase} label={t('profession')} value={patient.profession} />
                <InfoRow icon={Droplet} label={t('bloodType')} value={patient.bloodType} />
                <InfoRow icon={Shield} label={t('insurance')} value={patient.insurance} />
                <InfoRow icon={User} label={t('referringDoctor')} value={patient.referringDoctor || 'Dr. Sabeg Ilias'} />
                <InfoRow icon={Phone} label={t('emergencyContact')} value={patient.emergencyContact} />
                <InfoRow icon={Phone} label={t('emergencyPhone')} value={patient.emergencyPhone} />
                <InfoRow icon={Calendar} label={t('createdAt')} value={patient.createdAt} />
              </div>
            </Card>

            {/* Allergies + Treatments */}
            <div className="space-y-4">
              <Card className="p-4">
                <SectionTitle icon={AlertTriangle} title={t('allergies')} accent="bg-destructive/10 text-destructive" />
                {allergies.length === 0 ? (
                  <p className="py-3 text-center text-sm text-muted-foreground">{t('noAlerts')}</p>
                ) : (
                  <DenseTable<Allergy>
                    columns={[
                      { key: 'substance', label: t('substance') },
                      { key: 'type', label: t('allergyType') },
                      { key: 'reaction', label: t('reaction') },
                      { key: 'severity', label: t('severity') },
                    ]}
                    rows={allergies}
                    renderRow={(a) => (
                      <>
                        <td className="px-3 py-2 font-medium">{a.substance}</td>
                        <td className="px-3 py-2 text-muted-foreground">{a.type}</td>
                        <td className="px-3 py-2 text-muted-foreground">{a.reaction}</td>
                        <td className="px-3 py-2">
                          <span className={cn('rounded-md border px-2 py-0.5 text-[11px] font-medium', severityColors[a.severity])}>
                            {a.severity}
                          </span>
                        </td>
                      </>
                    )}
                  />
                )}
              </Card>

              <Card className="p-4">
                <SectionTitle icon={Pill} title={t('currentTreatments')} accent="bg-success/10 text-success" />
                {treatments.length === 0 ? (
                  <p className="py-3 text-center text-sm text-muted-foreground">{t('noData')}</p>
                ) : (
                  <DenseTable<CurrentTreatment>
                    columns={[
                      { key: 'medication', label: t('medication') },
                      { key: 'type', label: t('treatmentType') },
                      { key: 'eye', label: t('eye') },
                      { key: 'posology', label: t('posology') },
                      { key: 'frequency', label: t('frequency') },
                    ]}
                    rows={treatments}
                    renderRow={(tr) => (
                      <>
                        <td className="px-3 py-2 font-medium">{tr.medication}</td>
                        <td className="px-3 py-2 text-muted-foreground">{tr.type}</td>
                        <td className="px-3 py-2">{tr.eye && <span className="text-xs font-bold">{tr.eye}</span>}</td>
                        <td className="px-3 py-2 text-muted-foreground">{tr.posology}</td>
                        <td className="px-3 py-2 text-muted-foreground">{tr.frequency}</td>
                      </>
                    )}
                  />
                )}
              </Card>
            </div>

            {/* Medical summary + quick timeline */}
            <div className="space-y-4">
              <Card className="p-4">
                <SectionTitle icon={Activity} title={t('medicalInfo')} accent="bg-accent/10 text-accent" />
                <div className="space-y-2">
                  <div className="rounded-lg border border-border/60 p-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{t('diagnosis')}</p>
                    <p className="mt-0.5 text-sm font-medium">{patient.lastDiagnosis || t('noData')}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{t('lastVisit')}</p>
                    <p className="mt-0.5 text-sm font-medium">{patient.lastVisit || t('noData')}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-border/60 p-2.5 text-center">
                      <p className="text-[10px] uppercase text-muted-foreground">Consult.</p>
                      <p className="text-lg font-bold text-primary">{consultations.length}</p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-2.5 text-center">
                      <p className="text-[10px] uppercase text-muted-foreground">Examens</p>
                      <p className="text-lg font-bold text-accent">{exams.length}</p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-2.5 text-center">
                      <p className="text-[10px] uppercase text-muted-foreground">Ordonn.</p>
                      <p className="text-lg font-bold text-success">{prescriptions.length}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <SectionTitle icon={Clock} title={t('timeline')} accent="bg-chart-5/10 text-chart-5" />
                <div className="space-y-2.5">
                  {filteredTimeline.slice(0, 5).map((event) => {
                    const Icon = timelineIcons[event.type];
                    return (
                      <div key={event.id} className="flex gap-2.5">
                        <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', timelineColors[event.type])}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-tight">{event.title}</p>
                          <p className="text-xs text-muted-foreground leading-tight">{event.date}</p>
                        </div>
                      </div>
                    );
                  })}
                  {filteredTimeline.length === 0 && (
                    <p className="py-3 text-center text-sm text-muted-foreground">{t('noData')}</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Medical History Tab ────────────────────────────────────────── */}
        <TabsContent value="history" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={Heart} title={t('medicalHistory')} accent="bg-destructive/10 text-destructive" />
            <DenseTable<MedicalHistoryEntry>
              columns={[
                { key: 'label', label: 'Pathologie' },
                { key: 'present', label: t('present') },
                { key: 'details', label: t('details') },
                { key: 'action', label: '' },
              ]}
              rows={medicalHistory}
              renderRow={(mh) => (
                <>
                  <td className="px-3 py-2 font-medium">{mh.label}</td>
                  <td className="px-3 py-2">
                    {mh.present ? (
                      <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">Oui</span>
                    ) : (
                      <span className="rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">Non</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{mh.details || '—'}</td>
                  <td className="px-3 py-2 text-end">
                    {mh.diabetesDetail && (
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={(e) => { e.stopPropagation(); openMedicalDetail(mh); }}>
                        {t('viewDetails')}
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </td>
                </>
              )}
              onRowClick={openMedicalDetail}
            />
          </Card>
        </TabsContent>

        {/* ── Ophthalmological History Tab ──────────────────────────────── */}
        <TabsContent value="ophtho" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={Eye} title={t('ophthalmologicalHistory')} />
            <DenseTable<OphthalmologicalHistoryEntry>
              columns={[
                { key: 'condition', label: t('condition') },
                { key: 'eye', label: t('eye') },
                { key: 'date', label: t('diagnosedDate') },
                { key: 'notes', label: t('notes') },
              ]}
              rows={ophthoHistory}
              renderRow={(oh) => (
                <>
                  <td className="px-3 py-2 font-medium">{oh.label}</td>
                  <td className="px-3 py-2"><span className="text-xs font-bold">{oh.eye}</span></td>
                  <td className="px-3 py-2 text-muted-foreground">{oh.diagnosedDate || '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">{oh.notes || '—'}</td>
                </>
              )}
            />
          </Card>
        </TabsContent>

        {/* ── Surgical History Tab ───────────────────────────────────────── */}
        <TabsContent value="surgical" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={Syringe} title={t('surgicalHistory')} accent="bg-destructive/10 text-destructive" />
            <DenseTable<SurgicalRecord>
              columns={[
                { key: 'intervention', label: t('intervention') },
                { key: 'eye', label: t('eye') },
                { key: 'date', label: t('date') },
                { key: 'surgeon', label: t('surgeon') },
                { key: 'facility', label: t('facility') },
                { key: 'result', label: t('result') },
                { key: 'action', label: '' },
              ]}
              rows={surgicalHistory}
              renderRow={(s) => (
                <>
                  <td className="px-3 py-2 font-medium">{s.intervention}</td>
                  <td className="px-3 py-2"><span className="text-xs font-bold">{s.eye}</span></td>
                  <td className="px-3 py-2 text-muted-foreground">{s.date || '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.surgeon || '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.facility || '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.result || '—'}</td>
                  <td className="px-3 py-2 text-end">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={(e) => { e.stopPropagation(); openSurgicalDetail(s); }}>
                      {t('viewDetails')}
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </td>
                </>
              )}
              onRowClick={openSurgicalDetail}
            />
          </Card>
        </TabsContent>

        {/* ── Consultations Tab ──────────────────────────────────────────── */}
        <TabsContent value="consultations" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={Stethoscope} title={t('previousConsultations')} />
            {consultations.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">{t('noData')}</p>
            ) : (
              <DenseTable
                columns={[
                  { key: 'date', label: t('date') },
                  { key: 'reason', label: t('reason') },
                  { key: 'diagnosis', label: t('diagnosis') },
                  { key: 'doctor', label: t('doctor') },
                  { key: 'action', label: '' },
                ]}
                rows={consultations}
                renderRow={(c: typeof consultations[0]) => (
                  <>
                    <td className="px-3 py-2 text-muted-foreground">{c.date}</td>
                    <td className="px-3 py-2 font-medium">{c.reason}</td>
                    <td className="px-3 py-2">{c.primaryDiagnosis}</td>
                    <td className="px-3 py-2 text-muted-foreground">{c.doctorName}</td>
                    <td className="px-3 py-2 text-end">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/consultation')}>{t('view')}</Button>
                    </td>
                  </>
                )}
                onRowClick={() => navigate('/consultation')}
              />
            )}
          </Card>
        </TabsContent>

        {/* ── Prescriptions Tab ────────────────────────────────────────── */}
        <TabsContent value="prescriptions" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={Pill} title={t('previousPrescriptions')} accent="bg-success/10 text-success" />
            {prescriptions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">{t('noData')}</p>
            ) : (
              <DenseTable
                columns={[
                  { key: 'id', label: t('prescriptionNumber') },
                  { key: 'date', label: t('date') },
                  { key: 'items', label: 'Médicaments' },
                  { key: 'doctor', label: t('doctor') },
                  { key: 'action', label: '' },
                ]}
                rows={prescriptions}
                renderRow={(p: typeof prescriptions[0]) => (
                  <>
                    <td className="px-3 py-2 font-medium">{p.prescriptionId}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.date}</td>
                    <td className="px-3 py-2">{p.items.length} médicament(s)</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.doctorName}</td>
                    <td className="px-3 py-2 text-end">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/prescriptions')}>{t('view')}</Button>
                    </td>
                  </>
                )}
                onRowClick={() => navigate('/prescriptions')}
              />
            )}
          </Card>
        </TabsContent>

        {/* ── Exams Tab ──────────────────────────────────────────────────── */}
        <TabsContent value="exams" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={Microscope} title={t('examHistory')} accent="bg-accent/10 text-accent" />
            {exams.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">{t('noData')}</p>
            ) : (
              <DenseTable
                columns={[
                  { key: 'type', label: t('type') },
                  { key: 'eye', label: t('eye') },
                  { key: 'date', label: t('date') },
                  { key: 'result', label: t('result') },
                  { key: 'doctor', label: t('doctor') },
                ]}
                rows={exams}
                renderRow={(e: typeof exams[0]) => (
                  <>
                    <td className="px-3 py-2 font-medium">{e.type}</td>
                    <td className="px-3 py-2">{e.eye === 'both' ? <span className="text-xs font-bold">OU</span> : <EyeBadge side={e.eye === 'OD' ? 'OD' : 'OG'} size="sm" />}</td>
                    <td className="px-3 py-2 text-muted-foreground">{e.date}</td>
                    <td className="px-3 py-2">{e.result}</td>
                    <td className="px-3 py-2 text-muted-foreground">{e.doctorName}</td>
                  </>
                )}
              />
            )}
          </Card>
        </TabsContent>

        {/* ── Documents Tab ──────────────────────────────────────────────── */}
        <TabsContent value="documents" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={FileText} title={t('documents')} />
            {documents.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">{t('noData')}</p>
            ) : (
              <DenseTable
                columns={[
                  { key: 'title', label: 'Titre' },
                  { key: 'type', label: t('type') },
                  { key: 'date', label: t('date') },
                  { key: 'size', label: 'Taille' },
                  { key: 'by', label: 'Téléversé par' },
                ]}
                rows={documents}
                renderRow={(d: typeof documents[0]) => (
                  <>
                    <td className="px-3 py-2 font-medium">{d.title}</td>
                    <td className="px-3 py-2 text-muted-foreground">{d.type}</td>
                    <td className="px-3 py-2 text-muted-foreground">{d.date}</td>
                    <td className="px-3 py-2 text-muted-foreground">{d.size || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{d.uploadedBy}</td>
                  </>
                )}
              />
            )}
          </Card>
        </TabsContent>

        {/* ── Billing Tab ────────────────────────────────────────────────── */}
        <TabsContent value="billing" className="mt-4">
          <Card className="p-4">
            <SectionTitle icon={CreditCard} title={t('billing')} accent="bg-chart-5/10 text-chart-5" />
            {invoices.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">{t('noData')}</p>
            ) : (
              <DenseTable
                columns={[
                  { key: 'id', label: 'N° Facture' },
                  { key: 'date', label: t('date') },
                  { key: 'total', label: 'Total' },
                  { key: 'paid', label: 'Payé' },
                  { key: 'remaining', label: 'Restant' },
                  { key: 'status', label: t('status') },
                ]}
                rows={invoices}
                renderRow={(inv: typeof invoices[0]) => (
                  <>
                    <td className="px-3 py-2 font-medium">{inv.invoiceNumber}</td>
                    <td className="px-3 py-2 text-muted-foreground">{inv.date}</td>
                    <td className="px-3 py-2">{inv.total.toLocaleString()} {t('da')}</td>
                    <td className="px-3 py-2 text-success">{inv.paid.toLocaleString()} {t('da')}</td>
                    <td className="px-3 py-2 text-destructive">{inv.remaining.toLocaleString()} {t('da')}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={inv.paymentStatus === 'paid' ? 'confirmed' : inv.paymentStatus === 'partial' ? 'pending' : 'cancelled'} type="payment" />
                    </td>
                  </>
                )}
                onRowClick={() => navigate('/billing')}
              />
            )}
          </Card>
        </TabsContent>

        {/* ── Timeline Tab ───────────────────────────────────────────────── */}
        <TabsContent value="timeline" className="mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={Clock} title={t('clinicalTimeline')} accent="bg-chart-5/10 text-chart-5" />
              {/* Filter buttons */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <button
                  onClick={() => setTimelineFilter('all')}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    timelineFilter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {t('allTypes')}
                </button>
                {(Object.keys(timelineTypeLabels) as TimelineType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTimelineFilter(type)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                      timelineFilter === type ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {timelineTypeLabels[type]}
                  </button>
                ))}
              </div>
            </div>

            {filteredTimeline.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t('noData')}</p>
            ) : (
              <div className="relative">
                <div className="absolute top-0 bottom-0 w-px bg-border" style={{ insetInlineStart: '15px' }} />
                <div className="space-y-4">
                  {filteredTimeline.map((event) => {
                    const Icon = timelineIcons[event.type];
                    return (
                      <div key={event.id} className="relative flex gap-3">
                        <div className={cn(
                          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card',
                          timelineColors[event.type]
                        )}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-semibold">{event.title}</p>
                            <span className="text-xs text-muted-foreground">{event.date}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
                          {event.doctor && <p className="mt-0.5 text-[11px] text-muted-foreground/70">{event.doctor}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Detail Drawer ─────────────────────────────────────────────────── */}
      <Sheet open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {detailItem && detailType === 'surgical' && (() => {
            const s = detailItem as SurgicalRecord;
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Syringe className="h-4 w-4 text-destructive" />
                    {s.intervention}
                  </SheetTitle>
                  <SheetDescription>
                    {s.eye} · {s.date || 'Date non précisée'}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-3 text-sm">
                  <InfoRow icon={User} label={t('surgeon')} value={s.surgeon} />
                  <InfoRow icon={MapPin} label={t('facility')} value={s.facility} />
                  <InfoRow icon={FileText} label={t('indication')} value={s.indication} />
                  <InfoRow icon={Eye} label={t('implant')} value={s.implant} />
                  <InfoRow icon={Activity} label={t('result')} value={s.result} />
                  <InfoRow icon={AlertTriangle} label={t('complications')} value={s.complications} />
                  <InfoRow icon={Pill} label={t('postopTreatment')} value={s.postopTreatment} />
                  <InfoRow icon={FileText} label={t('notes')} value={s.notes} />
                </div>
              </>
            );
          })()}
          {detailItem && detailType === 'medical' && (() => {
            const m = detailItem as MedicalHistoryEntry;
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-destructive" />
                    {m.label}
                  </SheetTitle>
                  <SheetDescription>
                    {m.present ? 'Présent' : 'Absent'}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-3 text-sm">
                  {m.details && <InfoRow icon={FileText} label={t('details')} value={m.details} />}
                  {m.diabetesDetail && (
                    <>
                      <div className="rounded-lg border border-border/60 p-3 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('diabetes')}</p>
                        <InfoRow icon={FileText} label={t('diabetesType')} value={m.diabetesDetail.type} />
                        <InfoRow icon={Clock} label={t('diabetesDuration')} value={m.diabetesDetail.duration} />
                        <InfoRow icon={Pill} label={t('diabetesTreatment')} value={m.diabetesDetail.treatment} />
                        <InfoRow icon={Activity} label={t('hba1c')} value={m.diabetesDetail.hba1c} />
                        <InfoRow icon={Activity} label={t('glycemia')} value={m.diabetesDetail.glycemia} />
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[11px] text-muted-foreground">{t('knownRetinopathy')}</p>
                            <p className="font-medium">{m.diabetesDetail.knownRetinopathy ? 'Oui' : 'Non'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground">{t('laser')}</p>
                            <p className="font-medium">{m.diabetesDetail.laser ? 'Oui' : 'Non'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground">{t('intravitrealInjections')}</p>
                            <p className="font-medium">{m.diabetesDetail.intravitrealInjections ? 'Oui' : 'Non'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground">{t('vitrectomy')}</p>
                            <p className="font-medium">{m.diabetesDetail.vitrectomy ? 'Oui' : 'Non'}</p>
                          </div>
                        </div>
                        {m.diabetesDetail.notes && <InfoRow icon={FileText} label={t('notes')} value={m.diabetesDetail.notes} />}
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
