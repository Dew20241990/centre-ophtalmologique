import { useState } from 'react';
import { Layers, Plus, Trash2, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { SectionHeader, EyeColumn, CompactField, CollapsibleSection } from '@/components/shared/exam/ExamParts';
import type { EyeSide, EyeScope } from '@/types';
import type { CorneaData, CorneaExamEntry, TopographyEntry, KeratoconusEntry, CorneaHistoryEntry } from '@/types/ophthalmology';

const emptyExam = (): CorneaExamEntry => ({
  transparency: '', epithelium: '', stroma: '', endothelium: '', scar: '', neovascularization: '', infiltrate: '', edema: '', otherAnomalies: '', notes: '',
});

const emptyTopo = (): TopographyEntry => ({
  type: 'topographie', mapType: '', axialMap: '', tangentialMap: '', elevation: '', pachymetryMap: '', indices: '', interpretation: '', conclusion: '', documentRef: '', date: '',
});

const emptyKc = (): KeratoconusEntry => ({
  eye: 'OU', stage: '', evolution: '', kmax: '', kmin: '', minPachymetry: '', progression: '', priorTreatment: '', crossLinking: '', intracornealRings: '', graft: '', contactLenses: '', notes: '',
});

const emptyHistory = (): CorneaHistoryEntry => ({
  keratoconus: '', dystrophy: '', degeneration: '', keratitis: '', ulcer: '', cornealSurgery: '', transplantation: '', refractiveSurgery: '', other: '', notes: '',
});

export function CorneaSection() {
  const [data, setData] = useState<CorneaData>({
    history: emptyHistory(),
    exam: { OD: emptyExam(), OG: emptyExam() },
    topography: [], keratoconus: [],
  });
  const [showHistory, setShowHistory] = useState(false);

  const updateExam = (side: EyeSide, field: keyof CorneaExamEntry, value: string) => {
    setData((prev) => ({ ...prev, exam: { ...prev.exam, [side]: { ...prev.exam[side], [field]: value } } }));
  };

  const updateHistory = (field: keyof CorneaHistoryEntry, value: string) => {
    setData((prev) => ({ ...prev, history: { ...prev.history, [field]: value } }));
  };

  return (
    <div className="space-y-4">
      {/* A. Antécédents cornéens */}
      <Card className="p-4">
        <SectionHeader id="cornea-history" icon={Layers} title="Antécédents cornéens" accent="bg-accent/10 text-accent" />
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          <CompactField label="Kératocône" placeholder="Oui / Non" value={data.history.keratoconus} onChange={(v) => updateHistory('keratoconus', v)} />
          <CompactField label="Dystrophie" placeholder="Oui / Non" value={data.history.dystrophy} onChange={(v) => updateHistory('dystrophy', v)} />
          <CompactField label="Dégénérescence" placeholder="Oui / Non" value={data.history.degeneration} onChange={(v) => updateHistory('degeneration', v)} />
          <CompactField label="Kératite" placeholder="Oui / Non" value={data.history.keratitis} onChange={(v) => updateHistory('keratitis', v)} />
          <CompactField label="Ulcère" placeholder="Oui / Non" value={data.history.ulcer} onChange={(v) => updateHistory('ulcer', v)} />
          <CompactField label="Chirurgie cornéenne" placeholder="Oui / Non" value={data.history.cornealSurgery} onChange={(v) => updateHistory('cornealSurgery', v)} />
          <CompactField label="Transplantation" placeholder="Oui / Non" value={data.history.transplantation} onChange={(v) => updateHistory('transplantation', v)} />
          <CompactField label="Chirurgie réfractive" placeholder="LASIK / PRK" value={data.history.refractiveSurgery} onChange={(v) => updateHistory('refractiveSurgery', v)} />
          <CompactField label="Autre" placeholder="—" value={data.history.other} onChange={(v) => updateHistory('other', v)} />
        </div>
        <Input value={data.history.notes} onChange={(e) => updateHistory('notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
      </Card>

      {/* B. Examen cornéen */}
      <Card className="p-4">
        <SectionHeader id="cornea-exam" icon={Layers} title="Examen cornéen" accent="bg-accent/10 text-accent" />
        <div className="grid grid-cols-2 gap-4">
          {(['OD', 'OG'] as EyeSide[]).map((side) => (
            <EyeColumn key={side} side={side}>
              <div className="grid grid-cols-2 gap-1.5">
                <CompactField label="Transparence" placeholder="Claire / Trouble" value={data.exam[side].transparency} onChange={(v) => updateExam(side, 'transparency', v)} />
                <CompactField label="Épithélium" placeholder="Intact / Anormal" value={data.exam[side].epithelium} onChange={(v) => updateExam(side, 'epithelium', v)} />
                <CompactField label="Stroma" placeholder="Normal / Anormal" value={data.exam[side].stroma} onChange={(v) => updateExam(side, 'stroma', v)} />
                <CompactField label="Endothélium" placeholder="Normal / Anormal" value={data.exam[side].endothelium} onChange={(v) => updateExam(side, 'endothelium', v)} />
                <CompactField label="Cicatrice" placeholder="Oui / Non" value={data.exam[side].scar} onChange={(v) => updateExam(side, 'scar', v)} />
                <CompactField label="Néovascularisation" placeholder="Oui / Non" value={data.exam[side].neovascularization} onChange={(v) => updateExam(side, 'neovascularization', v)} />
                <CompactField label="Infiltrat" placeholder="Oui / Non" value={data.exam[side].infiltrate} onChange={(v) => updateExam(side, 'infiltrate', v)} />
                <CompactField label="Œdème" placeholder="Oui / Non" value={data.exam[side].edema} onChange={(v) => updateExam(side, 'edema', v)} />
                <CompactField label="Autres anomalies" placeholder="—" value={data.exam[side].otherAnomalies} onChange={(v) => updateExam(side, 'otherAnomalies', v)} />
              </div>
              <Input value={data.exam[side].notes} onChange={(e) => updateExam(side, 'notes', e.target.value)} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </EyeColumn>
          ))}
        </div>
      </Card>

      {/* C. Kératométrie — reference */}
      <Card className="p-4">
        <SectionHeader id="cornea-kerato" icon={Layers} title="Kératométrie" accent="bg-accent/10 text-accent" />
        <p className="text-xs text-muted-foreground">Référence aux valeurs K1 / K2 / K moyen saisies dans l'examen général.</p>
      </Card>

      {/* D. Pachymétrie — reference */}
      <Card className="p-4">
        <SectionHeader id="cornea-pachy" icon={Layers} title="Pachymétrie" accent="bg-accent/10 text-accent" />
        <p className="text-xs text-muted-foreground">Référence aux valeurs CCT saisies dans l'examen général.</p>
      </Card>

      {/* E. Topographie / Tomographie */}
      <CollapsibleSection title="Topographie / Tomographie" icon={Layers}>
        <div className="space-y-2">
          {data.topography.map((t, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={t.type} onChange={(e) => { const nt = [...data.topography]; nt[i] = { ...t, type: e.target.value as TopographyEntry['type'] }; setData((p) => ({ ...p, topography: nt })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs">
                  <option value="topographie">Topographie</option><option value="tomographie">Tomographie</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, topography: p.topography.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Type de carte" placeholder="Axiale / Tangentielle" value={t.mapType} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, mapType: v }; setData((p) => ({ ...p, topography: nt })); }} />
                <CompactField label="Carte axiale" placeholder="—" value={t.axialMap} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, axialMap: v }; setData((p) => ({ ...p, topography: nt })); }} />
                <CompactField label="Carte tangentielle" placeholder="—" value={t.tangentialMap} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, tangentialMap: v }; setData((p) => ({ ...p, topography: nt })); }} />
                <CompactField label="Élévation" placeholder="—" value={t.elevation} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, elevation: v }; setData((p) => ({ ...p, topography: nt })); }} />
                <CompactField label="Pachymétrie" placeholder="—" value={t.pachymetryMap} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, pachymetryMap: v }; setData((p) => ({ ...p, topography: nt })); }} />
                <CompactField label="Indices" placeholder="ISV, IHA..." value={t.indices} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, indices: v }; setData((p) => ({ ...p, topography: nt })); }} />
                <CompactField label="Date" placeholder="JJ/MM/AAAA" value={t.date} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, date: v }; setData((p) => ({ ...p, topography: nt })); }} type="date" />
                <CompactField label="Document" placeholder="Réf." value={t.documentRef} onChange={(v) => { const nt = [...data.topography]; nt[i] = { ...t, documentRef: v }; setData((p) => ({ ...p, topography: nt })); }} />
              </div>
              <Input value={t.interpretation} onChange={(e) => { const nt = [...data.topography]; nt[i] = { ...t, interpretation: e.target.value }; setData((p) => ({ ...p, topography: nt })); }} placeholder="Interprétation..." className="mt-1.5 h-7 text-xs" />
              <Input value={t.conclusion} onChange={(e) => { const nt = [...data.topography]; nt[i] = { ...t, conclusion: e.target.value }; setData((p) => ({ ...p, topography: nt })); }} placeholder="Conclusion..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, topography: [...p.topography, emptyTopo()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un examen</Button>
          <p className="text-xs text-muted-foreground">Aucun diagnostic automatique de kératocône. Le médecin interprète les cartes.</p>
        </div>
      </CollapsibleSection>

      {/* F. Kératocône */}
      <CollapsibleSection title="Kératocône" icon={Layers}>
        <div className="space-y-2">
          {data.keratoconus.map((kc, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <select value={kc.eye} onChange={(e) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, eye: e.target.value as EyeScope }; setData((p) => ({ ...p, keratoconus: nk })); }} className="h-7 rounded-md border border-border bg-background px-2 text-xs font-bold">
                  <option value="OD">OD</option><option value="OG">OG</option><option value="OU">OU</option>
                </select>
                <button type="button" onClick={() => setData((p) => ({ ...p, keratoconus: p.keratoconus.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <CompactField label="Stade" placeholder="I / II / III / IV" value={kc.stage} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, stage: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Évolution" placeholder="Stable / Progressive" value={kc.evolution} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, evolution: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Kmax (D)" placeholder="48.0" value={kc.kmax} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, kmax: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Kmin (D)" placeholder="42.0" value={kc.kmin} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, kmin: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Pachy. min (µm)" placeholder="470" value={kc.minPachymetry} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, minPachymetry: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Progression" placeholder="Oui / Non" value={kc.progression} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, progression: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Traitement antérieur" placeholder="—" value={kc.priorTreatment} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, priorTreatment: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Cross-linking" placeholder="Oui / Non" value={kc.crossLinking} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, crossLinking: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Anneaux IC" placeholder="Oui / Non" value={kc.intracornealRings} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, intracornealRings: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Greffe" placeholder="Oui / Non" value={kc.graft} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, graft: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
                <CompactField label="Lentilles" placeholder="Oui / Non" value={kc.contactLenses} onChange={(v) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, contactLenses: v }; setData((p) => ({ ...p, keratoconus: nk })); }} />
              </div>
              <Input value={kc.notes} onChange={(e) => { const nk = [...data.keratoconus]; nk[i] = { ...kc, notes: e.target.value }; setData((p) => ({ ...p, keratoconus: nk })); }} placeholder="Notes..." className="mt-1.5 h-7 text-xs" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setData((p) => ({ ...p, keratoconus: [...p.keratoconus, emptyKc()] }))}><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un kératocône</Button>
          <p className="text-xs text-muted-foreground">Aucun staging ou calcul de progression automatique. Le médecin saisit les valeurs.</p>
        </div>
      </CollapsibleSection>

      {/* G. Lentilles — reference */}
      <Card className="p-4">
        <SectionHeader id="cornea-lenses" icon={Layers} title="Lentilles / Adaptation" accent="bg-accent/10 text-accent" />
        <p className="text-xs text-muted-foreground">Référence au module de prescription et d'adaptation de lentilles de contact de l'examen général (type, marque, BC, DIA, puissance, centrage, mouvement, confort, sur-réfraction).</p>
      </Card>

      {/* Évolution */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowHistory(true)}>
          <History className="h-3.5 w-3.5" /> Évolution cornéenne
        </Button>
      </div>

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Évolution cornéenne</SheetTitle>
            <SheetDescription>Historique longitudinal.</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Kmax</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Pachy.</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Topo.</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Lentilles</th>
                    <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Évolution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2">12/06/2026</td>
                    <td className="px-2 py-2 text-center tabular-nums">48.5</td>
                    <td className="px-2 py-2 text-center tabular-nums">470</td>
                    <td className="px-2 py-2 text-center">Anormale</td>
                    <td className="px-2 py-2 text-center">RGP</td>
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
