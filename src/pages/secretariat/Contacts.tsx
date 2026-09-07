import { useState, useMemo } from 'react';
import { Search, Phone, Mail, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockPatients } from '@/data/mockPatients';

export default function Contacts() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return mockPatients;
    const q = query.toLowerCase();
    return mockPatients.filter((p) =>
      `${p.firstName} ${p.lastName} ${p.phone} ${p.city || ''} ${p.email || ''}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Coordonnées des patients du centre.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, téléphone, ville..."
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Contact cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.slice(0, 18).map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {p.firstName[0]}{p.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.firstName} {p.lastName}</p>
                <p className="text-xs text-muted-foreground">{p.patientId}</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{p.phone}</span>
              </div>
              {p.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{p.email}</span>
                </div>
              )}
              {p.city && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{p.city}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucun contact trouvé.</p>
      )}
    </div>
  );
}
