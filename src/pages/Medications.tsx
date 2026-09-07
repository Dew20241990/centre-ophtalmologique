import { useState, useMemo } from 'react';
import { Search, Plus, Check, X, Pill } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { mockMedications } from '@/data/mockMedications';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Medications() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockMedications.filter(m =>
      m.commercialName.toLowerCase().includes(search.toLowerCase()) ||
      m.dci.toLowerCase().includes(search.toLowerCase()) ||
      m.dosage.toLowerCase().includes(search.toLowerCase()) ||
      m.form.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('medications')}</h1>
          <p className="text-muted-foreground">{filtered.length} médicaments en base</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ms-3" />
          <Input placeholder="Rechercher par nom, DCI, dosage, forme..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('commercialName')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('dci')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('dosage')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('form')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('laboratory')}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('therapeuticClass')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((med) => (
                <tr key={med.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
                        <Pill className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{med.commercialName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{med.dci}</td>
                  <td className="px-4 py-3 text-sm">{med.dosage}</td>
                  <td className="px-4 py-3 text-sm">{med.form}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{med.laboratory}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{med.therapeuticClass}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {med.active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <Check className="h-3.5 w-3.5" /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <X className="h-3.5 w-3.5" /> Inactif
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
