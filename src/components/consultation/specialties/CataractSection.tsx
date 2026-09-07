import { useState } from 'react';
import { Disc3, Plus, Trash2, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { SectionHeader, EyeColumn, CompactField, CollapsibleSection } from '@/components/shared/exam/ExamParts';
import type { EyeSide, EyeScope } from '@/types';
import type { CataractData, CataractEntry, BiometryEntry, IOLImplantEntry, SurgicalPlanEntry, PostopEntry } from '@/types/ophthalmology';

const cataractTypes = [
  { key: 'nucleaire', label: 'Nucléaire' },
  { key: 'corticale', label: 'Corticale' },
  { key: 'posterieure', label: 'Postérieure' },
  { key: 'mixte', label: 'Mixte' },
  { key: 'congenitale', label: 'Congénitale' },
  { key: 'traumatique', label: 'Traumatique' },
  { key: 'autre', label: 'Autre' },
];

const cataractGrades = [
  { key: 'incipient', label: 'Incipient' },
  { key: 'immature', label: 'Immature' },
  { key: 'mature', label: 'Mature' },
  { key: 'hypermature', label: 'Hypermature' },
  { key: 'non_evaluee', label: 'Non évaluée' },
];

const emptyCataract = (): CataractEntry => ({
  presence: '', type: '', localization: '', grade: '', evolution: '', functionalImpairment: '', visualImpact: '', notes: '',
});

const emptyBiometry = (): BiometryEntry => ({
  axialLength: '', k1: '', axisK1: '', k2: '', axisK2: '', kAvg: '', cornealAstigmatism: '', anteriorChamberDepth: '', whiteToWhite: '', date: '', device: '', notes: '',
});

const emptyImplant = (): IOLImplantEntry => ({
  eye: 'OU', model: '', manufacturer: '', power: '', type: '', material: '', placement: '', notes: '',
});

const emptyPlan = (): SurgicalPlanEntry => ({
  indication: '', eye: 'OU', procedure: '', plannedDate: '', surgeon: '', preopExams: '', consent: '', remarks: '',
});

const emptyPostop = (): PostopEntry => ({
  date: '', eye: 'OU', visualAcuity: '', iop: '', anteriorSegment: '', inflammation: '', implant: '', complications: '', treatment: '', evolution: '', notes: '',
});

export function CataractSection() {
  const [data, setData] = useState<CataractData>({
    cataract: { OD: emptyCataract(), OG: emptyCataract() },
    biometry: { OD: emptyBiometry(), OG: emptyBiometry() },
    implants: [], surgicalPlan: [], postop: [],
  });
  const [showHistory, setShowHistory] = useState(false);

  const updateCataract = (side: EyeSide, field: keyof CataractEntry, value: string) => {
    setData((prev) => ({ ...prev, cataract: { ...prev.cataract, [side]: { ...prev.cataract[side], [field]: value } } }));
  };

  const updateBiometry = (side: EyeSide, field: keyof BiometryEntry, value: string) => {
    setData((prev) => ({ ...prev, biometry: { ...prev.biometry, [side]: { ...prev.biometry[side], [field]: value } } }));
  };

  return (
    <div className="space-y-4">
      {/* A. Cataracte */}
      <Card className="p-4">
        <SectionHeader id="cataract-main" icon={Disc3} title="Cataracte" accent="bg-primary/10 text-primary" />
        <div className="grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <Label className="text-[10px] font-medium text-muted-foreground">Présence</Label>
                  <select value={data.cataract[side].presence} onChange={(e) => updateCataract(side, 'presence', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                    <option value="">—</option><option value="oui">Oui</option><option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[10px] font-medium text-muted-foreground">Type</Label>
                  <select value={data.cataract[side].type} onChange={(e) => updateCataract(side, 'type', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                    <option value="">—</option>
                    {cataractTypes.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
                <CompactField label="Localisation" placeholder="Noyau / Cortex / SCP" value={data.cataract[side].localization} onChange={(v) => updateCataract(side, 'localization', v)} />
                <div>
                  <Label className="text-[10px] font-medium text-muted-foreground">Grade / Stade</Label>
                  <select value={data.cataract[side].grade} onChange={(e) => updateCataract(side, 'grade', e.target.value)} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                    <option value="">—</option>
                    {cataractGrades.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
                  </select>
                </div>
                <CompactField label="Évolution" placeholder="Stable / Progressive" value={data.cataract[side].evolution} onChange={(v) => updateCataract(side, 'evolution', v)} />
                <CompactField label="Gêne fonctionnelle" placeholder="Oui / Non" value={data.cataract[side].functionalImpairment} onChange={(v) => updateCataract(side, 'functionalImpairment', v)} />
                <CompactField label="Impact visuel" placeholder="Modéré / Sévère" value={data.cataract[side].visualImpact} onChange={(v) => updateCataract(side, 'visualImpact', v)} />
              </div>
              <Input value={data.cataract[side].notes} onChange={(e) => updateCataract(side, 'notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* B. Acuité — reference */}
      <Card className="p-4">
        <SectionHeader id="cataract-va" icon={Disc3} title="Acuité visuelle" accent="bg-primary/10 text-primary" />
        <p className="text-xs text-muted-foreground">Référence aux valeurs d'acuité visuelle saisies dans l'examen général (AVSC, MAVC, pinhole, près).</p>
      </Card>

      {/* C. Segment antérieur — reference */}
      <Card className="p-4">
        <SectionHeader id="cataract-anterior" icon={Disc3} title="Segment antérieur" accent="bg-primary/10 text-primary" />
        <p className="text-xs text-muted-foreground">Référence à l'examen du segment antérieur (cornée, chambre antérieure, iris, cristallin, capsule).</p>
      </Card>

      {/* D. Fond d'œil — reference */}
      <Card className="p-4">
        <SectionHeader id="cataract-fundus" icon={Disc3} title="Fond d'œil" accent="bg-primary/10 text-primary" />
        <p className="text-xs text-muted-foreground">Référence à l'examen du fond d'œil de l'examen général.</p>
      </Card>

      {/* E. Biométrie */}
      <Card className="p-4">
        <SectionHeader id="cataract-biometry" icon={Disc3} title="Biométrie" accent="bg-primary/10 text-primary" />
        <div className="grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <div className="grid grid-cols-2 gap-1.5">
                <CompactField label="Long. axiale (mm)" placeholder="23.50" value={data.biometry[side].axialLength} onChange={(v) => updateBiometry(side, 'axialLength', v)} />
                <CompactField label="Prof. CA (mm)" placeholder="3.2" value={data.biometry[side].anteriorChamberDepth} onChange={(v) => updateBiometry(side, 'anteriorChamberDepth', v)} />
                <CompactField label="K1 (D)" placeholder="43.00" value={data.biometry[side].k1} onChange={(v) => updateBiometry(side, 'k1', v)} />
                <CompactField label="Axe K1 (°)" placeholder="90" value={data.biometry[side].axisK1} onChange={(v) => updateBiometry(side, 'axisK1', v)} />
                <CompactField label="K2 (D)" placeholder="44.00" value={data.biometry[side].k2} onChange={(v) => updateBiometry(side, 'k2', v)} />
                <CompactField label="Axe K2 (°)" placeholder="180" value={data.biometry[side].axisK2} onChange={(v) => updateBiometry(side, 'axisK2', v)} />
                <CompactField label="K moyen (D)" placeholder="43.50" value={data.biometry[side].kAvg} onChange={(v) => updateBiometry(side, 'kAvg', v)} />
                <CompactField label="Astig. cornéen (D)" placeholder="1.00" value={data.biometry[side].cornealAstigmatism} onChange={(v) => updateBiometry(side, 'cornealAstigmatism', v)} />
                <CompactField label="Blanc-blanc (mm)" placeholder="11.5" value={data.biometry[side].whiteToWhite} onChange={(v) => updateBiometry(side, 'whiteToWhite', v)} />
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={data.biometry[side].date} onChange={(v) => updateBiometry(side, 'date', v)} type="date" />
                <CompactField label="Appareil" placeholder="IOLMaster" value={data.biometry[side].device} onChange={(v) => updateBiometry(side, 'device', v)} />
              </div>
              <Input value={data.biometry[side].notes} onChange={(e) => updateBiometry(side, 'notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* F. Implant intraoculaire */}
      <CollapsibleSection title="Implant intraoculaire" icon={Disc3}>
        <div className="space-y-2">
          {data.implants.map((imp, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={imp.eye} onChange={(e) => { const ni = [...data.implants]; ni[i] = { ...imp, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, implants: ni })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                  <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, implants: p.implants.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Modèle" placeholder="SN60WF" value={imp.model} onChange={(v) => { const ni = [...data.implants]; ni[i] = { ...imp, model: v }; setData((p) => ({ ...p, implants: ni })); }} />
                <CompactField label="Fabricant" placeholder="Alcon" value={imp.manufacturer} onChange={(v) => { const ni = [...data.implants]; ni[i] = { ...imp, manufacturer: v }; setData((p) => ({ ...p, implants: ni })); }} />
                <CompactField label="Puissance (D)" placeholder="21.0" value={imp.power} onChange={(v) => { const ni = [...data.implants]; ni[i] = { ...imp, power: v }; setData((p) => ({ ...p, implants: ni })); }} />
                <CompactField label="Type" placeholder="Monofocale" value={imp.type} onChange={(v) => { const ni = [...data.implants]; ni[i] = { ...imp, type: v }; setData((p) => ({ ...p, implants: ni })); }} />
                <CompactField label="Matériau" placeholder="Hydrophobe" value={imp.material} onChange={(v) => { const ni = [...data.implants]; ni[i] = { ...imp, material: v }; setData((p) => ({ ...p, implants: ni })); }} />
                <CompactField label="Emplacement" placeholder="Sac capsulaire" value={imp.placement} onChange={(v) => { const ni = [...data.implants]; ni[i] = { ...imp, placement: v }; setData((p) => ({ ...p, implants: ni })); }} />
              </div>
              <Input value={imp.notes} onChange={(e) => { const ni = [...data.implants]; ni[i] = { ...imp, notes: e.target.value }; setData((p) => ({ ...p, implants: ni })); }} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, implants: [...p.implants, emptyImplant()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un implant</Button>
          <p className="text-xs text-muted-foreground">Le médecin saisit et valide l'implant sélectionné. Aucun calcul automatique de puissance.</p>
        </div>
      </CollapsibleSection>

      {/* G. Projet chirurgical */}
      <CollapsibleSection title="Projet chirurgical" icon={Disc3}>
        <div className="space-y-2">
          {data.surgicalPlan.map((sp, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={sp.eye} onChange={(e) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, surgicalPlan: ns })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                  <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, surgicalPlan: p.surgicalPlan.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Indication" placeholder="Cataracte invalidante" value={sp.indication} onChange={(v) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, indication: v }; setData((p) => ({ ...p, surgicalPlan: ns })); }} />
                <CompactField label="Procédure" placeholder="Phaco-émulsification" value={sp.procedure} onChange={(v) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, procedure: v }; setData((p) => ({ ...p, surgicalPlan: ns })); }} />
                <CompactField label="Date prévue" placeholder="JJ/MM/AAAA" value={sp.plannedDate} onChange={(v) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, plannedDate: v }; setData((p) => ({ ...p, surgicalPlan: ns })); }} type="date" />
                <CompactField label="Chirurgien" placeholder="Dr. Sabeg Ilias" value={sp.surgeon} onChange={(v) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, surgeon: v }; setData((p) => ({ ...p, surgicalPlan: ns })); }} />
                <CompactField label="Examens préop." placeholder="Biométrie, ECB" value={sp.preopExams} onChange={(v) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, preopExams: v }; setData((p) => ({ ...p, surgicalPlan: ns })); }} />
                <div>
                  <Label className="text-[10px] font-medium text-muted-foreground">Consentement</Label>
                  <select value={sp.consent} onChange={(e) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, consent: e.target.value }; setData((p) => ({ ...p, surgicalPlan: ns })); }} className="mt-0.5 h-7 w-full rounded-md border border-border bg-background px-2 text-xs">
                    <option value="">—</option><option value="oui">Obtenu</option><option value="non">En attente</option>
                  </select>
                </div>
              </div>
              <Input value={sp.remarks} onChange={(e) => { const ns = [...data.surgicalPlan]; ns[i] = { ...sp, remarks: e.target.value }; setData((p) => ({ ...p, surgicalPlan: ns })); }} placeholder="Remarques..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, surgicalPlan: [...p.surgicalPlan, emptyPlan()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un projet</Button>
        </div>
      </CollapsibleSection>

      {/* H. Postopératoire */}
      <CollapsibleSection title="Postopératoire" icon={Disc3}>
        <div className="space-y-2">
          {data.postop.map((po, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={po.eye} onChange={(e) => { const np = [...data.postop]; np[i] = { ...po, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, postop: np })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                  <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, postop: p.postop.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={po.date} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, date: v }; setData((p) => ({ ...p, postop: np })); }} type="date" />
                <CompactField label="AV" placeholder="10/10" value={po.visualAcuity} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, visualAcuity: v }; setData((p) => ({ ...p, postop: np })); }} />
                <CompactField label="PIO (mmHg)" placeholder="14" value={po.iop} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, iop: v }; setData((p) => ({ ...p, postop: np })); }} />
                <CompactField label="Seg. antérieur" placeholder="Claire" value={po.anteriorSegment} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, anteriorSegment: v }; setData((p) => ({ ...p, postop: np })); }} />
                <CompactField label="Inflammation" placeholder="0 à 4+" value={po.inflammation} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, inflammation: v }; setData((p) => ({ ...p, postop: np })); }} />
                <CompactField label="Implant" placeholder="Bien positionné" value={po.implant} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, implant: v }; setData((p) => ({ ...p, postop: np })); }} />
                <CompactField label="Complications" placeholder="Aucune" value={po.complications} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, complications: v }; setData((p) => ({ ...p, postop: np })); }} />
                <CompactField label="Traitement" placeholder="Dexaméthasone" value={po.treatment} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, treatment: v }; setData((p) => ({ ...p, postop: np })); }} />
                <CompactField label="Évolution" placeholder="Favorable" value={po.evolution} onChange={(v) => { const np = [...data.postop]; np[i] = { ...po, evolution: v }; setData((p) => ({ ...p, postop: np })); }} />
              </div>
              <Input value={po.notes} onChange={(e) => { const np = [...data.postop]; np[i] = { ...po, notes: e.target.value }; setData((p) => ({ ...p, postop: np })); }} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, postop: [...p.postop, emptyPostop()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un suivi</Button>
        </div>
      </CollapsibleSection>

      {/* Évolution */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowHistory(true)}>
          <History className="h-3.5 w-3.5" /> Évolution cataracte
        </Button>
      </div>

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Évolution cataracte</SheetTitle>
            <SheetDescription>Historique longitudinal.</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">AV OD</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">AV OG</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Cataracte</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">PIO</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Évolution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2">12/06/2026</td>
                    <td className="px-2 py-2 text-center tabular-nums">8/10</td>
                    <td className="px-2 py-2 text-center tabular-nums">9/10</td>
                    <td className="px-2 py-2 text-center">Nucléaire OD</td>
                    <td className="px-2 py-2 text-center tabular-nums">14</td>
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
