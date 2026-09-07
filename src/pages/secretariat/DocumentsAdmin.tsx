import { useState, useMemo } from 'react';
import { Search, FileText, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockDocuments } from '@/data/mockClinical';

const typeLabels: Record<string, string> = {
  prescription: 'Ordonnance',
  medical_report: 'Compte-rendu',
  exam_report: "Rapport d'examen",
  imaging: 'Imagerie',
  certificate: 'Certificat médical',
  administrative: 'Document administratif',
};

export default function DocumentsAdmin() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const matchesQuery = !query.trim() || `${doc.title} ${doc.patientName}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === 'all' || doc.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [query, typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents administratifs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestion des documents non cliniques du centre.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un document..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Tous les types</option>
          <option value="administrative">Administratif</option>
          <option value="certificate">Certificat</option>
          <option value="prescription">Ordonnance</option>
          <option value="medical_report">Compte-rendu</option>
          <option value="exam_report">Rapport d'examen</option>
          <option value="imaging">Imagerie</option>
        </select>
      </div>

      {/* Document list */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Document</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground sm:table-cell">Type</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground md:table-cell">Patient</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Taille</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{doc.title}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{typeLabels[doc.type] || doc.type}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{doc.patientName}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">{doc.date}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{doc.size || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun document trouvé.</p>
        )}
      </Card>
    </div>
  );
}
