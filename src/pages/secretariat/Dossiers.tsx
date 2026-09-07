import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockPatients } from '@/data/mockPatients';

export default function Dossiers() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return mockPatients;
    const q = query.toLowerCase();
    return mockPatients.filter((p) =>
      `${p.firstName} ${p.lastName} ${p.patientId} ${p.phone}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dossiers administratifs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestion des informations administratives des patients.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, numéro de dossier, téléphone..."
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Results */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">N° dossier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Patient</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground sm:table-cell">Téléphone</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground md:table-cell">Ville</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground lg:table-cell">Assurance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/patient/${p.id}`)}
                >
                  <td className="px-4 py-3 text-sm font-medium">{p.patientId}</td>
                  <td className="px-4 py-3 text-sm">{p.firstName} {p.lastName}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{p.phone}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{p.city || '—'}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">{p.insurance || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                      {p.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun dossier trouvé.</p>
        )}
        {filtered.length > 20 && (
          <div className="border-t border-border p-3 text-center text-xs text-muted-foreground">
            Affichage de 20 dossiers sur {filtered.length}.
          </div>
        )}
      </Card>
    </div>
  );
}
