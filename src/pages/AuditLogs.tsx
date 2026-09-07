import { ScrollText, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { mockAuditLogs } from '@/data/mockClinical';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const actionColors: Record<string, string> = {
  'Créé': 'bg-success/10 text-success',
  'Modifié': 'bg-warning/10 text-warning',
  'Téléversé': 'bg-primary/10 text-primary',
  'Supprimé': 'bg-destructive/10 text-destructive',
};

export default function AuditLogs() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockAuditLogs.filter(log =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      (log.patient || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('auditLogs')}</h1>
        <p className="text-muted-foreground">{filtered.length} entrées · {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ms-3" />
          <Input placeholder="Rechercher dans les logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Utilisateur</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Module</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Heure</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">IP</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {log.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${actionColors[log.action] || 'bg-muted text-muted-foreground'}`}>
                      <ScrollText className="h-3 w-3" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{log.module}</td>
                  <td className="px-4 py-3 text-sm">{log.patient || '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{log.date}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{log.time}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{log.ip}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
