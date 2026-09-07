import { useState } from 'react';
import { Eye, Plus, Trash2, History } from 'lucide-react';
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
import type { RetinaData, MaculaEntry, PeripheralRetinaEntry, VesselsEntry, AngiographyEntry, DiabeticRetinopathyEntry, RetinaTreatmentEntry } from '@/types/ophthalmology';

const emptyMacula = (): MaculaEntry => ({
  aspect: '', edema: '', exudates: '', hemorrhages: '', drusen: '', epiretinalMembrane: '', macularHole: '', otherAnomalies: '', notes: '',
});

const emptyPeripheral = (): PeripheralRetinaEntry => ({
  tear: '', detachment: '', degeneration: '', laser: '', hemorrhage: '', otherAnomalies: '', notes: '',
});

const emptyVessels = (): VesselsEntry => ({
  caliber: '', tortuosity: '', anomalies: '', neovascularization: '', otherFindings: '',
});

const emptyAngio = (): AngiographyEntry => ({
  type: 'fluoresceine', eye: 'OU', date: '', indication: '', results: '', interpretation: '', conclusion: '', documentRef: '',
});

const emptyDR = (): DiabeticRetinopathyEntry => ({
  diabetesType: '', duration: '', hba1c: '', treatment: '', knownRetinopathy: '', stage: '', priorLaser: '', intravitrealInjections: '', vitrectomy: '', notes: '',
});

const emptyTreatment = (): RetinaTreatmentEntry => ({
  type: 'anti_vegf', agent: '', eye: 'OU', date: '', indication: '', dose: '', notes: '', result: '',
});

export function RetinaSection() {
  const [data, setData] = useState<RetinaData>({
    context: '', eye: 'OU', diagnosisDate: '', evolution: '', priorTreatments: '', notes: '',
    macula: { OD: emptyMacula(), OG: emptyMacula() },
    peripheralRetina: { OD: emptyPeripheral(), OG: emptyPeripheral() },
    vessels: emptyVessels(),
    angiography: [], diabeticRetinopathy: emptyDR(), treatments: [],
  });
  const [showHistory, setShowHistory] = useState(false);

  const updateMacula = (side: EyeSide, field: keyof MaculaEntry, value: string) => {
    setData((prev) => ({ ...prev, macula: { ...prev.macula, [side]: { ...prev.macula[side], [field]: value } } }));
  };

  const updatePeripheral = (side: EyeSide, field: keyof PeripheralRetinaEntry, value: string) => {
    setData((prev) => ({ ...prev, peripheralRetina: { ...prev.peripheralRetina, [side]: { ...prev.peripheralRetina[side], [field]: value } } }));
  };

  const updateVessels = (field: keyof VesselsEntry, value: string) => {
    setData((prev) => ({ ...prev, vessels: { ...prev.vessels, [field]: value } }));
  };

  const updateDR = (field: keyof DiabeticRetinopathyEntry, value: string) => {
    setData((prev) => ({ ...prev, diabeticRetinopathy: { ...prev.diabeticRetinopathy, [field]: value } }));
  };

  return (
    <div className="space-y-4">
      {/* A. Contexte rétinien */}
      <Card className="p-4">
        <SectionHeader id="retina-context" icon={Eye} title="Contexte rétinien" accent="bg-chart-5/10 text-chart-5" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <CompactField label="Ant. rétinien" placeholder="Oui / Non" value={data.context} onChange={(v) => setData((p) => ({ ...p, context: v }))} />
          <div>
            <Label className="text-[10px] font-medium text-muted-foreground">Œil</Label>
            <div className="mt-0.5 flex gap-1">
              {(['OD', 'OG', 'OU'] as EyeScope[]).map((e) => (
                <button key={e} type="button" onClick={() => setData((p) => ({ ...p, eye: e }))} className={cn('rounded-md border px-2 py-1 text-[11px] font-bold', data.eye === e ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>{e}</button>
              ))}
            </div>
          </div>
          <CompactField label="Date diagnostic" placeholder="JJ/MM/AAAA" value={data.diagnosisDate} onChange={(v) => setData((p) => ({ ...p, diagnosisDate: v }))} type="date" />
          <CompactField label="Évolution" placeholder="Stable / Progressive" value={data.evolution} onChange={(v) => setData((p) => ({ ...p, evolution: v }))} />
          <CompactField label="Traitements antérieurs" placeholder="Anti-VEGF, laser..." value={data.priorTreatments} onChange={(v) => setData((p) => ({ ...p, priorTreatments: v }))} />
        </div>
        <Input value={data.notes} onChange={(e) => setData((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes..." className="mt-2 h-7 text-xs" />
      </Card>

      {/* B. Macula */}
      <Card className="p-4">
        <SectionHeader id="retina-macula" icon={Eye} title="Macula" accent="bg-chart-5/10 text-chart-5" />
        <div className="grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <div className="grid grid-cols-2 gap-1.5">
                <CompactField label="Aspect" placeholder="Normal / Anormal" value={data.macula[side].aspect} onChange={(v) => updateMacula(side, 'aspect', v)} />
                <CompactField label="Œdème" placeholder="Oui / Non" value={data.macula[side].edema} onChange={(v) => updateMacula(side, 'edema', v)} />
                <CompactField label="Exsudats" placeholder="Oui / Non" value={data.macula[side].exudates} onChange={(v) => updateMacula(side, 'exudates', v)} />
                <CompactField label="Hémorragies" placeholder="Oui / Non" value={data.macula[side].hemorrhages} onChange={(v) => updateMacula(side, 'hemorrhages', v)} />
                <CompactField label="Drusen" placeholder="Oui / Non" value={data.macula[side].drusen} onChange={(v) => updateMacula(side, 'drusen', v)} />
                <CompactField label="Membrane épirét." placeholder="Oui / Non" value={data.macula[side].epiretinalMembrane} onChange={(v) => updateMacula(side, 'epiretinalMembrane', v)} />
                <CompactField label="Trou maculaire" placeholder="Oui / Non" value={data.macula[side].macularHole} onChange={(v) => updateMacula(side, 'macularHole', v)} />
                <CompactField label="Autres anomalies" placeholder="—" value={data.macula[side].otherAnomalies} onChange={(v) => updateMacula(side, 'otherAnomalies', v)} />
              </div>
              <Input value={data.macula[side].notes} onChange={(e) => updateMacula(side, 'notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* C. Rétine périphérique */}
      <Card className="p-4">
        <SectionHeader id="retina-peripheral" icon={Eye} title="Rétine périphérique" accent="bg-chart-5/10 text-chart-5" />
        <div className="grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <div className="grid grid-cols-2 gap-1.5">
                <CompactField label="Déchirure" placeholder="Oui / Non" value={data.peripheralRetina[side].tear} onChange={(v) => updatePeripheral(side, 'tear', v)} />
                <CompactField label="Décollement" placeholder="Oui / Non" value={data.peripheralRetina[side].detachment} onChange={(v) => updatePeripheral(side, 'detachment', v)} />
                <CompactField label="Dégénérescence" placeholder="Palissade / Grille" value={data.peripheralRetina[side].degeneration} onChange={(v) => updatePeripheral(side, 'degeneration', v)} />
                <CompactField label="Laser" placeholder="Oui / Non" value={data.peripheralRetina[side].laser} onChange={(v) => updatePeripheral(side, 'laser', v)} />
                <CompactField label="Hémorragie" placeholder="Oui / Non" value={data.peripheralRetina[side].hemorrhage} onChange={(v) => updatePeripheral(side, 'hemorrhage', v)} />
                <CompactField label="Autres anomalies" placeholder="—" value={data.peripheralRetina[side].otherAnomalies} onChange={(v) => updatePeripheral(side, 'otherAnomalies', v)} />
              </div>
              <Input value={data.peripheralRetina[side].notes} onChange={(e) => updatePeripheral(side, 'notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* D. Vaisseaux */}
      <Card className="p-4">
        <SectionHeader id="retina-vessels" icon={Eye} title="Vaisseaux" accent="bg-chart-5/10 text-chart-5" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <CompactField label="Calibre" placeholder="Normal / Anormal" value={data.vessels.caliber} onChange={(v) => updateVessels('caliber', v)} />
          <CompactField label="Tortuosité" placeholder="Normale / Augmentée" value={data.vessels.tortuosity} onChange={(v) => updateVessels('tortuosity', v)} />
          <CompactField label="Anomalies" placeholder="AV, micro-anévrismes" value={data.vessels.anomalies} onChange={(v) => updateVessels('anomalies', v)} />
          <CompactField label="Néovascularisation" placeholder="Oui / Non" value={data.vessels.neovascularization} onChange={(v) => updateVessels('neovascularization', v)} />
          <CompactField label="Autres constatations" placeholder="—" value={data.vessels.otherFindings} onChange={(v) => updateVessels('otherFindings', v)} />
        </div>
      </Card>

      {/* E. OCT — reference */}
      <Card className="p-4">
        <SectionHeader id="retina-oct" icon={Eye} title="OCT / OCT-A" accent="bg-chart-5/10 text-chart-5" />
        <p className="text-xs text-muted-foreground">Référence aux examens OCT / OCT-A du module d'imagerie. Affichage des résultats, interprétation et conclusion saisis par le médecin.</p>
      </Card>

      {/* F. Rétinographie — reference */}
      <Card className="p-4">
        <SectionHeader id="retina-retinography" icon={Eye} title="Rétinographie" accent="bg-chart-5/10 text-chart-5" />
        <p className="text-xs text-muted-foreground">Référence aux enregistrements de rétinographie du module d'imagerie.</p>
      </Card>

      {/* G. Angiographie */}
      <CollapsibleSection title="Angiographie" icon={Eye}>
        <div className="space-y-2">
          {data.angiography.map((a, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex gap-1">
                  <select value={a.type} onChange={(e) => { const na = [...data.angiography]; na[i] = { ...a, type: e.target.value as AngiographyEntry['type'] }; setData((p) => ({ ...p, angiography: na })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs">
                    <option value="fluoresceine">Fluorescéine</option><option value="ICG">ICG</option><option value="autre">Autre</option>
                  </select>
                  <select value={a.eye} onChange={(e) => { const na = [...data.angiography]; na[i] = { ...a, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, angiography: na })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                    <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                  </select>
                </div>
                <button type="button" onClick={() => setData((p) => ({ ...p, angiography: p.angiography.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={a.date} onChange={(v) => { const na = [...data.angiography]; na[i] = { ...a, date: v }; setData((p) => ({ ...p, angiography: na })); }} type="date" />
                <CompactField label="Indication" placeholder="DMLA, DR..." value={a.indication} onChange={(v) => { const na = [...data.angiography]; na[i] = { ...a, indication: v }; setData((p) => ({ ...p, angiography: na })); }} />
                <CompactField label="Document" placeholder="Réf." value={a.documentRef} onChange={(v) => { const na = [...data.angiography]; na[i] = { ...a, documentRef: v }; setData((p) => ({ ...p, angiography: na })); }} />
              </div>
              <Input value={a.results} onChange={(e) => { const na = [...data.angiography]; na[i] = { ...a, results: e.target.value }; setData((p) => ({ ...p, angiography: na })); }} placeholder="Résultats..." className="mt-1.5 h-7 text-xs" />
              <Input value={a.interpretation} onChange={(e) => { const na = [...data.angiography]; na[i] = { ...a, interpretation: e.target.value }; setData((p) => ({ ...p, angiography: na })); }} placeholder="Interprétation..." className="mt-1.5 h-7 text-xs" />
              <Input value={a.conclusion} onChange={(e) => { const na = [...data.angiography]; na[i] = { ...a, conclusion: e.target.value }; setData((p) => ({ ...p, angiography: na })); }} placeholder="Conclusion..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, angiography: [...p.angiography, emptyAngio()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une angiographie</Button>
        </div>
      </CollapsibleSection>

      {/* H. Diabète / RD */}
      <CollapsibleSection title="Diabète / Rétinopathie diabétique" icon={Eye}>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          <CompactField label="Type de diabète" placeholder="Type 1 / Type 2" value={data.diabeticRetinopathy.diabetesType} onChange={(v) => updateDR('diabetesType', v)} />
          <CompactField label="Ancienneté" placeholder="10 ans" value={data.diabeticRetinopathy.duration} onChange={(v) => updateDR('duration', v)} />
          <CompactField label="HbA1c" placeholder="7.5%" value={data.diabeticRetinopathy.hba1c} onChange={(v) => updateDR('hba1c', v)} />
          <CompactField label="Traitement" placeholder="Insuline / ADO" value={data.diabeticRetinopathy.treatment} onChange={(v) => updateDR('treatment', v)} />
          <CompactField label="RD connue" placeholder="Oui / Non" value={data.diabeticRetinopathy.knownRetinopathy} onChange={(v) => updateDR('knownRetinopathy', v)} />
          <CompactField label="Stade" placeholder="Non proliférante..." value={data.diabeticRetinopathy.stage} onChange={(v) => updateDR('stage', v)} />
          <CompactField label="Laser antérieur" placeholder="Oui / Non" value={data.diabeticRetinopathy.priorLaser} onChange={(v) => updateDR('priorLaser', v)} />
          <CompactField label="Injections IV" placeholder="Oui / Non" value={data.diabeticRetinopathy.intravitrealInjections} onChange={(v) => updateDR('intravitrealInjections', v)} />
          <CompactField label="Vitrectomie" placeholder="Oui / Non" value={data.diabeticRetinopathy.vitrectomy} onChange={(v) => updateDR('vitrectomy', v)} />
        </div>
        <Input value={data.diabeticRetinopathy.notes} onChange={(e) => updateDR('notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
        <p className="mt-2 text-xs text-muted-foreground">Aucun staging automatique. Le médecin saisit le stade et les paramètres.</p>
      </CollapsibleSection>

      {/* I. Traitements rétiniens */}
      <CollapsibleSection title="Traitements rétiniens" icon={Eye}>
        <div className="space-y-2">
          {data.treatments.map((tr, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex gap-1">
                  <select value={tr.type} onChange={(e) => { const nt = [...data.treatments]; nt[i] = { ...tr, type: e.target.value as RetinaTreatmentEntry['type'] }; setData((p) => ({ ...p, treatments: nt })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs">
                    <option value="anti_vegf">Anti-VEGF</option><option value="corticoid">Corticoïde IV</option><option value="laser">Laser</option><option value="chirurgie">Chirurgie</option><option value="autre">Autre</option>
                  </select>
                  <select value={tr.eye} onChange={(e) => { const nt = [...data.treatments]; nt[i] = { ...tr, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, treatments: nt })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                    <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                  </select>
                </div>
                <button type="button" onClick={() => setData((p) => ({ ...p, treatments: p.treatments.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Médicament / Procédure" placeholder="Ranibizumab" value={tr.agent} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, agent: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={tr.date} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, date: v }; setData((p) => ({ ...p, treatments: nt })); }} type="date" />
                <CompactField label="Indication" placeholder="Œdème maculaire" value={tr.indication} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, indication: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Dose" placeholder="0.5 mg" value={tr.dose} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, dose: v }; setData((p) => ({ ...p, treatments: nt })); }} />
                <CompactField label="Résultat / Évolution" placeholder="Stable" value={tr.result} onChange={(v) => { const nt = [...data.treatments]; nt[i] = { ...tr, result: v }; setData((p) => ({ ...p, treatments: nt })); }} />
              </div>
              <Input value={tr.notes} onChange={(e) => { const nt = [...data.treatments]; nt[i] = { ...tr, notes: e.target.value }; setData((p) => ({ ...p, treatments: nt })); }} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, treatments: [...p.treatments, emptyTreatment()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un traitement</Button>
        </div>
      </CollapsibleSection>

      {/* Évolution */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowHistory(true)}>
          <History className="h-3.5 w-3.5" /> Évolution rétinienne
        </Button>
      </div>

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Évolution rétinienne</SheetTitle>
            <SheetDescription>Historique longitudinal.</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">OCT</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Macula</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Traitement</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Évolution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2">12/06/2026</td>
                    <td className="px-2 py-2 text-center">Normal</td>
                    <td className="px-2 py-2 text-center">Sans œdème</td>
                    <td className="px-2 py-2 text-center">Anti-VEGF</td>
                    <td className="px-2 py-2 text-center">Stable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
