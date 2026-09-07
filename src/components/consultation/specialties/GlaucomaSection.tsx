import { useState } from 'react';
import { Activity, Plus, Trash2, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { SectionHeader, EyeColumn, CompactField, CollapsibleSection } from '@/components/shared/exam/ExamParts';
import { cn } from '@/lib/utils';
import type { EyeSide, EyeScope } from '@/types';
import type {
  GlaucomaData, GoniometryEntry, OpticNerveEntry,
  OctGlaucomaEntry, VisualFieldEntry, GlaucomaTreatmentEntry,
} from '@/types/ophthalmology';

const glaucomaTypes = [
  { key: 'angle_ouvert', label: 'Angle ouvert' },
  { key: 'angle_ferme', label: 'Angle fermé' },
  { key: 'normal_tension', label: 'Tension normale' },
  { key: 'secondaire', label: 'Secondaire' },
  { key: 'suspect', label: 'Suspect' },
  { key: 'autre', label: 'Autre' },
];

const riskFactorOptions = [
  'Âge', 'Familial', 'Myopie', 'Diabète', 'HTA', 'Corticoïde', 'Traumatisme', 'Vasculaire', 'Autre',
];

const emptyOpticNerve = (): OpticNerveEntry => ({
  papilla: '', cupDiscRatio: '', asymmetry: '', pallor: '', papillaryHemorrhage: '', otherAnomalies: '', notes: '',
});

const emptyGoniometry = (): GoniometryEntry => ({
  eye: 'OU', angle: '', pigmentation: '', synechiae: '', neovascularization: '', findings: '', notes: '',
});

const emptyOct = (): OctGlaucomaEntry => ({
  rnfl: '', gcc: '', odAnalysis: '', ogAnalysis: '', date: '', device: '', interpretation: '', conclusion: '',
});

const emptyVisualField = (): VisualFieldEntry => ({
  eye: 'OU', strategy: '', test: '', date: '', reliability: '', indices: '', interpretation: '', conclusion: '', documentRef: '',
});

const emptyTreatment = (): GlaucomaTreatmentEntry => ({
  medication: '', eye: 'OU', concentration: '', posology: '', frequency: '', duration: '', adherence: '', response: '', sideEffects: '', notes: '',
});

export function GlaucomaSection() {
  const [data, setData] = useState<GlaucomaData>({
    suspicion: '', familyHistory: '', knownGlaucoma: '', type: '', diagnosisDate: '', eye: 'OU',
    riskFactors: [], traumaHistory: '', steroidHistory: '', surgicalHistory: '',
    goniometry: [], opticNerve: { OD: emptyOpticNerve(), OG: emptyOpticNerve() },
    oct: [], visualField: [], treatments: [],
  });
  const [showHistory, setShowHistory] = useState(false);

  const update = (field: keyof GlaucomaData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateOpticNerve = (side: EyeSide, field: keyof OpticNerveEntry, value: string) => {
    setData((prev) => ({
      ...prev,
      opticNerve: { ...prev.opticNerve, [side]: { ...prev.opticNerve[side], [field]: value } },
    }));
  };

  const toggleRisk = (rf: string) => {
    setData((prev) => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(rf)
        ? prev.riskFactors.filter((r) => r !== rf)
        : [...prev.riskFactors, rf],
    }));
  };

  return (
    <div className="space-y-4">
      {/* A. Contexte */}
      <Card className="p-4">
        <SectionHeader id="glaucoma-context" icon={Activity} title="Contexte glaucomateux" accent="bg-warning/10 text-warning" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Suspicion</Label>
              <select value={data.suspicion} onChange={(e) => update('suspicion', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                <option value="">—</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Glaucome connu</Label>
              <select value={data.knownGlaucoma} onChange={(e) => update('knownGlaucoma', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                <option value="">—</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Ant. familiaux</Label>
              <Input value={data.familyHistory} onChange={(e) => update('familyHistory', e.target.value)} className="h-7 text-xs" placeholder="Oui / Non / Détails" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Type de glaucome</Label>
              <select value={data.type} onChange={(e) => update('type', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                <option value="">—</option>
                {glaucomaTypes.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <CompactField label="Date diagnostic" placeholder="JJ/MM/AAAA" value={data.diagnosisDate} onChange={(v) => update('diagnosisDate', v)} type="date" />
            <div>
              <Label className="text-[10px] font-medium text-muted-foreground">Œil concerné</Label>
              <div className="mt-0.5 flex gap-1">
                {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                  <button key={e} type="button" onClick={() => update('eye', e)} className={cn('rounded-md border px-2 py-1 text-[11px] font-bold', data.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>{e}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-[10px] font-medium text-muted-foreground">Facteurs de risque</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {riskFactorOptions.map((rf) => (
                <button key={rf} type="button" onClick={() => toggleRisk(rf)} className={cn('rounded-md border px-2 py-1 text-[11px] transition-all', data.riskFactors.includes(rf) ? 'border-warning bg-warning/10 text-warning' : 'border-border text-muted-foreground hover:bg-muted')}>{rf}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <CompactField label="Traumatisme" placeholder="Oui / Non / Détails" value={data.traumaHistory} onChange={(v) => update('traumaHistory', v)} />
            <CompactField label="Corticothérapie" placeholder="Oui / Non / Détails" value={data.steroidHistory} onChange={(v) => update('steroidHistory', v)} />
            <CompactField label="Ant. chirurgicaux" placeholder="Trabéculectomie..." value={data.surgicalHistory} onChange={(v) => update('surgicalHistory', v)} />
          </div>
        </div>
      </Card>

      {/* B. PIO — reference to existing tonometry */}
      <Card className="p-4">
        <SectionHeader id="glaucoma-iop" icon={Activity} title="Pression intraoculaire" accent="bg-warning/10 text-warning" />
        <p className="text-xs text-muted-foreground">Référence aux valeurs de tonométrie saisies dans l'examen général.</p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <div className="flex items-center gap-2">
                <CompactField label="PIO (mmHg)" placeholder="14" width="80px" />
                <CompactField label="Corrigée" placeholder="15" width="80px" />
              </div>
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* C. Pachymétrie — reference */}
      <Card className="p-4">
        <SectionHeader id="glaucoma-pachy" icon={Activity} title="Cornée / Pachymétrie" accent="bg-accent/10 text-accent" />
        <p className="text-xs text-muted-foreground">Référence aux valeurs de pachymétrie saisies dans l'examen général.</p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <CompactField label="CCT (µm)" placeholder="540" width="80px" />
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* D. Gonioscopie */}
      <Card className="p-4">
        <SectionHeader id="glaucoma-gonio" icon={Activity} title="Gonioscopie" accent="bg-warning/10 text-warning" />
        <div className="space-y-2">
          {data.goniometry.map((g, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={g.eye} onChange={(e) => { const ng = [...data.goniometry]; ng[i] = { ...g, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, goniometry: ng })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                  <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, goniometry: p.goniometry.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Angle" placeholder="Ouvert / Étroit / Fermé" value={g.angle} onChange={(v) => { const ng = [...data.goniometry]; ng[i] = { ...g, angle: v }; setData((p) => ({ ...p, goniometry: ng })); }} />
                <CompactField label="Pigmentation" placeholder="0 à 4" value={g.pigmentation} onChange={(v) => { const ng = [...data.goniometry]; ng[i] = { ...g, pigmentation: v }; setData((p) => ({ ...p, goniometry: ng })); }} />
                <CompactField label="Synéchies" placeholder="Oui / Non" value={g.synechiae} onChange={(v) => { const ng = [...data.goniometry]; ng[i] = { ...g, synechiae: v }; setData((p) => ({ ...p, goniometry: ng })); }} />
                <CompactField label="Néovascularisation" placeholder="Oui / Non" value={g.neovascularization} onChange={(v) => { const ng = [...data.goniometry]; ng[i] = { ...g, neovascularization: v }; setData((p) => ({ ...p, goniometry: ng })); }} />
                <CompactField label="Constatations" placeholder="—" value={g.findings} onChange={(v) => { const ng = [...data.goniometry]; ng[i] = { ...g, findings: v }; setData((p) => ({ ...p, goniometry: ng })); }} />
              </div>
              <Input value={g.notes} onChange={(e) => { const ng = [...data.goniometry]; ng[i] = { ...g, notes: e.target.value }; setData((p) => ({ ...p, goniometry: ng })); }} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, goniometry: [...p.goniometry, emptyGoniometry()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une gonioscopie</Button>
        </div>
      </Card>

      {/* E. Nerf optique */}
      <Card className="p-4">
        <SectionHeader id="glaucoma-nerve" icon={Activity} title="Nerf optique" accent="bg-warning/10 text-warning" />
        <div className="grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <div className="grid grid-cols-2 gap-1.5">
                <CompactField label="Papille" placeholder="Normale / Atrophie" value={data.opticNerve[side].papilla} onChange={(v) => updateOpticNerve(side, 'papilla', v)} />
                <CompactField label="Rapport C/D" placeholder="0.4" value={data.opticNerve[side].cupDiscRatio} onChange={(v) => updateOpticNerve(side, 'cupDiscRatio', v)} />
                <CompactField label="Asymétrie" placeholder="< 0.2" value={data.opticNerve[side].asymmetry} onChange={(v) => updateOpticNerve(side, 'asymmetry', v)} />
                <CompactField label="Pallor" placeholder="Oui / Non" value={data.opticNerve[side].pallor} onChange={(v) => updateOpticNerve(side, 'pallor', v)} />
                <CompactField label="Hémorragie pap." placeholder="Oui / Non" value={data.opticNerve[side].papillaryHemorrhage} onChange={(v) => updateOpticNerve(side, 'papillaryHemorrhage', v)} />
                <CompactField label="Autres anomalies" placeholder="—" value={data.opticNerve[side].otherAnomalies} onChange={(v) => updateOpticNerve(side, 'otherAnomalies', v)} />
              </div>
              <Input value={data.opticNerve[side].notes} onChange={(e) => updateOpticNerve(side, 'notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* F. OCT glaucomateux */}
      <CollapsibleSection title="OCT glaucomateux" icon={Activity}>
        <div className="space-y-2">
          {data.oct.map((o, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold">OCT #{i + 1}</span>
                <button type="button" onClick={() => setData((p) => ({ ...p, oct: p.oct.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="RNFL (µm)" placeholder="90" value={o.rnfl} onChange={(v) => { const na = [...data.oct]; na[i] = { ...o, rnfl: v }; setData((p) => ({ ...p, oct: na })); }} />
                <CompactField label="GCC (µm)" placeholder="80" value={o.gcc} onChange={(v) => { const na = [...data.oct]; na[i] = { ...o, gcc: v }; setData((p) => ({ ...p, oct: na })); }} />
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={o.date} onChange={(v) => { const na = [...data.oct]; na[i] = { ...o, date: v }; setData((p) => ({ ...p, oct: na })); }} type="date" />
                <CompactField label="Appareil" placeholder="OCT" value={o.device} onChange={(v) => { const na = [...data.oct]; na[i] = { ...o, device: v }; setData((p) => ({ ...p, oct: na })); }} />
                <CompactField label="Analyse OD" placeholder="—" value={o.odAnalysis} onChange={(v) => { const na = [...data.oct]; na[i] = { ...o, odAnalysis: v }; setData((p) => ({ ...p, oct: na })); }} />
                <CompactField label="Analyse OG" placeholder="—" value={o.ogAnalysis} onChange={(v) => { const na = [...data.oct]; na[i] = { ...o, ogAnalysis: v }; setData((p) => ({ ...p, oct: na })); }} />
              </div>
              <Input value={o.interpretation} onChange={(e) => { const na = [...data.oct]; na[i] = { ...o, interpretation: e.target.value }; setData((p) => ({ ...p, oct: na })); }} placeholder="Interprétation..." className="mt-1.5 h-7 text-xs" />
              <Input value={o.conclusion} onChange={(e) => { const na = [...data.oct]; na[i] = { ...o, conclusion: e.target.value }; setData((p) => ({ ...p, oct: na })); }} placeholder="Conclusion..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, oct: [...p.oct, emptyOct()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un OCT</Button>
        </div>
      </CollapsibleSection>

      {/* G. Champ visuel */}
      <CollapsibleSection title="Champ visuel" icon={Activity}>
        <div className="space-y-2">
          {data.visualField.map((vf, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={vf.eye} onChange={(e) => { const nv = [...data.visualField]; nv[i] = { ...vf, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, visualField: nv })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                  <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, visualField: p.visualField.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Stratégie" placeholder="SITA-Standard" value={vf.strategy} onChange={(v) => { const nv = [...data.visualField]; nv[i] = { ...vf, strategy: v }; setData((p) => ({ ...p, visualField: nv })); }} />
                <CompactField label="Test" placeholder="24-2" value={vf.test} onChange={(v) => { const nv = [...data.visualField]; nv[i] = { ...vf, test: v }; setData((p) => ({ ...p, visualField: nv })); }} />
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={vf.date} onChange={(v) => { const nv = [...data.visualField]; nv[i] = { ...vf, date: v }; setData((p) => ({ ...p, visualField: nv })); }} type="date" />
                <CompactField label="Fiabilité" placeholder="Bonne" value={vf.reliability} onChange={(v) => { const nv = [...data.visualField]; nv[i] = { ...vf, reliability: v }; setData((p) => ({ ...p, visualField: nv })); }} />
                <CompactField label="Indices" placeholder="MD, PSD" value={vf.indices} onChange={(v) => { const nv = [...data.visualField]; nv[i] = { ...vf, indices: v }; setData((p) => ({ ...p, visualField: nv })); }} />
                <CompactField label="Document" placeholder="Réf." value={vf.documentRef} onChange={(v) => { const nv = [...data.visualField]; nv[i] = { ...vf, documentRef: v }; setData((p) => ({ ...p, visualField: nv })); }} />
              </div>
              <Input value={vf.interpretation} onChange={(e) => { const nv = [...data.visualField]; nv[i] = { ...vf, interpretation: e.target.value }; setData((p) => ({ ...p, visualField: nv })); }} placeholder="Interprétation..." className="mt-1.5 h-7 text-xs" />
              <Input value={vf.conclusion} onChange={(e) => { const nv = [...data.visualField]; nv[i] = { ...vf, conclusion: e.target.value }; setData((p) => ({ ...p, visualField: nv })); }} placeholder="Conclusion..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, visualField: [...p.visualField, emptyVisualField()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un champ visuel</Button>
        </div>
      </CollapsibleSection>

      {/* H. Traitement */}
      <CollapsibleSection title="Traitement du glaucome" icon={Activity}>
        <div className="space-y-2">
          {data.treatments.map((tr, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={tr.eye} onChange={(e) => { const nt = [...data.treatments]; nt[i] = { ...tr, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, treatments: nt })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                  <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, treatments: p.treatments.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Médicament" placeholder="Latanoprost" value={tr.medication} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, medication: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Concentration" placeholder="0.005%" value={tr.concentration} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, concentration: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Posologie" placeholder="1 goutte" value={tr.posology} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, posology: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Fréquence" placeholder="1x/jour" value={tr.frequency} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, frequency: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Durée" placeholder="30 jours" value={tr.duration} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, duration: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Observance" placeholder="Bonne" value={tr.adherence} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, adherence: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Réponse" placeholder="Stable" value={tr.response} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, response: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Effets indésirables" placeholder="Aucun" value={tr.sideEffects} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, sideEffects: v }; setData((p) => ({ ...p, treatments: nt })); }} />
              </div>
              <Input value={tr.notes} onChange={(e) => { const nt = [...data.treatments]; nt[i] = { ...tr, notes: e.target.value }; setData((p) => ({ ...p, treatments: nt })); }} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, treatments: [...p.treatments, emptyTreatment()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un traitement</Button>
        </div>
      </CollapsibleSection>

      {/* I. Évolution */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowHistory(true)}>
          <History className="h-3.5 w-3.5" /> Évolution glaucome
        </Button>
      </div>

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Évolution glaucome</SheetTitle>
            <SheetDescription>Historique longitudinal des paramètres glaucomateux.</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">PIO OD</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">PIO OG</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">C/D OD</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">C/D OG</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">RNFL</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">CV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2">12/06/2026</td>
                    <td className="px-2 py-2 text-center tabular-nums">14</td>
                    <td className="px-2 py-2 text-center tabular-nums">15</td>
                    <td className="px-2 py-2 text-center tabular-nums">0.4</td>
                    <td className="px-2 py-2 text-center tabular-nums">0.5</td>
                    <td className="px-2 py-2 text-center">88 µm</td>
                    <td className="px-2 py-2 text-center">Normal</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2">15/03/2026</td>
                    <td className="px-2 py-2 text-center tabular-nums">16</td>
                    <td className="px-2 py-2 text-center tabular-nums">17</td>
                    <td className="px-2 py-2 text-center tabular-nums">0.4</td>
                    <td className="px-2 py-2 text-center tabular-nums">0.5</td>
                    <td className="px-2 py-2 text-center">90 µm</td>
                    <td className="px-2 py-2 text-center">Normal</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Données longitudinales saisies par le médecin. Aucune interprétation automatique.</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
