import { useState, useMemo } from 'react';
import {
  FileText, Download, Trash2, Eye, Shield, Plus,
  Image as ImageIcon, FlaskConical, Printer,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { mockMedicalDocuments, mockLabResults } from '@/data/mockImagingData';
import { mockPatients } from '@/data/mockPatients';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { MedicalDocument, MedicalDocumentCategory, LaboratoryResult, LaboratoryExamType, Attachment } from '@/types';

// ── Static config ────────────────────────────────────────────────────────────

const categoryConfig: { key: MedicalDocumentCategory; label: string; icon: LucideIcon; color: string }[] = [
  { key: 'resultat_biologique', label: 'Résultat biologique', icon: FlaskConical, color: 'bg-accent/10 text-accent' },
  { key: 'imagerie', label: 'Imagerie', icon: ImageIcon, color: 'bg-warning/10 text-warning' },
  { key: 'compte_rendu_operatoire', label: 'Compte rendu opératoire', icon: FileText, color: 'bg-destructive/10 text-destructive' },
  { key: 'compte_rendu_hospitalier', label: 'Compte rendu hospitalier', icon: FileText, color: 'bg-primary/10 text-primary' },
  { key: 'courrier_specialiste', label: 'Courrier spécialiste', icon: FileText, color: 'bg-chart-5/10 text-chart-5' },
  { key: 'lettre_orientation', label: "Lettre d'orientation", icon: FileText, color: 'bg-success/10 text-success' },
  { key: 'ordonnance_anterieure', label: 'Ordonnance antérieure', icon: FileText, color: 'bg-success/10 text-success' },
  { key: 'dossier_medical_anterieur', label: 'Dossier médical antérieur', icon: FileText, color: 'bg-muted text-muted-foreground' },
  { key: 'autre', label: 'Autre', icon: FileText, color: 'bg-muted text-muted-foreground' },
];

const labExamLabels: Record<LaboratoryExamType, string> = {
  hba1c: 'HbA1c',
  glycemie: 'Glycémie',
  nfs: 'NFS',
  creatinine: 'Créatinine',
  uree: 'Urée',
  bilan_lipidique: 'Bilan lipidique',
  crp: 'CRP',
  vs: 'VS',
  thyroide: 'Thyroïde',
  autre: 'Autre',
};

function getCategoryConfig(cat: string) {
  return categoryConfig.find(c => c.key === cat) || categoryConfig[categoryConfig.length - 1];
}

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

export default function Documents() {
  const { t } = useI18n();
  const patient = mockPatients[0];
  const documents = mockMedicalDocuments;
  const labResults = mockLabResults;

  const [activeCategory, setActiveCategory] = useState<MedicalDocumentCategory | 'all'>('all');
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [selectedLab, setSelectedLab] = useState<LaboratoryResult | null>(null);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAddLab, setShowAddLab] = useState(false);

  const filteredDocs = useMemo(() => {
    if (activeCategory === 'all') return documents;
    return documents.filter(d => d.category === activeCategory);
  }, [documents, activeCategory]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('documents')}</h1>
          <p className="text-muted-foreground">{patient.firstName} {patient.lastName} · {patient.patientId}</p>
        </div>
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 overflow-x-auto bg-muted/50 p-1.5">
          <TabsTrigger value="documents" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {t('documents')} ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="lab" className="gap-1.5">
            <FlaskConical className="h-3.5 w-3.5" />
            {t('laboratoryResults')} ({labResults.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Documents Tab ──────────────────────────────────────────────── */}
        <TabsContent value="documents" className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                  activeCategory === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                )}
              >
                {t('allTypes')}
              </button>
              {categoryConfig.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                    activeCategory === cat.key ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <Button size="sm" className="gap-2 shrink-0" onClick={() => setShowAddDoc(true)}>
              <Plus className="h-4 w-4" />
              {t('addDocument')}
            </Button>
          </div>

          {/* Documents table */}
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('docName')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('docCategory')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('date')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('docSource')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('fileType')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('fileSize')}</th>
                  <th className="px-3 py-2 text-end text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => {
                  const catCfg = getCategoryConfig(doc.category);
                  const Icon = catCfg.icon;
                  return (
                    <tr
                      key={doc.id}
                      className="border-b border-border/40 transition-colors hover:bg-muted/20 cursor-pointer"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', catCfg.color)}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{catCfg.label}</td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{doc.date}</td>
                      <td className="px-3 py-2 text-muted-foreground">{doc.source}</td>
                      <td className="px-3 py-2"><span className="text-xs font-medium uppercase">{doc.fileType}</span></td>
                      <td className="px-3 py-2 text-muted-foreground">{doc.attachment.fileSize}</td>
                      <td className="px-3 py-2 text-end" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedDoc(doc)} title={t('view')}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={t('download')}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={t('print')}>
                            <Printer className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" title={t('delete')}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Security note */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Documents sécurisés</p>
                <p className="text-xs text-muted-foreground">Tous les documents sont chiffrés et accessibles uniquement aux utilisateurs autorisés.</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ── Laboratory Results Tab ────────────────────────────────────── */}
        <TabsContent value="lab" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{labResults.length} résultat(s) biologique(s)</p>
            <Button size="sm" className="gap-2" onClick={() => setShowAddLab(true)}>
              <Plus className="h-4 w-4" />
              {t('addLabResult')}
            </Button>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('labExam')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('labResult')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('unit')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('referenceValues')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('date')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('laboratory')}</th>
                  <th className="px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('interpretation')}</th>
                  <th className="px-3 py-2 text-end text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {labResults.map((lab) => (
                  <tr
                    key={lab.id}
                    className="border-b border-border/40 transition-colors hover:bg-muted/20 cursor-pointer"
                    onClick={() => setSelectedLab(lab)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
                          <FlaskConical className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium">{lab.examName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium tabular-nums">{lab.result}</td>
                    <td className="px-3 py-2 text-muted-foreground">{lab.unit}</td>
                    <td className="px-3 py-2 text-muted-foreground">{lab.referenceValues}</td>
                    <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{lab.date}</td>
                    <td className="px-3 py-2 text-muted-foreground">{lab.laboratory}</td>
                    <td className="px-3 py-2 max-w-[180px] truncate">{lab.interpretation}</td>
                    <td className="px-3 py-2 text-end" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedLab(lab)} title={t('view')}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={t('download')}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Document Detail Dialog ─────────────────────────────────────────── */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedDoc && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const catCfg = getCategoryConfig(selectedDoc.category);
                    const Icon = catCfg.icon;
                    return <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', catCfg.color)}><Icon className="h-3.5 w-3.5" /></div>;
                  })()}
                  {selectedDoc.name}
                </DialogTitle>
                <DialogDescription>{selectedDoc.patientName} · {selectedDoc.date}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('docCategory')}</Label>
                    <p className="text-sm">{getCategoryConfig(selectedDoc.category).label}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('docSource')}</Label>
                    <p className="text-sm">{selectedDoc.source}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('fileType')}</Label>
                    <p className="text-sm uppercase">{selectedDoc.fileType}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('fileSize')}</Label>
                    <p className="text-sm">{selectedDoc.attachment.fileSize}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('docDescription')}</Label>
                  <p className="text-sm">{selectedDoc.description}</p>
                </div>
                {selectedDoc.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
                    <p className="text-sm text-muted-foreground">{selectedDoc.notes}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">{t('attachment')}</Label>
                  <div className="mt-1.5">
                    <AttachmentChip att={selectedDoc.attachment} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> {t('download')}</Button>
                <Button variant="outline" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" /> {t('print')}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Lab Result Detail Dialog ───────────────────────────────────────── */}
      <Dialog open={!!selectedLab} onOpenChange={(open) => !open && setSelectedLab(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedLab && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <FlaskConical className="h-3.5 w-3.5" />
                  </div>
                  {selectedLab.examName}
                </DialogTitle>
                <DialogDescription>{selectedLab.patientName} · {selectedLab.date} · {selectedLab.laboratory}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('labResult')}</Label>
                    <p className="text-lg font-bold tabular-nums">{selectedLab.result} <span className="text-sm font-normal text-muted-foreground">{selectedLab.unit}</span></p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('referenceValues')}</Label>
                    <p className="text-sm">{selectedLab.referenceValues}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('interpretation')}</Label>
                  <p className="text-sm">{selectedLab.interpretation}</p>
                </div>
                {selectedLab.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
                    <p className="text-sm text-muted-foreground">{selectedLab.notes}</p>
                  </div>
                )}
                {selectedLab.attachments.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('attachments')}</Label>
                    <div className="mt-1.5 space-y-2">
                      {selectedLab.attachments.map(att => <AttachmentChip key={att.id} att={att} />)}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> {t('download')}</Button>
                <Button variant="outline" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" /> {t('print')}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add Document Dialog ─────────────────────────────────────────────── */}
      <Dialog open={showAddDoc} onOpenChange={setShowAddDoc}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> {t('addDocument')}</DialogTitle>
            <DialogDescription>{patient.firstName} {patient.lastName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">{t('docName')}</Label>
                <Input placeholder="Nom du document..." className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('docCategory')}</Label>
                <select className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-1.5 text-sm">
                  {categoryConfig.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('date')}</Label>
                <Input type="date" className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('docSource')}</Label>
                <Input placeholder="Source..." className="mt-1 h-8 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('docDescription')}</Label>
              <Textarea placeholder="Description..." rows={2} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
              <Input placeholder="Notes..." className="mt-1 h-8 text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDoc(false)}>{t('cancel')}</Button>
            <Button onClick={() => setShowAddDoc(false)}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Lab Result Dialog ───────────────────────────────────────────── */}
      <Dialog open={showAddLab} onOpenChange={setShowAddLab}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> {t('addLabResult')}</DialogTitle>
            <DialogDescription>{patient.firstName} {patient.lastName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">{t('labExam')}</Label>
                <select className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-1.5 text-sm">
                  {Object.entries(labExamLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('labResult')}</Label>
                <Input placeholder="Résultat..." className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('unit')}</Label>
                <Input placeholder="Unité..." className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('referenceValues')}</Label>
                <Input placeholder="Valeurs de référence..." className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('date')}</Label>
                <Input type="date" className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('laboratory')}</Label>
                <Input placeholder="Laboratoire..." className="mt-1 h-8 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('interpretation')}</Label>
              <Textarea placeholder="Interprétation clinique..." rows={2} className="mt-1 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
              <Input placeholder="Notes..." className="mt-1 h-8 text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLab(false)}>{t('cancel')}</Button>
            <Button onClick={() => setShowAddLab(false)}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
