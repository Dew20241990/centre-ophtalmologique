import { useState } from 'react';
import { Stethoscope, Plus, Trash2, History, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { SectionHeader, EyeColumn, CompactField, CollapsibleSection } from '@/components/shared/exam/ExamParts';
import { cn } from '@/lib/utils';
import type { EyeScope } from '@/types';
import type {
  SurgicalRecord, PreoperativeEval, ProcedureRecord,
  ImplantDevice, PostoperativeRecord, FollowUpEntry, SurgicalReport, SurgeryStatus,
} from '@/types/ophthalmology';

const procedureTypes = [
  { key: 'cataracte', label: 'Chirurgie de la cataracte' },
  { key: 'glaucome', label: 'Chirurgie du glaucome' },
  { key: 'retinienne', label: 'Chirurgie rétinienne' },
  { key: 'corneenne', label: 'Chirurgie cornéenne' },
  { key: 'refractive', label: 'Chirurgie réfractive' },
  { key: 'strabisme', label: 'Chirurgie du strabisme' },
  { key: 'lacrymal', label: 'Chirurgie lacrymale' },
  { key: 'laser', label: 'Laser' },
  { key: 'injection_iv', label: 'Injection intravitréenne' },
  { key: 'autre', label: 'Autre procédure' },
];

const statusOptions: { key: SurgeryStatus; label: string; cls: string }[] = [
  { key: 'planifiee', label: 'Planifiée', cls: 'bg-primary/10 text-primary' },
  { key: 'realisee', label: 'Réalisée', cls: 'bg-green-500/10 text-green-600' },
  { key: 'annulee', label: 'Annulée', cls: 'bg-destructive/10 text-destructive' },
  { key: 'suivie', label: 'Suivie', cls: 'bg-accent/10 text-accent' },
  { key: 'cloturee', label: 'Clôturée', cls: 'bg-muted text-muted-foreground' },
];

const supplementaryExamOptions = [
  'OCT', 'OCT-A', 'Champ visuel', 'Topographie', 'Tomographie',
  'Biométrie', 'Pachymétrie', 'Rétinographie', 'Échographie', 'Angiographie', 'Autre',
];

const emptyPreop = (): PreoperativeEval => ({
  visualAcuityOD: '', visualAcuityOG: '', iopOD: '', iopOG: '',
  anteriorSegment: '', fundus: '', otherFindings: '',
  supplementaryExams: [], preopWorkup: '', consent: '',
  requiredDocuments: '', currentTreatments: '', allergies: '', remarks: '',
});

const emptyProcedure = (): ProcedureRecord => ({
  date: '', startTime: '', endTime: '', procedurePerformed: '', eye: 'OU',
  surgeon: '', assistant: '', anesthesia: '', technique: '', equipmentUsed: '',
  intraopIncidents: '', complications: '', associatedActs: '', operativeNotes: '',
});

const emptyImplant = (): ImplantDevice => ({
  present: '', type: '', manufacturer: '', model: '', reference: '',
  lotNumber: '', power: '', placement: '', eye: 'OU', material: '', notes: '',
});

const emptyPostop = (): PostoperativeRecord => ({
  date: '', eye: 'OU', visualAcuity: '', iop: '', pain: '', inflammation: '',
  anteriorSegment: '', fundus: '', implantDevice: '', healing: '',
  complications: '', treatment: '', instructions: '', notes: '',
});

const emptyFollowUp = (): FollowUpEntry => ({
  id: crypto.randomUUID(), date: '', delaySinceSurgery: '',
  visualAcuityOD: '', visualAcuityOG: '', iopOD: '', iopOG: '',
  clinicalExam: '', imaging: '', treatment: '', evolution: '',
  complication: '', nextVisit: '', notes: '',
});

const emptyReport = (): SurgicalReport => ({
  indication: '', procedure: '', date: '', eye: 'OU', surgeon: '',
  findings: '', course: '', incidentsComplications: '', implantDevice: '',
  postopTreatment: '', instructions: '', followUp: '', conclusion: '', notes: '',
});

const emptyRecord = (): SurgicalRecord => ({
  id: crypto.randomUUID(), consultationId: '', patientId: '',
  procedureType: '', eye: 'OU', indication: '', associatedDiagnosis: '',
  functionalImpairment: '', procedureGoal: '', plannedDate: '', surgeon: '',
  facility: '', notes: '', status: 'planifiee',
  preoperative: emptyPreop(), procedure: emptyProcedure(),
  implant: emptyImplant(), postoperative: emptyPostop(),
  followUps: [], report: emptyReport(),
});

export function SurgicalSection() {
  const [record, setRecord] = useState<SurgicalRecord>(emptyRecord());
  const [showHistory, setShowHistory] = useState(false);

  const update = <K extends keyof SurgicalRecord>(field: K, value: SurgicalRecord[K]) => {
    setRecord((prev) => ({ ...prev, [field]: value }));
  };

  const updatePreop = (field: keyof PreoperativeEval, value: string | string[]) => {
    setRecord((prev) => ({ ...prev, preoperative: { ...prev.preoperative, [field]: value } }));
  };

  const updateProcedure = (field: keyof ProcedureRecord, value: string) => {
    setRecord((prev) => ({ ...prev, procedure: { ...prev.procedure, [field]: value } }));
  };

  const updateImplant = (field: keyof ImplantDevice, value: string) => {
    setRecord((prev) => ({ ...prev, implant: { ...prev.implant, [field]: value } }));
  };

  const updatePostop = (field: keyof PostoperativeRecord, value: string) => {
    setRecord((prev) => ({ ...prev, postoperative: { ...prev.postoperative, [field]: value } }));
  };

  const updateReport = (field: keyof SurgicalReport, value: string) => {
    setRecord((prev) => ({ ...prev, report: { ...prev.report, [field]: value } }));
  };

  const toggleExam = (exam: string) => {
    setRecord((prev) => ({
      ...prev,
      preoperative: {
        ...prev.preoperative,
        supplementaryExams: prev.preoperative.supplementaryExams.includes(exam)
          ? prev.preoperative.supplementaryExams.filter((e) => e !== exam)
          : [...prev.preoperative.supplementaryExams, exam],
      },
    }));
  };

  const addFollowUp = () => {
    setRecord((prev) => ({ ...prev, followUps: [...prev.followUps, emptyFollowUp()] }));
  };

  const removeFollowUp = (id: string) => {
    setRecord((prev) => ({ ...prev, followUps: prev.followUps.filter((f) => f.id !== id) }));
  };

  const updateFollowUp = (id: string, field: keyof FollowUpEntry, value: string) => {
    setRecord((prev) => ({
      ...prev,
      followUps: prev.followUps.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Status badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Statut :</span>
        <div className="flex flex-wrap gap-1">
          {statusOptions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => update('status', s.key)}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                record.status === s.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* A. Indication */}
      <Card className="p-4">
        <SectionHeader id="surgery-indication" icon={Stethoscope} title="Indication chirurgicale" accent="bg-primary/10 text-primary" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Type de procédure</Label>
              <select
                value={record.procedureType}
                onChange={(e) => update('procedureType', e.target.value)}
                className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="">—</option>
                {procedureTypes.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Œil</Label>
              <div className="mt-0.5 flex gap-1">
                {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                  <button key={e} type="button" onClick={() => update('eye', e)} className={cn('rounded-md border px-2 py-1 text-[11px] font-bold', record.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>{e}</button>
                ))}
              </div>
            </div>
            <CompactField label="Date prévue" placeholder="JJ/MM/AAAA" value={record.plannedDate} onChange={(v) => update('plannedDate', v)} type="date" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CompactField label="Indication" placeholder="Cataracte invalidante..." value={record.indication} onChange={(v) => update('indication', v)} />
            <CompactField label="Diagnostic associé" placeholder="Cataracte sénile OD..." value={record.associatedDiagnosis} onChange={(v) => update('associatedDiagnosis', v)} />
            <CompactField label="Symptômes / gêne fonctionnelle" placeholder="Baisse de vision, éblouissement..." value={record.functionalImpairment} onChange={(v) => update('functionalImpairment', v)} />
            <CompactField label="Objectif de la procédure" placeholder="Amélioration de l'acuité visuelle..." value={record.procedureGoal} onChange={(v) => update('procedureGoal', v)} />
            <CompactField label="Chirurgien" placeholder="Dr. Sabeg Ilias" value={record.surgeon} onChange={(v) => update('surgeon', v)} />
            <CompactField label="Établissement" placeholder="Centre Ophtalmologique..." value={record.facility} onChange={(v) => update('facility', v)} />
          </div>
          <Input value={record.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Notes..." className="h-7 text-xs" />
        </div>
      </Card>

      {/* B. Préopératoire */}
      <CollapsibleSection title="Évaluation préopératoire" icon={Stethoscope}>
        <div className="space-y-4">
          {/* A. Évaluation clinique */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Évaluation clinique</p>
            <p className="mb-2 text-xs text-muted-foreground">Référence aux valeurs de l'examen général (acuité, PIO, segment antérieur, fond d'œil).</p>
            <div className="grid grid-cols-2 gap-4">
              <EyeColumn side="OD">
                <div className="flex items-center gap-2">
                  <CompactField label="AV" placeholder="8/10" width="70px" value={record.preoperative.visualAcuityOD} onChange={(v) => updatePreop('visualAcuityOD', v)} />
                  <CompactField label="PIO (mmHg)" placeholder="14" width="70px" value={record.preoperative.iopOD} onChange={(v) => updatePreop('iopOD', v)} />
                </div>
              </EyeColumn>
              <EyeColumn side="OG">
                <div className="flex items-center gap-2">
                  <CompactField label="AV" placeholder="9/10" width="70px" value={record.preoperative.visualAcuityOG} onChange={(v) => updatePreop('visualAcuityOG', v)} />
                  <CompactField label="PIO (mmHg)" placeholder="15" width="70px" value={record.preoperative.iopOG} onChange={(v) => updatePreop('iopOG', v)} />
                </div>
              </EyeColumn>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              <CompactField label="Segment antérieur" placeholder="Cornée claire, cristallin..." value={record.preoperative.anteriorSegment} onChange={(v) => updatePreop('anteriorSegment', v)} />
              <CompactField label="Fond d'œil" placeholder="Papille, macula..." value={record.preoperative.fundus} onChange={(v) => updatePreop('fundus', v)} />
              <CompactField label="Autres constatations" placeholder="—" value={record.preoperative.otherFindings} onChange={(v) => updatePreop('otherFindings', v)} />
            </div>
          </div>

          {/* B. Examens complémentaires */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Examens complémentaires</p>
            <p className="mb-1.5 text-xs text-muted-foreground">Lier les examens d'imagerie et de biologie existants.</p>
            <div className="flex flex-wrap gap-1">
              {supplementaryExamOptions.map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => toggleExam(exam)}
                  className={cn(
                    'rounded-md border px-2 py-1 text-[11px] transition-all',
                    record.preoperative.supplementaryExams.includes(exam)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {/* C. Préparation */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Préparation</p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              <CompactField label="Bilan préopératoire" placeholder="Disponible / En attente" value={record.preoperative.preopWorkup} onChange={(v) => updatePreop('preopWorkup', v)} />
              <div>
                <Label className="text-[10px] font-medium text-muted-foreground">Consentement</Label>
                <select value={record.preoperative.consent} onChange={(e) => updatePreop('consent', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                  <option value="">—</option><option value="oui">Obtenu</option><option value="non">En attente</option>
                </select>
              </div>
              <CompactField label="Documents requis" placeholder="Bilan, ECB..." value={record.preoperative.requiredDocuments} onChange={(v) => updatePreop('requiredDocuments', v)} />
              <CompactField label="Traitements en cours" placeholder="Anticoagulants..." value={record.preoperative.currentTreatments} onChange={(v) => updatePreop('currentTreatments', v)} />
              <CompactField label="Allergies" placeholder="Pénicilline, iode..." value={record.preoperative.allergies} onChange={(v) => updatePreop('allergies', v)} />
            </div>
            <Input value={record.preoperative.remarks} onChange={(e) => updatePreop('remarks', e.target.value)} placeholder="Remarques..." className="mt-1.5 h-7 text-xs" />
          </div>
        </div>
      </CollapsibleSection>

      {/* C. Intervention */}
      <CollapsibleSection title="Intervention / procédure" icon={Stethoscope}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            <CompactField label="Date" placeholder="JJ/MM/AAAA" value={record.procedure.date} onChange={(v) => updateProcedure('date', v)} type="date" />
            <CompactField label="Heure début" placeholder="08:00" value={record.procedure.startTime} onChange={(v) => updateProcedure('startTime', v)} />
            <CompactField label="Heure fin" placeholder="08:30" value={record.procedure.endTime} onChange={(v) => updateProcedure('endTime', v)} />
            <CompactField label="Procédure réalisée" placeholder="Phaco-émulsification + IOL" value={record.procedure.procedurePerformed} onChange={(v) => updateProcedure('procedurePerformed', v)} />
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Œil</Label>
              <div className="mt-0.5 flex gap-1">
                {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                  <button key={e} type="button" onClick={() => updateProcedure('eye', e)} className={cn('rounded-md border px-2 py-1 text-[11px] font-bold', record.procedure.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>{e}</button>
                ))}
              </div>
            </div>
            <CompactField label="Chirurgien" placeholder="Dr. Sabeg Ilias" value={record.procedure.surgeon} onChange={(v) => updateProcedure('surgeon', v)} />
            <CompactField label="Assistant" placeholder="—" value={record.procedure.assistant} onChange={(v) => updateProcedure('assistant', v)} />
            <CompactField label="Anesthésie" placeholder="Topique / Locorégionale / Générale" value={record.procedure.anesthesia} onChange={(v) => updateProcedure('anesthesia', v)} />
            <CompactField label="Technique" placeholder="Phaco-émulsification..." value={record.procedure.technique} onChange={(v) => updateProcedure('technique', v)} />
            <CompactField label="Matériel utilisé" placeholder="—" value={record.procedure.equipmentUsed} onChange={(v) => updateProcedure('equipmentUsed', v)} />
            <CompactField label="Actes associés" placeholder="—" value={record.procedure.associatedActs} onChange={(v) => updateProcedure('associatedActs', v)} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Incidents peropératoires</Label>
              <Textarea placeholder="Aucun..." rows={2} className="mt-1 text-sm" value={record.procedure.intraopIncidents} onChange={(e) => updateProcedure('intraopIncidents', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Complications</Label>
              <Textarea placeholder="Aucune..." rows={2} className="mt-1 text-sm" value={record.procedure.complications} onChange={(e) => updateProcedure('complications', e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notes opératoires</Label>
            <Textarea placeholder="Notes opératoires..." rows={2} className="mt-1 text-sm" value={record.procedure.operativeNotes} onChange={(e) => updateProcedure('operativeNotes', e.target.value)} />
          </div>
        </div>
      </CollapsibleSection>

      {/* D. Implant / Dispositif */}
      <CollapsibleSection title="Implant / dispositif" icon={Stethoscope}>
        <div className="space-y-3">
          <div>
            <Label className="text-[10px] font-medium text-muted-foreground">Présence d'un implant / dispositif</Label>
            <select value={record.implant.present} onChange={(e) => updateImplant('present', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs sm:w-40">
              <option value="">—</option><option value="oui">Oui</option><option value="non">Non</option>
            </select>
          </div>
          {record.implant.present === 'oui' && (
            <>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Type" placeholder="IOL, anneaux..." value={record.implant.type} onChange={(v) => updateImplant('type', v)} />
                <CompactField label="Fabricant" placeholder="Alcon" value={record.implant.manufacturer} onChange={(v) => updateImplant('manufacturer', v)} />
                <CompactField label="Modèle" placeholder="SN60WF" value={record.implant.model} onChange={(v) => updateImplant('model', v)} />
                <CompactField label="Référence" placeholder="—" value={record.implant.reference} onChange={(v) => updateImplant('reference', v)} />
                <CompactField label="Numéro de lot" placeholder="—" value={record.implant.lotNumber} onChange={(v) => updateImplant('lotNumber', v)} />
                <CompactField label="Puissance" placeholder="21.0 D" value={record.implant.power} onChange={(v) => updateImplant('power', v)} />
                <CompactField label="Matériau" placeholder="Hydrophobe" value={record.implant.material} onChange={(v) => updateImplant('material', v)} />
                <CompactField label="Emplacement" placeholder="Sac capsulaire" value={record.implant.placement} onChange={(v) => updateImplant('placement', v)} />
                <div>
                  <Label className="text-[10px] font-medium text-muted-foreground">Œil</Label>
                  <div className="mt-0.5 flex gap-1">
                    {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                      <button key={e} type="button" onClick={() => updateImplant('eye', e)} className={cn('rounded-md border px-2 py-1 text-[11px] font-bold', record.implant.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>{e}</button>
                    ))}
                  </div>
                </div>
              </div>
              <Input value={record.implant.notes} onChange={(e) => updateImplant('notes', e.target.value)} placeholder="Notes..." className="h-7 text-xs" />
              <p className="text-xs text-muted-foreground">Le médecin saisit et valide l'implant. Aucun calcul automatique de puissance.</p>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* E. Postopératoire */}
      <CollapsibleSection title="Postopératoire" icon={Stethoscope}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            <CompactField label="Date" placeholder="JJ/MM/AAAA" value={record.postoperative.date} onChange={(v) => updatePostop('date', v)} type="date" />
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Œil</Label>
              <div className="mt-0.5 flex gap-1">
                {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                  <button key={e} type="button" onClick={() => updatePostop('eye', e)} className={cn('rounded-md border px-2 py-1 text-[11px] font-bold', record.postoperative.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>{e}</button>
                ))}
              </div>
            </div>
            <CompactField label="AV" placeholder="10/10" value={record.postoperative.visualAcuity} onChange={(v) => updatePostop('visualAcuity', v)} />
            <CompactField label="PIO (mmHg)" placeholder="14" value={record.postoperative.iop} onChange={(v) => updatePostop('iop', v)} />
            <CompactField label="Douleur" placeholder="Aucune / Modérée" value={record.postoperative.pain} onChange={(v) => updatePostop('pain', v)} />
            <CompactField label="Inflammation" placeholder="0 à 4+" value={record.postoperative.inflammation} onChange={(v) => updatePostop('inflammation', v)} />
            <CompactField label="Segment antérieur" placeholder="Claire, calme" value={record.postoperative.anteriorSegment} onChange={(v) => updatePostop('anteriorSegment', v)} />
            <CompactField label="Fond d'œil" placeholder="Normal" value={record.postoperative.fundus} onChange={(v) => updatePostop('fundus', v)} />
            <CompactField label="Implant / dispositif" placeholder="Bien positionné" value={record.postoperative.implantDevice} onChange={(v) => updatePostop('implantDevice', v)} />
            <CompactField label="Cicatrisation" placeholder="Normale" value={record.postoperative.healing} onChange={(v) => updatePostop('healing', v)} />
            <CompactField label="Complications" placeholder="Aucune" value={record.postoperative.complications} onChange={(v) => updatePostop('complications', v)} />
            <CompactField label="Traitement" placeholder="Dexaméthasone collyre" value={record.postoperative.treatment} onChange={(v) => updatePostop('treatment', v)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Consignes</Label>
            <Textarea placeholder="Consignes postopératoires..." rows={2} className="mt-1 text-sm" value={record.postoperative.instructions} onChange={(e) => updatePostop('instructions', e.target.value)} />
          </div>
          <Input value={record.postoperative.notes} onChange={(e) => updatePostop('notes', e.target.value)} placeholder="Notes..." className="h-7 text-xs" />
        </div>
      </CollapsibleSection>

      {/* F. Suivi */}
      <CollapsibleSection title="Suivi" icon={History}>
        <div className="space-y-2">
          {record.followUps.map((fu) => (
            <div key={fu.id} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold">Suivi du {fu.date || '...'}</span>
                <button type="button" onClick={() => removeFollowUp(fu.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={fu.date} onChange={(v) => updateFollowUp(fu.id, 'date', v)} type="date" />
                <CompactField label="Délai depuis intervention" placeholder="J+1, J+7..." value={fu.delaySinceSurgery} onChange={(v) => updateFollowUp(fu.id, 'delaySinceSurgery', v)} />
                <CompactField label="Prochaine visite" placeholder="JJ/MM/AAAA" value={fu.nextVisit} onChange={(v) => updateFollowUp(fu.id, 'nextVisit', v)} type="date" />
                <CompactField label="AV OD" placeholder="10/10" value={fu.visualAcuityOD} onChange={(v) => updateFollowUp(fu.id, 'visualAcuityOD', v)} />
                <CompactField label="AV OG" placeholder="10/10" value={fu.visualAcuityOG} onChange={(v) => updateFollowUp(fu.id, 'visualAcuityOG', v)} />
                <CompactField label="PIO OD" placeholder="14" value={fu.iopOD} onChange={(v) => updateFollowUp(fu.id, 'iopOD', v)} />
                <CompactField label="PIO OG" placeholder="15" value={fu.iopOG} onChange={(v) => updateFollowUp(fu.id, 'iopOG', v)} />
                <CompactField label="Examen clinique" placeholder="—" value={fu.clinicalExam} onChange={(v) => updateFollowUp(fu.id, 'clinicalExam', v)} />
                <CompactField label="Imagerie / examen" placeholder="OCT..." value={fu.imaging} onChange={(v) => updateFollowUp(fu.id, 'imaging', v)} />
                <CompactField label="Traitement" placeholder="—" value={fu.treatment} onChange={(v) => updateFollowUp(fu.id, 'treatment', v)} />
                <CompactField label="Évolution" placeholder="Favorable / Défavorable" value={fu.evolution} onChange={(v) => updateFollowUp(fu.id, 'evolution', v)} />
                <CompactField label="Complication" placeholder="Aucune" value={fu.complication} onChange={(v) => updateFollowUp(fu.id, 'complication', v)} />
              </div>
              <Input value={fu.notes} onChange={(e) => updateFollowUp(fu.id, 'notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={addFollowUp}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un suivi</Button>

          {/* Compact chronological table */}
          {record.followUps.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Œil</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">AV</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">PIO</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Évolution</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Traitement</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Prochaine</th>
                  </tr>
                </thead>
                <tbody>
                  {record.followUps.map((fu) => (
                    <tr key={fu.id} className="border-b border-border/50">
                      <td className="px-2 py-2">{fu.date || '—'}</td>
                      <td className="px-2 py-2 text-center">{record.eye}</td>
                      <td className="px-2 py-2 text-center tabular-nums">{fu.visualAcuityOD || fu.visualAcuityOG || '—'}</td>
                      <td className="px-2 py-2 text-center tabular-nums">{fu.iopOD || fu.iopOG || '—'}</td>
                      <td className="px-2 py-2 text-center">{fu.evolution || '—'}</td>
                      <td className="px-2 py-2 text-center">{fu.treatment || '—'}</td>
                      <td className="px-2 py-2 text-center">{fu.nextVisit || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* G. Compte rendu */}
      <CollapsibleSection title="Compte rendu" icon={FileText}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            <CompactField label="Indication" placeholder="—" value={record.report.indication} onChange={(v) => updateReport('indication', v)} />
            <CompactField label="Procédure" placeholder="—" value={record.report.procedure} onChange={(v) => updateReport('procedure', v)} />
            <CompactField label="Date" placeholder="JJ/MM/AAAA" value={record.report.date} onChange={(v) => updateReport('date', v)} type="date" />
            <CompactField label="Chirurgien" placeholder="Dr. Sabeg Ilias" value={record.report.surgeon} onChange={(v) => updateReport('surgeon', v)} />
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Œil</Label>
              <div className="mt-0.5 flex gap-1">
                {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                  <button key={e} type="button" onClick={() => updateReport('eye', e)} className={cn('rounded-md border px-2 py-1 text-[11px] font-bold', record.report.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>{e}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Constatations</Label>
              <Textarea placeholder="Constatations peropératoires..." rows={2} className="mt-1 text-sm" value={record.report.findings} onChange={(e) => updateReport('findings', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Déroulement</Label>
              <Textarea placeholder="Déroulement de l'intervention..." rows={2} className="mt-1 text-sm" value={record.report.course} onChange={(e) => updateReport('course', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Incidents / complications</Label>
              <Textarea placeholder="Aucun..." rows={2} className="mt-1 text-sm" value={record.report.incidentsComplications} onChange={(e) => updateReport('incidentsComplications', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Implant / dispositif</Label>
              <Textarea placeholder="—" rows={2} className="mt-1 text-sm" value={record.report.implantDevice} onChange={(e) => updateReport('implantDevice', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Traitement postopératoire</Label>
              <Textarea placeholder="—" rows={2} className="mt-1 text-sm" value={record.report.postopTreatment} onChange={(e) => updateReport('postopTreatment', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Consignes</Label>
              <Textarea placeholder="—" rows={2} className="mt-1 text-sm" value={record.report.instructions} onChange={(e) => updateReport('instructions', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Suivi</Label>
              <Textarea placeholder="—" rows={2} className="mt-1 text-sm" value={record.report.followUp} onChange={(e) => updateReport('followUp', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Conclusion</Label>
              <Textarea placeholder="Conclusion..." rows={2} className="mt-1 text-sm" value={record.report.conclusion} onChange={(e) => updateReport('conclusion', e.target.value)} />
            </div>
          </div>
          <Input value={record.report.notes} onChange={(e) => updateReport('notes', e.target.value)} placeholder="Notes..." className="h-7 text-xs" />
          <p className="text-xs text-muted-foreground">Le médecin rédige et valide le compte rendu. Aucune génération automatique.</p>
        </div>
      </CollapsibleSection>

      {/* Surgery history */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowHistory(true)}>
          <History className="h-3.5 w-3.5" /> Historique chirurgical
        </Button>
      </div>

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Historique chirurgical</SheetTitle>
            <SheetDescription>Liste des interventions enregistrées.</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Procédure</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Œil</th>
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Chirurgien</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Statut</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">CR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2">15/03/2026</td>
                    <td className="px-2 py-2">Phaco + IOL</td>
                    <td className="px-2 py-2 text-center">OD</td>
                    <td className="px-2 py-2">Dr. Sabeg Ilias</td>
                    <td className="px-2 py-2 text-center"><span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">Réalisée</span></td>
                    <td className="px-2 py-2 text-center"><FileText className="h-3.5 w-3.5 text-primary mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Données saisies par le médecin. Aucune génération automatique.</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
