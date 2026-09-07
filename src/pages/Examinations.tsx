import { useState, useMemo } from 'react';
import { Microscope, Search, Plus } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { mockExaminations } from '@/data/mockClinical';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EyeBadge } from '@/components/shared/EyeBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const examTypeLabels: Record<string, string> = {
  OCT: 'OCT',
  retinography: 'Rétinographie',
  visual_field: 'Champ visuel',
  corneal_topography: 'Topographie cornéenne',
  biometry: 'Biométrie',
  pachymetry: 'Pachymétrie',
  ultrasound: 'Échographie',
  angiography: 'Angiographie',
  other: 'Autre',
};

export default function Examinations() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return mockExaminations.filter(e => {
      const matchesSearch = !search || e.patientName.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || e.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('examinations')}</h1>
          <p className="text-muted-foreground">{filtered.length} examens</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('addExamination')}
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ms-3" />
            <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder={t('type')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              {Object.entries(examTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exam) => (
          <Card key={exam.id} className="p-5 cursor-pointer hover:shadow-card transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Microscope className="h-5 w-5" />
              </div>
              {exam.eye !== 'both' && <EyeBadge side={exam.eye as 'OD' | 'OG'} size="sm" />}
            </div>
            <h3 className="mt-3 text-sm font-bold">{examTypeLabels[exam.type]}</h3>
            <p className="text-xs text-muted-foreground">{exam.patientName}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{exam.date}</span>
              <span className={exam.result === 'Normal' ? 'font-medium text-success' : 'font-medium text-destructive'}>
                {exam.result}
              </span>
            </div>
            {exam.notes && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{exam.notes}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
